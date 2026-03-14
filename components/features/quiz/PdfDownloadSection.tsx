"use client";

import React, { useState, useEffect } from "react";
import { Download, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { createClient } from "@/utils/supabase/client";
import { useLocale } from "next-intl";

interface PdfDownloadSectionProps {
    quizId: string;
    quizTitle?: string;
    isPremiumContext?: boolean; // if we already know they are premium
    initialQuizData?: any; // If we already have the questions (like in QuizPlayer)
    className?: string; // Additional classes for styling integration
}

export default function PdfDownloadSection({
    quizId,
    quizTitle,
    isPremiumContext,
    initialQuizData,
    className
}: PdfDownloadSectionProps) {
    const [isPremium, setIsPremium] = useState<boolean>(!!isPremiumContext);
    const [isLoadingPremium, setIsLoadingPremium] = useState<boolean>(isPremiumContext === undefined);
    
    const [isPdfShuffleRequested, setIsPdfShuffleRequested] = useState(false);
    const [isAnswerKeyRequested, setIsAnswerKeyRequested] = useState(false);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
    const supabase = createClient();
    const locale = useLocale();

    useEffect(() => {
        if (isPremiumContext !== undefined) {
            setIsPremium(isPremiumContext);
            setIsLoadingPremium(false);
            return;
        }

        const fetchPremiumStatus = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    setIsLoadingPremium(false);
                    return;
                }
                const { data: profile } = await supabase
                    .from("profiles" as any)
                    .select("is_pro")
                    .eq("id", user.id)
                    .single();
                
                setIsPremium(!!(profile as any)?.is_pro);
            } catch (err) {
                console.error("Failed to check premium status inside PdfDownloadSection", err);
            } finally {
                setIsLoadingPremium(false);
            }
        };

        fetchPremiumStatus();
    }, [isPremiumContext, supabase.auth]);

    const handleDownloadPdf = async (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card clicks
        if (isLoadingPremium) return;
        if (!isPremium) {
            window.location.href = '/checkout';
            return;
        }
        
        setIsGeneratingPdf(true);
        try {
            const { generateQuizPDF } = await import('@/utils/pdfGenerator');
            
            let quizData = initialQuizData;

            // Fetch missing data if needed (e.g from dashboard cards)
            if (!quizData || !quizData.content) {
                const { data, error } = await supabase
                    .from("quizzes")
                    .select("title, content")
                    .eq("id", quizId)
                    .single();

                if (error || !data) throw new Error("Could not fetch quiz content for PDF");
                quizData = {
                    title: quizTitle || (data as any).title,
                    content: (data as any).content
                };
            }

            await generateQuizPDF(quizData, isPdfShuffleRequested, isAnswerKeyRequested, false, quizId, locale);
        } catch (error) {
            console.error("PDF generation failed:", error);
            const { toast } = await import("sonner");
            toast.error("Bir hata oluştu, lütfen tekrar deneyin.");
        } finally {
            setIsGeneratingPdf(false);
        }
    };

    if (isLoadingPremium) {
        return <div className="animate-pulse h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl w-full" />;
    }

    return (
        <div className={cn("bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 sm:p-5 border border-slate-100 dark:border-slate-700/50 flex flex-col sm:flex-row items-center justify-between gap-4 w-full", className)}>
            <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                    isPremium ? "bg-amber-100 dark:bg-amber-900/40" : "bg-slate-200 dark:bg-slate-700"
                )}>
                    {isPremium ? (
                        <Download size={20} className="text-amber-600 dark:text-amber-400" />
                    ) : (
                        <Lock size={20} className="text-slate-400 dark:text-slate-500" />
                    )}
                </div>
                <div className="text-left">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                        Testi PDF Olarak İndir
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                        {isPremium ? 'Sınavı cihazınıza indirin.' : 'Bu özellik sadece Premium üyeler içindir.'}
                    </p>
                </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                {isPremium && (
                    <div className="flex gap-3 w-full sm:w-auto shrink-0 justify-center">
                        <div onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors bg-white dark:bg-slate-900 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 flex-1 sm:flex-none justify-center">
                            <input
                                type="checkbox"
                                id={`shuffle-${quizId}`}
                                checked={isPdfShuffleRequested}
                                onChange={(e) => setIsPdfShuffleRequested(e.target.checked)}
                                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                            />
                            <label htmlFor={`shuffle-${quizId}`} className="select-none font-medium text-xs sm:text-sm whitespace-nowrap cursor-pointer">
                                Soruları Karıştır
                            </label>
                        </div>
                        <div onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors bg-white dark:bg-slate-900 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 flex-1 sm:flex-none justify-center">
                            <input
                                type="checkbox"
                                id={`answers-${quizId}`}
                                checked={isAnswerKeyRequested}
                                onChange={(e) => setIsAnswerKeyRequested(e.target.checked)}
                                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                            />
                            <label htmlFor={`answers-${quizId}`} className="select-none font-medium text-xs sm:text-sm whitespace-nowrap cursor-pointer">
                                Cevap Anahtarı
                            </label>
                        </div>
                    </div>
                )}
                
                <Button
                    onClick={handleDownloadPdf}
                    disabled={isGeneratingPdf}
                    className={cn(
                        "h-10 sm:h-12 px-6 rounded-xl font-bold transition-all w-full sm:w-auto shrink-0 gap-2",
                        isPremium 
                            ? "bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20" 
                            : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20"
                    )}
                >
                    {isGeneratingPdf ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : isPremium ? (
                        <>İndir <Download size={16} /></>
                    ) : (
                        <>Premium'a Geç</>
                    )}
                </Button>
            </div>
        </div>
    );
}
