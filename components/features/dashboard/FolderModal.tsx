"use client";

import React, { useState, useEffect } from "react";
import { X, Folder, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface FolderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    editFolder?: { id: string; name: string } | null;
}

export default function FolderModal({ isOpen, onClose, onSuccess, editFolder }: FolderModalProps) {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();

    useEffect(() => {
        if (editFolder) {
            setName(editFolder.name);
        } else {
            setName("");
        }
    }, [editFolder, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Oturum bulunamadı.");

            if (editFolder) {
                // Rename logic (User specific)
                const { error: updateError } = await (supabase as any)
                    .from("user_folders")
                    .update({ custom_name: name.trim() })
                    .match({ id: editFolder.id, user_id: user.id });

                if (updateError) throw updateError;
            } else {
                // Create logic
                // 1. Resolve Global Folder (find or create)
                let globalFolderId: string;
                const { data: existingGlobal } = await supabase
                    .from("folders" as any)
                    .select("id")
                    .eq("name", name.trim())
                    .maybeSingle();

                if (existingGlobal) {
                    globalFolderId = (existingGlobal as any).id;
                } else {
                    const { data: newGlobal, error: globalError } = await supabase
                        .from("folders" as any)
                        .insert({ name: name.trim(), created_by: user.id } as any)
                        .select("id")
                        .single();
                    if (globalError) throw globalError;
                    globalFolderId = (newGlobal as any).id;
                }

                // 2. Link to User Folders
                const { error: linkError } = await supabase
                    .from("user_folders" as any)
                    .upsert({
                        user_id: user.id,
                        folder_id: globalFolderId,
                        custom_name: name.trim()
                    } as any, { onConflict: 'user_id,folder_id' });

                if (linkError) throw linkError;
            }

            onSuccess();
            onClose();
        } catch (err: any) {
            console.error("Klasör işlemi hatası:", err);
            setError(err.message || "Bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                <Folder size={20} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                {editFolder ? "Klasörü Düzenle" : "Yeni Klasör"}
                            </h3>
                        </div>
                        <button type="button" onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                            <X className="text-slate-400" size={20} />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 ml-1">
                                Klasör Adı
                            </label>
                            <input
                                autoFocus
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Örn: Matematik, Tarih..."
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all dark:text-white"
                                required
                            />
                        </div>

                        {error && (
                            <p className="text-sm text-rose-500 ml-1">{error}</p>
                        )}

                        <button
                            type="submit"
                            disabled={loading || !name.trim()}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-3.5 rounded-2xl font-bold shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
                        >
                            {loading && <Loader2 size={18} className="animate-spin" />}
                            {editFolder ? "Değişiklikleri Kaydet" : "Klasör Oluştur"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
