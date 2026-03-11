"use client";

import React, { useState } from "react";
import { Folder, ChevronDown, ChevronUp, MoreVertical, Edit3, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/utils/cn";

interface LibraryFolderSectionProps {
    folderName: string;
    folderId: string | null;
    quizCount: number;
    isExpanded: boolean;
    onToggle: () => void;
    children: React.ReactNode;
    onEdit?: () => void;
    onDelete?: () => void;
}

export default function LibraryFolderSection({
    folderName,
    folderId,
    quizCount,
    isExpanded,
    onToggle,
    children,
    onEdit,
    onDelete
}: LibraryFolderSectionProps) {
    const t = useTranslations('Library');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="space-y-3">
            {/* Folder Header */}
            <div
                onClick={onToggle}
                className={cn(
                    "group flex items-center justify-between p-4 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-indigo-500/50 hover:shadow-lg transition-all cursor-pointer backdrop-blur-xl",
                    isExpanded && "border-indigo-500/30 shadow-md"
                )}
            >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-105",
                        folderId
                            ? "bg-gradient-to-br from-indigo-500 to-violet-600 shadow-indigo-500/10"
                            : "bg-slate-400 dark:bg-slate-600 shadow-slate-500/10"
                    )}>
                        <Folder size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors text-base line-clamp-1 break-words">
                            {folderName}
                        </h3>
                        <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
                            {t('quiz_count_label', { count: quizCount })}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {folderId && (
                        <div className="relative">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsMenuOpen(!isMenuOpen);
                                }}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
                            >
                                <MoreVertical size={18} />
                            </button>

                            {isMenuOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsMenuOpen(false);
                                        }}
                                    />
                                    <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-700 py-1.5 z-20 animate-in slide-in-from-top-1">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setIsMenuOpen(false);
                                                onEdit?.();
                                            }}
                                            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                                        >
                                            <Edit3 size={14} /> {t('edit_title')}
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setIsMenuOpen(false);
                                                onDelete?.();
                                            }}
                                            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors font-medium"
                                        >
                                            <Trash2 size={14} /> Sil
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                    <div className="text-slate-400 group-hover:text-indigo-500 transition-colors p-1">
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                </div>
            </div>

            {/* Folder Content */}
            {isExpanded && (
                <div className="grid gap-3 animate-in fade-in slide-in-from-top-2 duration-300 pl-2 border-l-2 border-slate-100 dark:border-slate-800/50 ml-5 py-1">
                    {children}
                </div>
            )}
        </div>
    );
}
