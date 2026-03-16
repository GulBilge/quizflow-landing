"use client";

import React, { useState, useEffect } from "react";
import { Download, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { createClient } from "@/utils/supabase/client";
import { useLocale, useTranslations } from "next-intl";

import { useRouter } from "@/i18n/routing";

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
    const t = useTranslations("QuizActions");
    const tCommon = useTranslations("Common");
    const tAds = useTranslations("Ads");
    
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

    const router = useRouter();

    const handleDownloadPdf = async (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card clicks
        if (isLoadingPremium) return;
        if (!isPremium) {
            router.push('/checkout');
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

            await generateQuizPDF(quizData, quizId, locale);
        } catch (error) {
            console.error("PDF generation failed:", error);
            const { toast } = await import("sonner");
            toast.error(tCommon("error"));
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
                        {t("download_title")}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                        {isPremium ? t("download_desc") : t("premium_only")}
                    </p>
                </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                
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
                        <>{tCommon("download")} <Download size={16} /></>
                    ) : (
                        <>{tAds("upgrade_btn")}</>
                    )}
                </Button>
            </div>
        </div>
    );
}
