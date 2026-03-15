"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Search, Plus, Loader2, AlertTriangle, Filter, FolderInput, Edit3 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import FolderModal from "@/components/features/dashboard/FolderModal";
import MoveToFolderModal from "@/components/features/dashboard/MoveToFolderModal";
import QuizUpload from "@/components/features/dashboard/QuizUpload";
import LibraryFolderSection from "@/components/features/dashboard/LibraryFolderSection";
import RecentQuizCard from "@/components/features/dashboard/RecentQuizCard";
import EditQuizTitleModal from "@/components/features/dashboard/EditQuizTitleModal";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { quizService } from "@/lib/quizService";
import { toast } from "sonner";

type LibraryItem = {
    id: string;
    folder_id: string | null;
    last_accessed_at: string | null;
    user_quiz_name: string | null;
    user_folder_name: string | null;
    quizzes: {
        id: string;
        title: string;
        question_count: number | null;
        created_at: string;
    } | null;
}

type FolderType = {
    id: string;
    name: string;
    created_at: string | null;
};

export default function LibraryPage() {
    const t = useTranslations('Library');
    const [loading, setLoading] = useState(true);
    const [searchValue, setSearchValue] = useState("");
    const [libraryData, setLibraryData] = useState<LibraryItem[]>([]);
    const [isPremium, setIsPremium] = useState(false);

    // UI State
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

    // Modal States
    const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
    const [editingFolder, setEditingFolder] = useState<FolderType | null>(null);
    const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
    const [movingQuiz, setMovingQuiz] = useState<{ id: string; title: string; currentFolderId: string | null } | null>(null);
    const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    // Edit Title States
    const [isEditTitleModalOpen, setIsEditTitleModalOpen] = useState(false);
    const [editingQuiz, setEditingQuiz] = useState<{ id: string; title: string } | null>(null);

    const supabase = createClient();

    const fetchLibrary = useCallback(async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: profile } = await supabase
                .from('profiles')
                .select('is_pro')
                .eq('id', user.id)
                .single();
            
            if (profile) setIsPremium((profile as any).is_pro);

            const { data, error } = await (supabase as any)
                .from('v_user_library')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            const transformedData: LibraryItem[] = (data || []).map((item: any) => ({
                id: item.id,
                folder_id: item.folder_id,
                last_accessed_at: item.last_accessed_at,
                user_quiz_name: item.user_quiz_name,
                user_folder_name: item.user_folder_name,
                quizzes: item.quiz_id ? {
                    id: item.quiz_id,
                    title: item.user_quiz_name || item.quiz_title || t('adsiz_sinav'),
                    question_count: item.question_count,
                    created_at: item.created_at
                } : null
            }));

            setLibraryData(transformedData);
        } catch (err) {
            console.error(err);
            toast.error(t('error_delete_quiz'));
        } finally {
            setLoading(false);
        }
    }, [supabase, t]);

    useEffect(() => {
        fetchLibrary();
    }, [fetchLibrary]);

    // Derived Data
    const folders = useMemo(() => {
        const folderMap = new Map<string, FolderType>();
        libraryData.forEach(item => {
            if (item.folder_id && !folderMap.has(item.folder_id)) {
                folderMap.set(item.folder_id, {
                    id: item.folder_id,
                    name: item.user_folder_name || t('adsiz_klasor'),
                    created_at: null
                });
            }
        });
        return Array.from(folderMap.values()).sort((a, b) => a.name.localeCompare(b.name));
    }, [libraryData, t]);

    const filteredItems = useMemo(() => {
        if (!searchValue) return libraryData;
        const lowSearch = searchValue.toLowerCase();
        return libraryData.filter(item =>
            item.quizzes?.title.toLowerCase().includes(lowSearch) ||
            item.user_folder_name?.toLowerCase().includes(lowSearch)
        );
    }, [libraryData, searchValue]);

    const groupedData = useMemo(() => {
        const groups: Record<string, LibraryItem[]> = {};

        filteredItems.forEach(item => {
            const key = item.folder_id || 'uncategorized';
            if (!groups[key]) groups[key] = [];
            groups[key].push(item);
        });

        Object.keys(groups).forEach(key => {
            groups[key].sort((a, b) => {
                const dateA = new Date(a.last_accessed_at || 0).getTime();
                const dateB = new Date(b.last_accessed_at || 0).getTime();
                return dateB - dateA;
            });
        });

        return groups;
    }, [filteredItems]);

    // Auto-expand folder when searching
    useEffect(() => {
        if (searchValue) {
            const allKeys = new Set(Object.keys(groupedData));
            setExpandedFolders(allKeys);
        }
    }, [searchValue, groupedData]);

    const toggleFolder = (id: string) => {
        setExpandedFolders(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const router = useRouter();

    const handlePracticeWrongAnswers = async (folderId: string | null) => {
        if (!isPremium) {
            router.push('/checkout');
            return;
        }

        const idToPass = folderId || 'uncategorized';
        setLoading(true);
        try {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const clientDateStr = `${year}-${month}-${day} ${hours}-${minutes}`;

            const res = await fetch(`/api/folders/${idToPass}/wrong-questions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ clientDateStr })
            });
            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || t('error_delete_quiz'));
                return;
            }

            if (data.quizId) {
                router.push(`/dashboard/quiz/${data.quizId}`);
            }
        } catch (err) {
            console.error(err);
            toast.error(t('error_delete_quiz'));
        } finally {
            setLoading(false);
        }
    };

    // Actions
    const handleRenameQuiz = async (newTitle: string) => {
        if (!editingQuiz) return;
        const oldTitle = editingQuiz.title;
        const quizId = editingQuiz.id;

        // Optimistic Update
        setLibraryData(prev => prev.map(item =>
            item.id === quizId ? {
                ...item,
                user_quiz_name: newTitle,
                quizzes: item.quizzes ? { ...item.quizzes, title: newTitle } : null
            } : item
        ));

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("User not found");

            const success = await quizService.updateQuizTitle(quizId, user.id, newTitle);
            if (!success) throw new Error("Update failed");
            toast.success(t('quiz_rename_success'));
        } catch (err) {
            console.error(err);
            toast.error(t('error_delete_quiz'));
            // Revert
            setLibraryData(prev => prev.map(item =>
                item.id === quizId ? {
                    ...item,
                    user_quiz_name: oldTitle,
                    quizzes: item.quizzes ? { ...item.quizzes, title: oldTitle } : null
                } : item
            ));
        }
    };

    const handleDeleteQuiz = async (item: LibraryItem) => {
        if (!confirm(t('delete_quiz_confirm'))) return;

        const originalData = [...libraryData];
        // Optimistic Update
        setLibraryData(prev => prev.filter(i => i.id !== item.id));

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("User not found");

            const success = await quizService.deleteQuiz(item.id, user.id);
            if (!success) throw new Error("Delete failed");
            toast.success(t('quiz_delete_success'));
        } catch (err) {
            console.error(err);
            toast.error(t('error_delete_quiz'));
            setLibraryData(originalData); // Revert
        }
    };

    const handleDeleteFolder = async (id: string, name: string) => {
        if (!confirm(t('delete_folder_confirm', { name }))) return;

        try {
            const { error } = await supabase
                .from("user_folders" as any)
                .delete()
                .eq("id", id);

            if (error) throw error;
            toast.success(t('folder_delete_success'));
            fetchLibrary();
        } catch (err) {
            toast.error(t('error_delete_folder'));
        }
    };

    if (loading && libraryData.length === 0) {
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
                        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{t('title')}</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm font-medium mt-1">{t('subtitle')}</p>
                    </div>

                    <button
                        onClick={() => {
                            setEditingFolder(null);
                            setIsFolderModalOpen(true);
                        }}
                        className="flex md:hidden items-center justify-center w-11 h-11 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-600/20 active:scale-90 transition-transform"
                    >
                        <Plus size={24} />
                    </button>
                </div>

                <div className="flex flex-col md:flex-row gap-3">
                    <div className="relative group flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                        <input
                            type="text"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            placeholder={t('search_placeholder')}
                            className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
                        />
                    </div>

                    <div className="flex gap-2.5">
                        <button
                            onClick={() => {
                                setEditingFolder(null);
                                setIsFolderModalOpen(true);
                            }}
                            className="hidden md:flex items-center gap-2 px-6 py-3.5 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all hover:shadow-lg hover:shadow-indigo-600/20 active:scale-95"
                        >
                            <Plus size={18} />
                            <span>{t('new_folder')}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Folder Sections */}
            <div className="space-y-4">
                {/* Folders first */}
                {folders.map(folder => (
                    <LibraryFolderSection
                        key={folder.id}
                        folderId={folder.id}
                        folderName={folder.name}
                        quizCount={groupedData[folder.id]?.length || 0}
                        isExpanded={expandedFolders.has(folder.id)}
                        onToggle={() => toggleFolder(folder.id)}
                        onEdit={() => {
                            setEditingFolder(folder);
                            setIsFolderModalOpen(true);
                        }}
                        onDelete={() => handleDeleteFolder(folder.id, folder.name)}
                        isPremium={isPremium}
                        onPracticeWrongAnswers={() => handlePracticeWrongAnswers(folder.id)}
                    >
                        {groupedData[folder.id]?.map(item => (
                            <RecentQuizCard
                                key={item.id}
                                item={item}
                                onEditTitle={(e) => {
                                    e.stopPropagation();
                                    setEditingQuiz({ id: item.id, title: item.quizzes?.title || "" });
                                    setIsEditTitleModalOpen(true);
                                }}
                                onMoveToFolder={(e) => {
                                    e.stopPropagation();
                                    setMovingQuiz({
                                        id: item.id,
                                        title: item.quizzes?.title || "",
                                        currentFolderId: item.folder_id
                                    });
                                    setIsMoveModalOpen(true);
                                }}
                                onDelete={(e) => {
                                    e.stopPropagation();
                                    handleDeleteQuiz(item);
                                }}
                            />
                        ))}
                        {(!groupedData[folder.id] || groupedData[folder.id].length === 0) && (
                            <div className="py-8 text-center bg-slate-50/50 dark:bg-slate-800/20 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                                <p className="text-xs text-slate-500 font-medium">{t('folder_empty')}</p>
                            </div>
                        )}
                    </LibraryFolderSection>
                ))}

                {/* Uncategorized Section */}
                {groupedData['uncategorized'] && (
                    <LibraryFolderSection
                        folderId={null}
                        folderName={t('uncategorized_quizzes')}
                        quizCount={groupedData['uncategorized'].length}
                        isExpanded={expandedFolders.has('uncategorized')}
                        onToggle={() => toggleFolder('uncategorized')}
                        isPremium={isPremium}
                        onPracticeWrongAnswers={() => handlePracticeWrongAnswers(null)}
                    >
                        {groupedData['uncategorized'].map(item => (
                            <RecentQuizCard
                                key={item.id}
                                item={item}
                                onEditTitle={(e) => {
                                    e.stopPropagation();
                                    setEditingQuiz({ id: item.id, title: item.quizzes?.title || "" });
                                    setIsEditTitleModalOpen(true);
                                }}
                                onMoveToFolder={(e) => {
                                    e.stopPropagation();
                                    setMovingQuiz({
                                        id: item.id,
                                        title: item.quizzes?.title || "",
                                        currentFolderId: item.folder_id
                                    });
                                    setIsMoveModalOpen(true);
                                }}
                                onDelete={(e) => {
                                    e.stopPropagation();
                                    handleDeleteQuiz(item);
                                }}
                            />
                        ))}
                    </LibraryFolderSection>
                )}

                {/* Empty State */}
                {libraryData.length === 0 && !loading && (
                    <div className="text-center py-12 md:py-24 bg-white dark:bg-slate-800/40 rounded-[40px] border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center">
                        <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-900/30 rounded-3xl flex items-center justify-center text-indigo-200 dark:text-indigo-800 mb-8 animate-pulse">
                            <AlertTriangle size={48} />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                            {searchValue ? t('no_results') : t('quiz_empty_title')}
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-sm mx-auto font-medium">
                            {searchValue ? t('no_results_desc') : t('quiz_empty_desc')}
                        </p>
                        {!searchValue && (
                            <button
                                onClick={() => setIsUploadModalOpen(true)}
                                className="inline-flex items-center gap-3 px-10 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-all shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/40 active:scale-95"
                            >
                                <Plus size={24} />
                                {t('create_quiz_button')}
                            </button>
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

            <EditQuizTitleModal
                isOpen={isEditTitleModalOpen}
                onClose={() => {
                    setIsEditTitleModalOpen(false);
                    setEditingQuiz(null);
                }}
                currentTitle={editingQuiz?.title || ""}
                onSuccess={handleRenameQuiz}
            />
        </div>
    );
}
