"use client";

import React, { useState } from "react";
import { Share2, Copy, Check, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { useLocale } from "next-intl";

interface QuizShareSectionProps {
    quizId: string;
    quizTitle?: string;
    className?: string;
}

export default function QuizShareSection({
    quizId,
    quizTitle,
    className,
}: QuizShareSectionProps) {
    const [copied, setCopied] = useState(false);
    const locale = useLocale();

    const shareUrl = `https://quizyen.com/${locale}/quiz-import?id=${quizId}`;

    const handleCopy = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch {
            // Fallback for older browsers
            const textArea = document.createElement("textarea");
            textArea.value = shareUrl;
            textArea.style.position = "fixed";
            textArea.style.opacity = "0";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        }
    };

    const handleWhatsApp = (e: React.MouseEvent) => {
        e.stopPropagation();
        const text = quizTitle
            ? `"${quizTitle}" sınavını çözmek ister misin? 🎯\n${shareUrl}`
            : `Bu sınavı çözmek ister misin? 🎯\n${shareUrl}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    };

    return (
        <div
            className={cn(
                "bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 sm:p-5 border border-slate-100 dark:border-slate-700/50 flex flex-col sm:flex-row items-center justify-between gap-4 w-full",
                className
            )}
        >
            {/* Left: icon + text */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center shrink-0">
                    <Share2 size={20} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="text-left">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                        Sınavı Paylaş
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                        Linki kopyala ve arkadaşlarınla paylaş.
                    </p>
                </div>
            </div>

            {/* Right: action buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-center sm:justify-end">
                {/* WhatsApp */}
                <button
                    onClick={handleWhatsApp}
                    className="h-10 sm:h-12 px-4 rounded-xl font-bold transition-all flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 text-sm active:scale-95"
                    title="WhatsApp'ta Paylaş"
                >
                    <MessageCircle size={16} />
                    <span className="hidden sm:inline">WhatsApp</span>
                </button>

                {/* Copy link */}
                <Button
                    onClick={handleCopy}
                    className={cn(
                        "h-10 sm:h-12 px-5 rounded-xl font-bold transition-all gap-2 text-sm",
                        copied
                            ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                            : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20"
                    )}
                >
                    {copied ? (
                        <>
                            <Check size={16} />
                            Kopyalandı!
                        </>
                    ) : (
                        <>
                            <Copy size={16} />
                            Linki Kopyala
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
