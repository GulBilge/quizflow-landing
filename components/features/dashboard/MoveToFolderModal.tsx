"use client";

import React, { useState, useEffect } from "react";
import { X, FolderPlus, Loader2, Check } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface MoveToFolderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    quiz: { id: string; title: string; currentFolderId: string | null } | null;
}

interface FolderItem {
    id: string;
    name: string;
}

export default function MoveToFolderModal({ isOpen, onClose, onSuccess, quiz }: MoveToFolderModalProps) {
    const [folders, setFolders] = useState<FolderItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();

    useEffect(() => {
        if (isOpen) {
            fetchFolders();
        }
    }, [isOpen]);

    const fetchFolders = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Fetch folders from v_user_library (distinct user_folder_id)
            const { data, error: fetchError } = await (supabase as any)
                .from('v_user_library')
                .select('folder_id, folder_name')
                .eq('user_id', user.id)
                .not('folder_id', 'is', null);

            if (fetchError) throw fetchError;

            // Deduplicate folders
            const folderMap = new Map<string, string>();
            (data || []).forEach((item: any) => {
                if (item.folder_id) {
                    folderMap.set(item.folder_id, item.folder_name || 'Adsız Klasör');
                }
            });

            const folderList = Array.from(folderMap.entries()).map(([id, name]) => ({ id, name }));
            setFolders(folderList.sort((a, b) => a.name.localeCompare(b.name)));
        } catch (err) {
            console.error("Klasörler yüklenemedi:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleMove = async (folderId: string | null) => {
        if (!quiz) return;

        setActionLoading(folderId || "uncategorized");
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Oturum bulunamadı.");

            const { error: updateError } = await (supabase as any)
                .from("user_quizzes")
                .update({ user_folder_id: folderId })
                .match({ user_id: user.id, quiz_id: quiz.id }); // Using quiz_id (linking id in user_quizzes table is usually quiz_id in our context or a separate PK)
            // Wait, based on v_user_library, uq.id is used. Let's be careful.
            // In my previous edits, I used upsert with {user_id, quiz_id} on Conflict.
            // Let's check user_schema_update.sql: id is PK, unique(user_id, quiz_id).
            // So .match({ user_id, quiz_id }) is safe.

            if (updateError) throw updateError;

            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.message || "Taşıma işlemi başarısız.");
        } finally {
            setActionLoading(null);
        }
    };

    if (!isOpen || !quiz) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Klasöre Taşı</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 truncate max-w-[300px]">
                                {quiz.title}
                            </p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                            <X className="text-slate-400" size={20} />
                        </button>
                    </div>

                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {/* Uncategorized Option */}
                        <button
                            onClick={() => handleMove(null)}
                            disabled={quiz.currentFolderId === null || actionLoading !== null}
                            className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${quiz.currentFolderId === null
                                ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800'
                                : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700'
                                }`}
                        >
                            <span className="font-medium text-slate-700 dark:text-slate-200">Kategorisiz</span>
                            {quiz.currentFolderId === null ? <Check size={18} className="text-indigo-600" /> : null}
                            {actionLoading === "uncategorized" && <Loader2 size={18} className="animate-spin text-indigo-600" />}
                        </button>

                        {loading ? (
                            <div className="flex justify-center py-4">
                                <Loader2 size={24} className="animate-spin text-slate-400" />
                            </div>
                        ) : (
                            folders.map(folder => (
                                <button
                                    key={folder.id}
                                    onClick={() => handleMove(folder.id)}
                                    disabled={quiz.currentFolderId === folder.id || actionLoading !== null}
                                    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${quiz.currentFolderId === folder.id
                                        ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800'
                                        : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700'
                                        }`}
                                >
                                    <span className="font-medium text-slate-700 dark:text-slate-200">{folder.name}</span>
                                    {quiz.currentFolderId === folder.id ? <Check size={18} className="text-indigo-600" /> : null}
                                    {actionLoading === folder.id && <Loader2 size={18} className="animate-spin text-indigo-600" />}
                                </button>
                            ))
                        )}
                    </div>

                    {error && (
                        <p className="text-sm text-rose-500 mt-4 text-center">{error}</p>
                    )}

                    {!folders.length && !loading && (
                        <p className="text-sm text-slate-400 text-center py-8">
                            Henüz başka klasörün yok.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
