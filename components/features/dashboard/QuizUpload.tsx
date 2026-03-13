"use client";

import React, { useState, useRef } from "react";
import { Upload, FileText, X, AlertCircle, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { generateFileHash } from "@/utils/quiz";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { quizService } from "@/lib/quizService";
import AdInterstitial from "../ads/AdInterstitial";

interface QuizUploadProps {
    onClose: () => void;
    isPremium?: boolean;
}

interface QuizMetadata {
    title?: string;
    topic?: string;
}

interface GenerateQuizResponse {
    questions: any[];
    metadata?: QuizMetadata;
    title?: string;
}

type Status = "idle" | "hashing" | "uploading" | "analyzing" | "saving" | "error" | "success" | "showing_ad";

export default function QuizUpload({ onClose, isPremium = false }: QuizUploadProps) {
    const t = useTranslations("Quiz");
    const ct = useTranslations("Common");
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<Status>("idle");
    const [error, setError] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const supabase = createClient();
    const [pendingQuizId, setPendingQuizId] = useState<string | null>(null);

    const [currentTip, setCurrentTip] = useState(0);

    const tips = [
        t("tip_1"),
        t("tip_2"),
        t("tip_3"),
        t("tip_4")
    ];

    React.useEffect(() => {
        let interval: NodeJS.Timeout;
        if (status === "analyzing") {
            interval = setInterval(() => {
                setCurrentTip((prev) => (prev + 1) % tips.length);
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [status, tips.length]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.type !== "application/pdf") {
                setError(t("only_pdf_error"));
                return;
            }
            if (selectedFile.size > 10 * 1024 * 1024) {
                setError(t("file_size_error"));
                return;
            }
            setFile(selectedFile);
            setError(null);
        }
    };

    const startGeneration = async () => {
        if (!file) return;

        try {
            // ── ADIM 1: Hash hesapla ──────────────────────────────────────────
            setStatus("hashing");
            const arrayBuffer = await file.arrayBuffer();
            const hash = await generateFileHash(arrayBuffer);

            // ── ADIM 2: Kullanıcı oturumunu al ───────────────────────────────
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error(t("no_session_error"));

            // ── ADIM 3: LocalStorage kontrolü ────────────────────────────────
            const cached = quizService.getLocalQuiz(hash);
            if (cached) {
                // Cache'de var → DB'de last_accessed_at güncelle ve yönlendir
                await quizService.checkUserLibrary(cached.id, user.id);
                setStatus("success");
                setTimeout(() => { onClose(); router.push(`/dashboard/quiz/${cached.id}`); }, 1200);
                return;
            }

            // ── ADIM 4: Global DB'de hash var mı? ────────────────────────────
            const existingQuiz = await quizService.getQuizByHash(hash);

            if (existingQuiz) {
                // Kullanıcı kütüphanesinde var mı?
                const alreadyOwned = await quizService.checkUserLibrary(existingQuiz.id, user.id);

                if (!alreadyOwned) {
                    // Quiz var ama kullanıcıda yoksa → kütüphaneye ekle (folder kalıtımıyla)
                    setStatus("saving");
                    await quizService.addQuizToLibrary(existingQuiz.id, user.id);
                }

                // LocalStorage'a cache'le
                const { localCache } = await import("@/lib/quizService");
                localCache.saveQuiz(hash, {
                    id: existingQuiz.id,
                    title: existingQuiz.title,
                    file_hash: hash,
                    question_count: existingQuiz.question_count ?? 0,
                    questions: Array.isArray(existingQuiz.content) ? existingQuiz.content : [],
                    created_at: new Date().toISOString(),
                });

                setStatus("success");
                setTimeout(() => { onClose(); router.push(`/dashboard/quiz/${existingQuiz.id}`); }, 1200);
                return;
            }

            // ── ADIM 5: Yeni quiz → PDF'yi Storage'a yükle ──────────────────
            setStatus("uploading");
            const fileName = `quiz-doc-${Date.now()}.pdf`;
            const filePath = `${user.id}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("documents")
                .upload(filePath, file, { upsert: false });

            if (uploadError) throw uploadError;

            // ── ADIM 6: Edge Function → AI ile quiz oluştur ──────────────────
            setStatus("analyzing");
            const { data, error: functionError } = await supabase.functions.invoke<GenerateQuizResponse>("generate-quiz", {
                body: { filePath }
            });

            if (functionError || !data) throw new Error(functionError?.message || t("gen_failed_error"));
            if (!data.questions || data.questions.length === 0) throw new Error(t("ai_gen_error"));

            // ── ADIM 7: DB'ye kaydet (quizService — tam mobil akış) ──────────
            setStatus("saving");
            const aiTitle = data.metadata?.title || data.title || file.name.replace(".pdf", "");
            const topicName = data.metadata?.topic || undefined;

            const quizId = await quizService.saveQuizToDatabase({
                title: aiTitle,
                fileHash: hash,
                questions: data.questions,
                topicName,
                userId: user.id,
            });

            if (!quizId) throw new Error(t("db_save_error"));

            if (isPremium) {
                setStatus("success");
                setTimeout(() => { onClose(); router.push(`/dashboard/quiz/${quizId}`); }, 1200);
            } else {
                setPendingQuizId(quizId);
                setStatus("showing_ad");
            }

        } catch (err: any) {
            console.error("[QuizUpload] Hata:", err);
            setError(err.message || ct("error"));
            setStatus("error");
        }
    };
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800">
                <div className="p-5 sm:p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t("upload_title")}</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">{t("upload_subtitle")}</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors active:scale-90">
                            <X className="text-slate-400" size={20} />
                        </button>
                    </div>

                    {status === "idle" || status === "error" ? (
                        <div className="space-y-5">
                            <div
                                onClick={() => fileRef.current?.click()}
                                className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all active:scale-[0.98] ${file ? 'border-indigo-500 bg-indigo-50/30 dark:bg-indigo-900/10' : 'border-slate-200 dark:border-slate-800 hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                            >
                                <input type="file" ref={fileRef} className="hidden" accept="application/pdf" onChange={handleFileChange} />
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${file ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                                    {file ? <FileText size={24} /> : <Upload size={24} />}
                                </div>
                                <span className="text-base font-bold text-slate-900 dark:text-white text-center line-clamp-1">
                                    {file ? file.name : t("select_pdf")}
                                </span>
                                <span className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 text-center">
                                    {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : t("drag_drop")}
                                </span>
                            </div>

                            {error && (
                                <div className="p-3 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/30 rounded-xl flex items-center gap-2.5 text-rose-600 dark:text-rose-400 animate-in slide-in-from-top-2">
                                    <AlertCircle size={16} className="shrink-0" />
                                    <p className="text-xs font-medium">{error}</p>
                                </div>
                            )}

                            <button
                                disabled={!file}
                                onClick={startGeneration}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white py-3.5 rounded-2xl font-bold text-base shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 active:scale-95 active:shadow-none"
                            >
                                <Loader2 className={`h-4 w-4 animate-spin ${status !== "idle" && status !== "error" ? 'block' : 'hidden'}`} />
                                {status === "idle" || status === "error" ? t("start_magic") : t("please_wait")}
                            </button>
                        </div>
                    ) : (
                        <div className="py-8 flex flex-col items-center text-center">
                            {status === "success" ? (
                                <div className="animate-in zoom-in duration-500">
                                    <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-4 mx-auto">
                                        <CheckCircle2 size={32} />
                                    </div>
                                    <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{t("success_ready")}</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{t("redirecting")}</p>
                                </div>
                            ) : (
                                <div className="w-full max-w-[320px] space-y-6">
                                    <div className="relative">
                                        <div className="w-24 h-24 border-4 border-indigo-100 dark:border-slate-800 rounded-full mx-auto flex items-center justify-center">
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-24 h-24 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                            </div>
                                            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-3xl animate-pulse">
                                                <FileText size={32} className="text-indigo-600" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                                                {status === "hashing" && t("status_hashing")}
                                                {status === "uploading" && t("status_uploading")}
                                                {status === "analyzing" && t("status_analyzing")}
                                                {status === "saving" && t("status_saving")}
                                            </h4>
                                            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-widest animate-pulse">
                                                {status === "analyzing" ? ct("loading") : t("pencereyi_kapatmayin")}
                                            </p>
                                        </div>
                                        
                                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden shadow-inner">
                                            <div className="h-full bg-indigo-600 transition-all duration-700 animate-pulse w-full"></div>
                                        </div>

                                        {status === "analyzing" && (
                                            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 animate-in fade-in slide-in-from-bottom-2 duration-700">
                                                <div className="flex items-center gap-2 text-indigo-600 mb-1">
                                                    <Sparkles size={14} />
                                                    <span className="text-[10px] font-black uppercase tracking-tighter">AI TIP</span>
                                                </div>
                                                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 min-h-[40px] flex items-center justify-center">
                                                    {tips[currentTip]}
                                                </p>
                                            </div>
                                        )}
                                        
                                        <p className="text-[10px] text-slate-400 dark:text-slate-500 italic">
                                            {t("analyzing_long")}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <AdInterstitial
                isOpen={status === "showing_ad"}
                onClose={() => {
                    if (pendingQuizId) {
                        onClose();
                        router.push(`/dashboard/quiz/${pendingQuizId}`);
                    }
                }}
                onProceed={() => {
                    if (pendingQuizId) {
                        onClose();
                        router.push(`/dashboard/quiz/${pendingQuizId}`);
                    }
                }}
                adSlot="8347209148" /* Placeholder slot - replace with real one if needed */
            />
        </div>
    );
}
