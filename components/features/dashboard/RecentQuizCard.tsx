"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, Calendar, Clock, Play, MoreVertical, Pencil, Trash2, FolderInput, Trophy, CheckCircle2, XCircle, Sparkles, Share2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useTranslations, useLocale as useNextLocale } from "next-intl";
import { cn } from "@/utils/cn";
import * as locales from "date-fns/locale";
import PdfDownloadSection from "@/components/features/quiz/PdfDownloadSection";
import QuizShareSection from "@/components/features/quiz/QuizShareSection";

interface RecentQuizCardProps {
    item: any; // Using any for now to match the combined data from page.tsx
    onPress?: () => void;
    onDelete?: (e: React.MouseEvent) => void;
    onEditTitle?: (e: React.MouseEvent) => void;
    onMoveToFolder?: (e: React.MouseEvent) => void;
    isFirst?: boolean;
    isSelected?: boolean;
}

export default function RecentQuizCard({
    item,
    onPress,
    onDelete,
    onEditTitle,
    onMoveToFolder,
    isFirst,
    isSelected
}: RecentQuizCardProps) {
    const tLibrary = useTranslations("Library");
    const tDashboard = useTranslations("Dashboard");
    const tPerformance = useTranslations("Performance");
    const locale = useNextLocale();
    const dateLocale = (locales as any)[locale] || locales.enUS;
    
    // Toggle for PDF download section
    const [showPdfOptions, setShowPdfOptions] = React.useState(false);
    // Toggle for Share section
    const [showShareOptions, setShowShareOptions] = React.useState(false);

    const quiz = item.quizzes;
    const lastAttempt = item.lastAttempt;
    const displayTitle = item.user_quiz_name || quiz?.title || tLibrary("adsiz_sinav");

    return (
        <div
            onClick={onPress}
            className={cn(
                "group relative bg-white dark:bg-slate-800/80 rounded-3xl border transition-all duration-500 overflow-hidden cursor-pointer",
                isSelected
                    ? "border-indigo-500 ring-[3px] ring-indigo-500/10 shadow-2xl shadow-indigo-600/5 translate-y-[-2px]"
                    : "border-slate-100 dark:border-slate-700/50 hover:border-indigo-300 dark:hover:border-indigo-800/50 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none hover:translate-y-[-2px] active:scale-[0.99] active:translate-y-0"
            )}
        >
            {/* Left Border Accent (Mobile Style - Gradient for Premium look) */}
            <div className={cn(
                "absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-500",
                isSelected 
                    ? "bg-gradient-to-b from-indigo-500 to-indigo-700" 
                    : "bg-indigo-600/40 group-hover:bg-indigo-600"
            )} />

            <div className="p-4 md:p-6">
                <div className="flex items-start md:items-center justify-between gap-4 mb-4">
                    <div className="flex-1 min-w-0">
                        {isFirst && (
                            <div className="flex items-center gap-2 mb-2">
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/40 text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.1em] ring-1 ring-indigo-100 dark:ring-indigo-800/50 shadow-sm">
                                    <Sparkles size={10} className="mr-1 animate-pulse" />
                                    {tDashboard("last_studied")}
                                </span>
                            </div>
                        )}
                        <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-lg md:text-2xl line-clamp-2 break-words leading-[1.15] tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {displayTitle}
                        </h4>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-slate-500 dark:text-slate-400 text-xs font-semibold">
                            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700/50">
                                <FolderInput size={12} className="text-indigo-500" />
                                {item.user_folder_name || tLibrary("genel")}
                            </span>
                            <span className="text-slate-300 dark:text-slate-700">•</span>
                            <span className="flex items-center gap-1.5">
                                <Clock size={12} className="text-slate-400" />
                                {item.last_accessed_at ? formatDistanceToNow(new Date(item.last_accessed_at), { addSuffix: true, locale: dateLocale }) : tLibrary("yeni")}
                            </span>
                        </div>
                    </div>

                    {/* Action Buttons - Tactile & Premium */}
                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 shrink-0">
                        <button
                            onClick={onEditTitle}
                            className="p-2.5 bg-slate-50 dark:bg-slate-700/30 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-2xl text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all active:scale-90"
                            title={tLibrary("edit_title")}
                        >
                            <Pencil size={18} />
                        </button>
                        <button
                            onClick={onMoveToFolder}
                            className="p-2.5 bg-slate-50 dark:bg-slate-700/30 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-2xl text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all active:scale-90"
                            title={tLibrary("move_to_folder")}
                        >
                            <FolderInput size={18} />
                        </button>
                        <button
                            onClick={onDelete}
                            className="p-2.5 bg-slate-50 dark:bg-slate-700/30 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-2xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-all active:scale-90"
                            title={tDashboard("delete") || "Delete"} 
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>

                {/* Attempt Stats - Clean & Modern */}
                {lastAttempt && (
                    <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-t border-slate-50 dark:border-slate-700/50 mt-2 mb-5">
                        <div className="flex flex-wrap items-center gap-2 min-w-0">
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-black ring-1 ring-emerald-500/20 shadow-sm">
                                <CheckCircle2 size={14} strokeWidth={3} />
                                {lastAttempt.correct_count} {tPerformance("correct")}
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 text-[11px] font-black ring-1 ring-rose-500/20 shadow-sm">
                                <XCircle size={14} strokeWidth={3} />
                                {lastAttempt.wrong_count} {tPerformance("wrong")}
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-indigo-500 text-white dark:bg-indigo-600 text-[11px] font-black shadow-lg shadow-indigo-600/20">
                                <Trophy size={14} strokeWidth={3} />
                                %{Math.round(lastAttempt.score || 0)}
                            </div>
                        </div>

                        <Link
                            href={`/dashboard/performance?quizId=${item.quiz_id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-[10px] font-black uppercase tracking-widest transition-all hover:bg-indigo-600 dark:hover:bg-indigo-400 dark:hover:text-white active:scale-95 shadow-lg shadow-black/5"
                        >
                            {tPerformance("go_to_analysis")}
                        </Link>
                    </div>
                )}
                
                {/* Share Expandable Area */}
                {showShareOptions && quiz?.id && (
                    <div className="mb-3 animate-in slide-in-from-top-2 duration-300">
                        <QuizShareSection
                            quizId={quiz.id}
                            quizTitle={displayTitle}
                            className="bg-slate-50/50 dark:bg-slate-900/30 shadow-none border-dashed"
                        />
                    </div>
                )}

                {/* PDF Download Expandable Area */}
                {showPdfOptions && quiz?.id && (
                    <div className="mb-3 animate-in slide-in-from-top-2 duration-300">
                        <PdfDownloadSection 
                            quizId={quiz.id}
                            quizTitle={displayTitle}
                            className="bg-slate-50/50 dark:bg-slate-900/30 shadow-none border-dashed"
                        />
                    </div>
                )}

                <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2.5 text-xs font-extrabold text-slate-400 dark:text-slate-500">
                        <div className="p-1.5 bg-slate-100 dark:bg-slate-900/50 rounded-lg">
                            <BookOpen size={16} className="text-indigo-500" />
                        </div>
                        {tLibrary("soru_sayisi", { count: quiz?.question_count || 0 })}
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Share button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowShareOptions(!showShareOptions);
                                if (showPdfOptions) setShowPdfOptions(false);
                            }}
                            className={cn(
                                "p-3 rounded-2xl transition-colors",
                                showShareOptions
                                    ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400"
                                    : "bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                            )}
                            title="Sınavı Paylaş"
                        >
                            <Share2 size={18} />
                        </button>
                        {/* PDF download button */}
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowPdfOptions(!showPdfOptions);
                                if (showShareOptions) setShowShareOptions(false);
                            }}
                            className={cn(
                                "p-3 rounded-2xl transition-colors",
                                showPdfOptions
                                    ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400"
                                    : "bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                            )}
                            title="PDF Seçenekleri"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                        </button>
                        <Link href={`/dashboard/quiz/${quiz?.id}`} onClick={(e) => e.stopPropagation()}>
                            <button className="group/btn relative flex items-center gap-3 bg-indigo-600 text-white px-7 py-3 rounded-2xl font-black text-sm tracking-tight overflow-hidden transition-all hover:pr-9 active:scale-95 shadow-xl shadow-indigo-600/20">
                                <span className="relative z-10">{tLibrary("sinavi_coz")}</span>
                                <Play size={14} fill="currentColor" className="relative z-10" />
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-indigo-500 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

