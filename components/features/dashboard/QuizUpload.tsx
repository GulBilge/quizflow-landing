"use client";

import React, { useState, useRef } from "react";
import { Upload, FileText, X, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { generateFileHash } from "@/utils/quiz";
import { useRouter } from "next/navigation";

interface QuizUploadProps {
    onClose: () => void;
}

type Status = "idle" | "hashing" | "uploading" | "analyzing" | "saving" | "error" | "success";

export default function QuizUpload({ onClose }: QuizUploadProps) {
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<Status>("idle");
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const supabase = createClient();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.type !== "application/pdf") {
                setError("Lütfen sadece PDF dosyası yükleyin.");
                return;
            }
            if (selectedFile.size > 10 * 1024 * 1024) {
                setError("Dosya boyutu 10MB'dan küçük olmalıdır.");
                return;
            }
            setFile(selectedFile);
            setError(null);
        }
    };

    const startGeneration = async () => {
        if (!file) return;

        try {
            setStatus("hashing");
            const arrayBuffer = await file.arrayBuffer();
            const hash = await generateFileHash(arrayBuffer);

            // Check if quiz already exists
            const { data: existingQuiz } = await supabase
                .from("quizzes")
                .select("id")
                .eq("file_hash", hash)
                .single();

            if (existingQuiz) {
                // Link already existing quiz to user library
                await addToLibrary((existingQuiz as any).id);
                return;
            }

            setStatus("uploading");
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Oturum bulunamadı.");

            const fileName = `quiz-doc-${Date.now()}.pdf`;
            const filePath = `${user.id}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("documents")
                .upload(filePath, file, { upsert: false });

            if (uploadError) throw uploadError;

            setStatus("analyzing");
            const { data, error: functionError } = await supabase.functions.invoke("generate-quiz", {
                body: { filePath }
            });

            if (functionError || !data) throw new Error(functionError?.message || "Sınav oluşturulamadı.");

            setStatus("saving");
            const aiTitle = (data as any).metadata?.title || (data as any).title || file.name.replace(".pdf", "");
            const topic = (data as any).metadata?.topic || "Genel";

            // 1. Get or Create Folder
            let folderId: string;
            const { data: existingFolder } = await supabase
                .from("folders" as any)
                .select("id")
                .eq("name", topic)
                .eq("created_by", user.id)
                .single();

            if (existingFolder) {
                folderId = (existingFolder as any).id;
            } else {
                const { data: newFolder, error: folderError } = await supabase
                    .from("folders" as any)
                    .insert({ name: topic, created_by: user.id } as any)
                    .select("id")
                    .single();
                if (folderError) throw folderError;
                folderId = (newFolder as any).id;

                // Link folder to user_folders
                await supabase.from("user_folders" as any).insert({ user_id: user.id, folder_id: folderId } as any);
            }

            // 2. Save Quiz
            const { data: newQuiz, error: insertError } = await supabase
                .from("quizzes")
                .insert({
                    title: aiTitle,
                    file_hash: hash,
                    content: (data as any).questions,
                    question_count: (data as any).questions.length,
                    description: topic,
                    created_by: user.id
                } as any)
                .select("id")
                .single();

            if (insertError) throw insertError;
            const quizId = (newQuiz as any).id;

            // 3. Link Quiz to Folder
            await supabase.from("quiz_folders" as any).insert({
                quiz_id: quizId,
                folder_id: folderId,
                created_by: user.id
            } as any);

            // 4. Add to User Quizzes
            await addToLibrary(quizId);

        } catch (err: any) {
            console.error("Sınav oluşturma hatası:", err);
            setError(err.message || "Bir hata oluştu.");
            setStatus("error");
        }
    };

    const addToLibrary = async (quizId: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Using user_quizzes instead of user_library
        const { error: libError } = await supabase
            .from("user_quizzes" as any)
            .upsert({
                user_id: user.id,
                quiz_id: quizId,
                last_accessed_at: new Date().toISOString()
            } as any, { onConflict: 'user_id,quiz_id' });

        if (libError) throw libError;

        setStatus("success");
        setTimeout(() => {
            onClose();
            router.push(`/dashboard/quiz/${quizId}`);
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6 sm:p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Yeni Sınav Oluştur</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Yapay zeka notlarını analiz edip sorular hazırlasın.</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                            <X className="text-slate-400" />
                        </button>
                    </div>

                    {status === "idle" || status === "error" ? (
                        <div className="space-y-6">
                            <div
                                onClick={() => fileRef.current?.click()}
                                className={`border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all ${file ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/10' : 'border-slate-200 dark:border-slate-700 hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                            >
                                <input type="file" ref={fileRef} className="hidden" accept="application/pdf" onChange={handleFileChange} />
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${file ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                                    {file ? <FileText size={32} /> : <Upload size={32} />}
                                </div>
                                <span className="text-lg font-bold text-slate-900 dark:text-white">
                                    {file ? file.name : "PDF Dosyası Seç"}
                                </span>
                                <span className="text-sm text-slate-500 dark:text-slate-400 mt-2 text-center">
                                    {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "veya sürükle bırak (Max 10MB)"}
                                </span>
                            </div>

                            {error && (
                                <div className="p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/30 rounded-2xl flex items-center gap-3 text-rose-600 dark:text-rose-400 animate-in slide-in-from-top-2">
                                    <AlertCircle size={20} />
                                    <p className="text-sm font-medium">{error}</p>
                                </div>
                            )}

                            <button
                                disabled={!file}
                                onClick={startGeneration}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
                            >
                                <Loader2 className={`mr-2 h-5 w-5 animate-spin ${status !== "idle" && status !== "error" ? 'block' : 'hidden'}`} />
                                {status === "idle" || status === "error" ? "Sihri Başlat ✨" : "Lütfen Bekleyin..."}
                            </button>
                        </div>
                    ) : (
                        <div className="py-12 flex flex-col items-center text-center">
                            {status === "success" ? (
                                <div className="animate-in zoom-in duration-500">
                                    <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-6 mx-auto">
                                        <CheckCircle2 size={48} />
                                    </div>
                                    <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Başarıyla Hazırlandı!</h4>
                                    <p className="text-slate-500 dark:text-slate-400">Sınava yönlendiriliyorsunuz...</p>
                                </div>
                            ) : (
                                <div className="w-full max-w-xs space-y-8">
                                    <div className="relative">
                                        <div className="w-32 h-32 border-4 border-indigo-100 dark:border-slate-800 rounded-full mx-auto flex items-center justify-center">
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-32 h-32 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                            </div>
                                            <FileText size={40} className="text-indigo-600" />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                                            {status === "hashing" && "Dosya İnceleniyor..."}
                                            {status === "uploading" && "Buluta Aktarılıyor..."}
                                            {status === "analyzing" && "Yapay Zeka Tarafından Okunuyor..."}
                                            {status === "saving" && "Sınav Hazırlanıyor..."}
                                        </h4>
                                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                            <div className="h-full bg-indigo-600 transition-all duration-500 animate-pulse w-full"></div>
                                        </div>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 italic">
                                            {status === "analyzing" ? "Bu işlem PDF içeriğine göre 30 saniye sürebilir." : "Lütfen pencereyi kapatmayın."}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
