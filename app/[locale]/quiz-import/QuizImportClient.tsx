"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { Loader2, ScanLine, BookOpen } from "lucide-react";

interface QuizImportClientProps {
    quizId: string;
    quizTitle: string;
    locale: string;
}

export default function QuizImportClient({ quizId, quizTitle, locale }: QuizImportClientProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isTr = locale === "tr";

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError(null);
        const supabase = createClient();
        const nextPath = `/dashboard/quiz/${quizId}`;
        
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}&locale=${locale}`,
                queryParams: { prompt: "select_account" },
            },
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-md"
            >
                <div className="bg-white rounded-[2rem] shadow-2xl shadow-indigo-100 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-10 text-center relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10"
                            style={{
                                backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)',
                                backgroundSize: '40px 40px'
                            }}
                        />
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4"
                        >
                            <ScanLine size={32} className="text-white" />
                        </motion.div>
                        <h1 className="text-2xl font-extrabold text-white mb-1">
                            {isTr ? "QR Kodu Taradınız!" : "You Scanned a QR Code!"}
                        </h1>
                        <p className="text-indigo-200 text-sm font-medium">
                            {isTr ? "Quizyen'e Hoş Geldiniz" : "Welcome to Quizyen"}
                        </p>
                    </div>

                    {/* Body */}
                    <div className="px-8 py-8">
                        {/* Quiz card */}
                        <div className="flex items-start gap-3 bg-indigo-50 rounded-2xl p-4 mb-6">
                            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                                <BookOpen size={20} className="text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-0.5">
                                    {isTr ? "Paylaşılan Quiz" : "Shared Quiz"}
                                </p>
                                <p className="text-base font-bold text-slate-900 leading-snug">{quizTitle}</p>
                            </div>
                        </div>

                        <p className="text-slate-500 text-sm text-center mb-6 leading-relaxed">
                            {isTr
                                ? "Bu quiz kütüphanenize otomatik olarak eklenecek ve hemen açılacak. Devam etmek için giriş yapın."
                                : "This quiz will be added to your library automatically and opened right away. Sign in to continue."}
                        </p>

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs rounded-xl">
                                ⚠️ {error}
                            </div>
                        )}

                        <button
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            className="w-full bg-white border-2 border-slate-100 hover:border-indigo-200 text-slate-700 font-semibold py-3.5 rounded-2xl transition-all hover:bg-indigo-50 active:scale-[0.98] flex items-center justify-center gap-3 shadow-sm"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin text-slate-400" size={20} />
                            ) : (
                                <>
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    <span>{isTr ? "Google ile Giriş Yap" : "Sign in with Google"}</span>
                                </>
                            )}
                        </button>

                        <p className="text-center text-[10px] text-slate-400 mt-4 leading-tight px-4">
                            {isTr
                                ? "Giriş yaparak Quizyen Kullanım Koşulları'nı ve Gizlilik Politikası'nı kabul etmiş olursunuz."
                                : "By signing in, you agree to Quizyen's Terms of Service and Privacy Policy."}
                        </p>
                    </div>
                </div>

                <p className="text-center text-xs text-slate-400 mt-4">
                    {isTr ? "Quizyen · AI Destekli Quiz Platformu" : "Quizyen · AI-Powered Quiz Platform"}
                </p>
            </motion.div>
        </div>
    );
}
