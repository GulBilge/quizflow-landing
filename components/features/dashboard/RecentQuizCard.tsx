"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, Calendar, Clock, Play, MoreVertical, Pencil, Trash2, FolderInput, Trophy, CheckCircle2, XCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { useTranslations } from "next-intl";
import { cn } from "@/utils/cn";

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
    const quiz = item.quizzes;
    const lastAttempt = item.lastAttempt;
    const displayTitle = item.user_quiz_name || quiz?.title || "Adsız Sınav";

    const tPerformance = useTranslations("Performance");

    return (
        <div
            onClick={onPress}
            className={cn(
                "group relative bg-white dark:bg-slate-800 rounded-3xl border transition-all duration-300 overflow-hidden cursor-pointer",
                isSelected
                    ? "border-indigo-500 ring-2 ring-indigo-500/10 shadow-xl"
                    : "border-slate-100 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-800 hover:shadow-lg"
            )}
        >
            {/* Left Border (Mobile Style) */}
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-600 rounded-l-full" />

            <div className="p-4 md:p-5">
                <div className="flex items-start md:items-center justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                        {isFirst && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">
                                Son Çalışılan
                            </span>
                        )}
                        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-lg md:text-xl truncate leading-tight">
                            {displayTitle}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 text-slate-500 dark:text-slate-400 text-xs font-medium">
                            <span className="flex items-center gap-1">
                                <FolderInput size={12} className="text-slate-400" />
                                {item.user_folder_name || "Genel"}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                                <Clock size={12} />
                                {item.last_accessed_at ? formatDistanceToNow(new Date(item.last_accessed_at), { addSuffix: true, locale: tr }) : "Yeni"}
                            </span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <button
                            onClick={onEditTitle}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl text-slate-400 hover:text-indigo-600 transition-all"
                            title="Düzenle"
                        >
                            <Pencil size={16} />
                        </button>
                        <button
                            onClick={onMoveToFolder}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl text-slate-400 hover:text-indigo-600 transition-all"
                            title="Klasöre Taşı"
                        >
                            <FolderInput size={16} />
                        </button>
                        <button
                            onClick={onDelete}
                            className="p-2 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl text-slate-400 hover:text-rose-600 transition-all"
                            title="Sil"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>

                {/* Attempt Stats (if available) */}
                {lastAttempt && (
                    <div className="flex flex-wrap items-center justify-between gap-3 py-3 border-t border-slate-50 dark:border-slate-700/50 mt-2 mb-4">
                        <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold ring-1 ring-emerald-500/10">
                                <CheckCircle2 size={12} strokeWidth={3} />
                                {lastAttempt.correct_count} Doğru
                            </div>
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 text-xs font-bold ring-1 ring-rose-500/10">
                                <XCircle size={12} strokeWidth={3} />
                                {lastAttempt.wrong_count} Yanlış
                            </div>
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-xs font-black ring-1 ring-indigo-500/10">
                                <Trophy size={12} strokeWidth={3} />
                                %{Math.round(lastAttempt.score || 0)}
                            </div>
                        </div>

                        <Link
                            href={`/dashboard/performance?quizId=${item.quiz_id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/10 hover:bg-indigo-600 text-indigo-600 hover:text-white text-[10px] font-bold uppercase tracking-wider transition-all"
                        >
                            {tPerformance("go_to_analysis")}
                        </Link>
                    </div>
                )}


                <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                        <BookOpen size={14} />
                        {quiz?.question_count || 0} Soru
                    </div>

                    <Link href={`/dashboard/quiz/${quiz?.id}`} onClick={(e) => e.stopPropagation()}>
                        <button className="flex items-center gap-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-5 py-2 rounded-2xl font-bold text-sm tracking-tight hover:scale-105 active:scale-95 transition-all shadow-md active:shadow-none">
                            <span>Sınavı Çöz</span>
                            <Play size={12} fill="currentColor" />
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
