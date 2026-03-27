"use client";

import React, { useState, useEffect } from "react";
import { Download } from "lucide-react";
import { cn } from "@/utils/cn";
import { createClient } from "@/utils/supabase/client";
import { useLocale, useTranslations } from "next-intl";

interface PdfDownloadSectionProps {
    quizId: string;
    quizTitle?: string;
    isPremiumContext?: boolean;
    initialQuizData?: any;
    className?: string;
    variant?: "card" | "icon";
    onStateChange?: (state: "idle" | "generating") => void;
}

export default function PdfDownloadSection({
    quizId,
    quizTitle,
    isPremiumContext,
    initialQuizData,
    className,
    variant = "card",
    onStateChange
}: PdfDownloadSectionProps) {
    const t = useTranslations("QuizActions");
    const tCommon = useTranslations("Common");
    
    const [isPremium, setIsPremium] = useState<boolean>(!!isPremiumContext);
    const [isLoadingPremium, setIsLoadingPremium] = useState<boolean>(isPremiumContext === undefined);
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
                console.error("Failed to check premium status", err);
            } finally {
                setIsLoadingPremium(false);
            }
        };

        fetchPremiumStatus();
    }, [isPremiumContext, supabase.auth]);

    useEffect(() => {
        const state = isGeneratingPdf ? "generating" : "idle";
        onStateChange?.(state);
    }, [isGeneratingPdf, onStateChange]);

    const handleDownloadPdf = async (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (isLoadingPremium || isGeneratingPdf) return;
        
        proceedWithDownload();
    };

    const proceedWithDownload = async () => {
        setIsGeneratingPdf(true);
        try {
            const { generateQuizPDF } = await import('@/utils/pdfGenerator');
            
            let quizData = initialQuizData;

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

    if (isLoadingPremium && variant === "card") {
        return <div className="animate-pulse h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl w-full" />;
    }

    if (variant === "icon") {
        return (
            <button
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className={cn(
                    "p-3 rounded-2xl transition-all relative group/pdf",
                    isGeneratingPdf 
                        ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed" 
                        : "bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 active:scale-90 shadow-sm hover:shadow-md"
                )}
                title={t("download_title")}
            >
                {isGeneratingPdf ? (
                    <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                    <Download size={18} className="group-hover/pdf:scale-110 transition-transform" />
                )}
            </button>
        );
    }

    return (
        <div className={cn("w-full", className)}>
            <button
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className={cn(
                    "w-full bg-white dark:bg-slate-900/50 rounded-3xl p-6 border-2 transition-all group/card relative overflow-hidden text-left",
                    isPremium 
                        ? "border-amber-100 dark:border-amber-900/30 hover:border-amber-400 dark:hover:border-amber-600" 
                        : "border-indigo-100 dark:border-indigo-900/30 hover:border-indigo-400 dark:hover:border-indigo-600",
                    isGeneratingPdf && "opacity-80 cursor-not-allowed"
                )}
            >
                <div className="flex items-center gap-5">
                    <div className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover/card:scale-105 shadow-sm",
                        isPremium ? "bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400" : "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400"
                    )}>
                        {isGeneratingPdf ? (
                            <div className="w-6 h-6 border-3 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Download size={28} />
                        )}
                    </div>
                    
                    <div className="flex-1">
                        <h4 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg mb-0.5">
                            {t("download_title")}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                            {t("download_desc")}
                        </p>
                    </div>

                    <div className={cn(
                        "hidden sm:flex items-center gap-2 font-black text-xs uppercase tracking-widest px-5 py-2.5 rounded-xl transition-all",
                        isPremium 
                            ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20 group-hover/card:bg-amber-600" 
                            : "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 group-hover/card:bg-indigo-700"
                    )}>
                        {isGeneratingPdf ? tCommon("please_wait") : tCommon("download")}
                    </div>
                </div>
            </button>
        </div>
    );
}
