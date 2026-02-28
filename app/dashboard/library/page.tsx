import { createClient } from "@/utils/supabase/server";
import { Folder, Search, Filter, Plus, MoreVertical, FileText } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Database } from "@/types/database.types";

export const dynamic = 'force-dynamic';

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

export default async function LibraryPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    // 1. Fetch Folders
    const { data: folders } = await supabase
        .from('folders')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });

    // 2. Fetch All Quizzes (User Library)
    // We want to know which folder they belong to. 
    // The `user_library` table has a `folder_id` column.
    const { data: libraryItems } = await supabase
        .from('user_library')
        .select(`
        id,
        folder_id,
        last_accessed_at,
        quizzes (
            id,
            title,
            question_count,
            created_at
        )
    `)
        .eq('user_id', user.id)
        .order('last_accessed_at', { ascending: false })
        .returns<LibraryItem[]>();

    // Group quizzes by folder for easier rendering if needed, 
    // but for the UI we might show Folders first, then "Uncategorized" or "All Quizzes".

    const uncategorizedQuizzes = libraryItems?.filter((item: LibraryItem) => !item.folder_id) || [];

    return (
        <div className="space-y-6">
            {/* Header & Search */}
            <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Kütüphane</h1>

                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Sınav ara..."
                            className="pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-64 transition-all"
                        />
                    </div>
                    <button className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300">
                        <Filter size={20} />
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium text-sm hover:bg-indigo-700 transition-colors">
                        <Plus size={18} />
                        <span className="hidden sm:inline">Klasör</span>
                    </button>
                </div>
            </div>

            {/* Folders Stats / Quick View */}
            <div className="flex items-center gap-2 text-sm text-slate-500 overflow-x-auto pb-2 scrollbar-hide">
                <span className="whitespace-nowrap px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full font-medium">
                    Tümü ({libraryItems?.length || 0})
                </span>
                {folders?.map((folder: Database['public']['Tables']['folders']['Row']) => (
                    <span key={folder.id} className="whitespace-nowrap px-3 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer border border-transparent hover:border-slate-200">
                        {folder.name}
                    </span>
                ))}
            </div>

            {/* Folders Grid */}
            {folders && folders.length > 0 && (
                <div>
                    <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Klasörlerim</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {folders.map((folder: Database['public']['Tables']['folders']['Row']) => {
                            // Count quizzes in this folder
                            const count = libraryItems?.filter((item: LibraryItem) => item.folder_id === folder.id).length || 0;

                            return (
                                <div key={folder.id} className="group bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 transition-all cursor-pointer relative">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                            <Folder size={20} />
                                        </div>
                                        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                            <MoreVertical size={16} />
                                        </button>
                                    </div>
                                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{folder.name}</h3>
                                    <p className="text-xs text-slate-500">{count} sınav</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Uncategorized / Recent Quizzes List */}
            <div className="space-y-3">
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    {folders && folders.length > 0 ? 'Diğer Sınavlar' : 'Sınavlarım'}
                </h2>

                {uncategorizedQuizzes.length > 0 ? (
                    <div className="grid gap-3">
                        {uncategorizedQuizzes.map((item: LibraryItem) => (
                            <Link href={`/dashboard/quiz/${item.quizzes?.id}`} key={item.id} className="block">
                                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-500/50 hover:shadow-md transition-all flex items-center gap-4 group">
                                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700/50 rounded-xl flex items-center justify-center text-slate-500 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                        <FileText size={24} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                            {item.quizzes?.title}
                                        </h4>
                                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                            <span>{item.quizzes?.question_count || 0} Soru</span>
                                            <span>•</span>
                                            <span>
                                                {item.last_accessed_at
                                                    ? formatDistanceToNow(new Date(item.last_accessed_at), { addSuffix: true, locale: tr })
                                                    : formatDistanceToNow(new Date(item.quizzes?.created_at!), { addSuffix: true, locale: tr })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                            <Search size={32} />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">Henüz sınavın yok</h3>
                        <p className="text-slate-500 mb-6">Ders notlarını yükleyerek hemen bir sınav oluşturabilirsin.</p>
                        <Link href="/dashboard/create" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20">
                            <Plus size={20} />
                            Sınav Oluştur
                        </Link>
                    </div>
                )}
            </div>

        </div>
    );
}
