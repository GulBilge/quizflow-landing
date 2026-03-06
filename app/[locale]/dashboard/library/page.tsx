"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Folder, Search, Filter, Plus, MoreVertical, FileText, Loader2, Trash2, Edit3, FolderInput, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { tr as dateFnsTr } from "date-fns/locale";
import { createClient } from "@/utils/supabase/client";
import FolderModal from "@/components/features/dashboard/FolderModal";
import MoveToFolderModal from "@/components/features/dashboard/MoveToFolderModal";
import QuizUpload from "@/components/features/dashboard/QuizUpload";
import { useTranslations } from "next-intl";

type LibraryItem = {
    id: string;
    folder_id: string | null;
    last_accessed_at: string | null;
    quizzes: {
        id: string;
        title: string;
        question_count: number | null;
        created_at: string;
    } | null;
}

type LibraryData = {
    id: string;
    user_id: string;
    quiz_id: string | null;
    quiz_added_at: string | null;
    last_accessed_at: string | null;
    folder_id: string | null;
    global_folder_id: string | null;
    user_quiz_name: string | null;
    user_folder_name: string | null;
    created_at: string | null;
    question_count: number | null;
};

type FolderType = {
    id: string;
    name: string;
    created_at: string | null;
};

export default function LibraryPage() {
    const t = useTranslations('Library');
    const [loading, setLoading] = useState(true);
    const [searchValue, setSearchValue] = useState("");
    const [libraryData, setLibraryData] = useState<LibraryData[]>([]);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    // Modal States
    const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
    const [editingFolder, setEditingFolder] = useState<FolderType | null>(null);
    const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
    const [movingQuiz, setMovingQuiz] = useState<{ id: string; title: string; currentFolderId: string | null } | null>(null);
    const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    const supabase = createClient();

    useEffect(() => {
        fetchLibrary();

        // Close menu on click outside
        const handleClickOutside = () => setActiveMenu(null);
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const fetchLibrary = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await (supabase as any)
                .from('v_user_library')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setLibraryData(data || []);
        } catch (err) {
            console.error(t('error_delete_quiz'), err);
        } finally {
            setLoading(false);
        }
    };

    // Derived Data
    const folders = useMemo(() => {
        const folderIds = new Set<string>();
        return libraryData
            .filter((item) => item.folder_id && !folderIds.has(item.folder_id) && folderIds.add(item.folder_id))
            .map((item) => ({
                id: item.folder_id!,
                name: item.user_folder_name || t('adsiz_klasor'),
                created_at: item.created_at
            }))
            .sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }, [libraryData, t]);

    const libraryItems: LibraryItem[] = useMemo(() => {
        return libraryData
            .filter((item) => item.quiz_id)
            .map((item) => ({
                id: item.id,
                folder_id: item.folder_id,
                last_accessed_at: item.last_accessed_at,
                quizzes: {
                    id: item.quiz_id!,
                    title: item.user_quiz_name || t('adsiz_sinav'),
                    question_count: item.question_count,
                    created_at: item.created_at || new Date().toISOString()
                }
            }));
    }, [libraryData, t]);

    const filteredItems = useMemo(() => {
        if (!searchValue) return libraryItems;
        const lowSearch = searchValue.toLowerCase();
        return libraryItems.filter(item =>
            item.quizzes?.title.toLowerCase().includes(lowSearch) ||
            folders.find(f => f.id === item.folder_id)?.name.toLowerCase().includes(lowSearch)
        );
    }, [libraryItems, searchValue, folders]);

    const uncategorizedQuizzes = useMemo(() => {
        if (selectedFolderId) {
            return filteredItems.filter((item) => item.folder_id === selectedFolderId);
        }
        return filteredItems.filter((item) => !item.folder_id);
    }, [filteredItems, selectedFolderId]);

    // Actions
    const handleDeleteFolder = async (id: string, name: string) => {
        if (!confirm(t('delete_folder_confirm', { name }))) return;

        try {
            const { error } = await supabase
                .from("user_folders" as any)
                .delete()
                .eq("id", id);

            if (error) throw error;
            fetchLibrary();
        } catch (err) {
            alert(t('error_delete_folder'));
        }
    };

    const handleDeleteQuiz = async (id: string) => {
        if (!confirm(t('delete_quiz_confirm'))) return;

        try {
            const { error } = await supabase
                .from("user_quizzes" as any)
                .delete()
                .eq("id", id);

            if (error) throw error;
            fetchLibrary();
        } catch (err) {
            alert(t('error_delete_quiz'));
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                <p className="mt-4 text-slate-500 font-medium">{t('loading')}</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-full overflow-x-hidden px-1">
            {/* Header & Search */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">{t('title')}</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-[10px] md:text-xs">{t('subtitle')}</p>
                    </div>

                    <button
                        onClick={() => {
                            setEditingFolder(null);
                            setIsFolderModalOpen(true);
                        }}
                        className="flex md:hidden items-center justify-center w-9 h-9 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-600/20 active:scale-90 transition-transform"
                    >
                        <Plus size={20} />
                    </button>
                </div>

                <div className="flex flex-col md:flex-row gap-2.5">
                    <div className="relative group flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
                        <input
                            type="text"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            placeholder={t('search_placeholder')}
                            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
                        />
                    </div>

                    <div className="flex gap-2">
                        {selectedFolderId && (
                            <button
                                onClick={() => setSelectedFolderId(null)}
                                className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
                            >
                                <Plus size={16} className="rotate-45" />
                                <span className="hidden sm:inline">{t('back_button')}</span>
                            </button>
                        )}
                        <button
                            onClick={() => {
                                setEditingFolder(null);
                                setIsFolderModalOpen(true);
                            }}
                            className="hidden md:flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-xl font-bold text-xs hover:bg-indigo-700 transition-all hover:shadow-lg hover:shadow-indigo-600/20 active:scale-95"
                        >
                            <Plus size={16} />
                            <span>{t('new_folder')}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Folders Section */}
            {!selectedFolderId && (folders.length > 0 || searchValue) && (
                <div className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                        <h2 className="text-base font-bold text-slate-800 dark:text-slate-200">{t('folders_title')}</h2>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {t('folders_count', { count: folders.length })}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {folders.map((folder) => {
                            const count = filteredItems.filter((item) => item.folder_id === folder.id).length;
                            const isMenuOpen = activeMenu === folder.id;

                            return (
                                <div
                                    key={folder.id}
                                    onClick={() => setSelectedFolderId(folder.id)}
                                    className="group relative bg-white dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/5 transition-all cursor-pointer backdrop-blur-xl"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/10 group-hover:scale-105 transition-transform">
                                            <Folder size={18} />
                                        </div>
                                        <div className="relative">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveMenu(isMenuOpen ? null : folder.id);
                                                }}
                                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
                                            >
                                                <MoreVertical size={18} />
                                            </button>

                                            {isMenuOpen && (
                                                <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-700 py-1.5 z-10 animate-in slide-in-from-top-1">
                                                    <button
                                                        onClick={() => {
                                                            setEditingFolder(folder);
                                                            setIsFolderModalOpen(true);
                                                        }}
                                                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                                                    >
                                                        <Edit3 size={14} /> Düzenle
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteFolder(folder.id, folder.name)}
                                                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                                                    >
                                                        <Trash2 size={14} /> Sil
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-slate-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors text-base truncate">{folder.name}</h3>
                                    <p className="text-[11px] text-slate-500 font-semibold">
                                        {t('quiz_count_label', { count })}
                                    </p>
                                </div>
                            );
                        })}

                        {folders.length === 0 && searchValue && (
                            <div className="col-span-full py-8 text-center bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                                <p className="text-xs text-slate-500 font-medium">{t('folder_empty')}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Quizzes Section */}
            <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                    <h2 className="text-base font-bold text-slate-800 dark:text-slate-200">
                        {selectedFolderId
                            ? t('folder_view_title', { name: folders.find(f => f.id === selectedFolderId)?.name || '' })
                            : searchValue
                                ? t('search_results')
                                : folders.length > 0
                                    ? t('uncategorized_quizzes')
                                    : t('quizzes_title')}
                    </h2>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {t('quiz_count_label', { count: uncategorizedQuizzes.length })}
                    </span>
                </div>

                {uncategorizedQuizzes.length > 0 ? (
                    <div className="grid gap-2">
                        {uncategorizedQuizzes.map((item) => (
                            <div key={item.id} className="group relative bg-white dark:bg-slate-800/40 p-2.5 sm:p-3 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-indigo-500/50 transition-all flex items-center gap-3 touch-pan-y">
                                <Link href={`/dashboard/quiz/${item.quizzes?.id}`} className="flex-1 flex items-center gap-3 min-w-0">
                                    <div className="w-10 h-10 sm:w-11 sm:h-11 bg-slate-100 dark:bg-slate-700/50 rounded-xl flex items-center justify-center text-slate-500 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-all shrink-0">
                                        <FileText size={20} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors text-sm sm:text-base tracking-tight">
                                            {item.quizzes?.title}
                                        </h4>
                                        <div className="flex items-center gap-2 text-[10px] sm:text-xs text-slate-500 mt-0.5 font-medium overflow-hidden">
                                            <span className="bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] shrink-0">
                                                {t('quiz_count_label', { count: item.quizzes?.question_count || 0 })}
                                            </span>
                                            <span className="shrink-0">•</span>
                                            <span className="truncate">
                                                {item.last_accessed_at
                                                    ? `${formatDistanceToNow(new Date(item.last_accessed_at), { addSuffix: true, locale: dateFnsTr })}`
                                                    : `${formatDistanceToNow(new Date(item.quizzes?.created_at!), { addSuffix: true, locale: dateFnsTr })}`}
                                            </span>
                                        </div>
                                    </div>
                                </Link>

                                <div className="flex items-center gap-0.5">
                                    <button
                                        onClick={() => {
                                            setMovingQuiz({
                                                id: item.quizzes?.id || '',
                                                title: item.quizzes?.title || '',
                                                currentFolderId: item.folder_id
                                            });
                                            setIsMoveModalOpen(true);
                                        }}
                                        className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-all"
                                        title="Klasöre Taşı"
                                    >
                                        <FolderInput size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteQuiz(item.id)}
                                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all"
                                        title="Kütüphaneden Sil"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-slate-50/50 dark:bg-slate-800/20 rounded-[40px] border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center">
                        <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-3xl flex items-center justify-center shadow-xl shadow-slate-200/50 dark:shadow-none mb-6">
                            <AlertTriangle size={40} className="text-slate-300 dark:text-slate-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                            {searchValue ? t('search_results') : t('quiz_empty_title')}
                        </h3>
                        {searchValue ? (
                            <p className="text-slate-500 mb-6">{t('no_results')}</p>
                        ) : (
                            <>
                                <p className="text-slate-500 mb-8 max-w-xs mx-auto">{t('quiz_empty_desc')}</p>
                                <button
                                    onClick={() => setIsUploadModalOpen(true)}
                                    className="inline-flex items-center gap-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-all shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/40 active:scale-95"
                                >
                                    <Plus size={22} />
                                    {t('create_quiz_button')}
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Modals */}
            <FolderModal
                isOpen={isFolderModalOpen}
                onClose={() => {
                    setIsFolderModalOpen(false);
                    setEditingFolder(null);
                }}
                onSuccess={fetchLibrary}
                editFolder={editingFolder}
            />

            <MoveToFolderModal
                isOpen={isMoveModalOpen}
                onClose={() => {
                    setIsMoveModalOpen(false);
                    setMovingQuiz(null);
                }}
                onSuccess={fetchLibrary}
                quiz={movingQuiz}
            />

            {isUploadModalOpen && (
                <QuizUpload onClose={() => setIsUploadModalOpen(false)} />
            )}
        </div>
    );
}
