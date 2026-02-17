import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Plus, Play, Clock, BookOpen, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    // 1. Fetch Recent Activity (Limit 5)
    const { data: recentActivity, error: recentError } = await supabase
        .from('user_library')
        .select(`
      id,
      last_accessed_at,
      quizzes (
        id,
        title,
        question_count
      )
    `)
        .eq('user_id', user.id)
        .order('last_accessed_at', { ascending: false })
        .limit(5);

    // 2. Fetch Last Attempt
    const { data: lastAttempt, error: attemptError } = await supabase
        .from('quiz_attempts')
        .select(`
        id,
        score,
        correct_count,
        wrong_count,
        quiz_id,
        status,
        quizzes (title)
      `)
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false })
        .limit(1)
        .single();

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Hoş geldin, {user.user_metadata?.full_name?.split(' ')[0] || 'Öğrenci'} 👋
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        Bugün ne öğrenmek istersin?
                    </p>
                </div>
            </div>

            {/* Create New Quiz Card */}
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-6 text-white shadow-xl shadow-indigo-600/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/20 transition-all duration-300"></div>

                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold mb-2">Yeni Sınav Oluştur</h2>
                        <p className="text-indigo-100 max-w-md mb-6 text-sm opacity-90">
                            Ders notlarını veya sınav PDF'ini yükle, yapay zeka senin için interaktif bir sınav hazırlasın.
                        </p>
                        <div className="flex gap-2">
                            <button className="bg-white text-indigo-600 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors flex items-center gap-2 shadow-sm">
                                <Plus size={18} />
                                Sınav Oluştur
                            </button>
                            {/* Placeholder for future functionality */}
                        </div>
                    </div>
                    <div className="hidden sm:block">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                            <Plus size={32} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats & Activity Grid */}
            <div className="grid lg:grid-cols-3 gap-8">

                {/* Left Column: Recent Activity */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Son Çalışmaların</h3>
                        <Link href="/dashboard/library" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                            Tümü
                        </Link>
                    </div>

                    <div className="space-y-3">
                        {recentActivity && recentActivity.length > 0 ? (
                            recentActivity.map((item: any) => (
                                <Link
                                    href={`/dashboard/quiz/${item.quizzes?.id}`}
                                    key={item.id}
                                    className="block group"
                                >
                                    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-900 transition-all shadow-sm hover:shadow-md flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 group-hover:scale-110 transition-transform">
                                            <BookOpen size={20} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-slate-900 dark:text-slate-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                {item.quizzes?.title}
                                            </h4>
                                            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                <span className="flex items-center gap-1">
                                                    <AlertCircle size={12} />
                                                    {item.quizzes?.question_count || 0} Soru
                                                </span>
                                                <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                                                <span className="flex items-center gap-1">
                                                    <Clock size={12} />
                                                    {item.last_accessed_at ? formatDistanceToNow(new Date(item.last_accessed_at), { addSuffix: true, locale: tr }) : 'Yeni'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                            <Play size={14} fill="currentColor" />
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                                <p className="text-slate-500 text-sm">Henüz bir çalışman yok.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Stats / Last Attempt */}
                <div className="space-y-6">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Son Deneme</h3>

                    {lastAttempt ? (
                        <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl -mr-10 -mt-10"></div>

                            <h4 className="font-medium text-slate-300 text-sm mb-4 truncate pr-4">
                                {/* @ts-ignore */}
                                {lastAttempt.quizzes?.title}
                            </h4>

                            <div className="flex items-end gap-2 mb-6">
                                <span className="text-4xl font-bold">{lastAttempt.score}</span>
                                <span className="text-lg text-slate-400 mb-1">/100</span>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-white/10 rounded-lg p-3 text-center backdrop-blur-sm">
                                    <span className="block text-xl font-bold text-green-400">{lastAttempt.correct_count}</span>
                                    <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">Doğru</span>
                                </div>
                                <div className="bg-white/10 rounded-lg p-3 text-center backdrop-blur-sm">
                                    <span className="block text-xl font-bold text-red-400">{lastAttempt.wrong_count}</span>
                                    <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">Yanlış</span>
                                </div>
                            </div>

                            <Link href={`/dashboard/quiz/${lastAttempt.quiz_id}/result/${lastAttempt.id}`} className="block mt-6 text-center text-sm font-medium text-indigo-300 hover:text-white transition-colors">
                                Detayları Gör &rarr;
                            </Link>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 text-center">
                            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
                                <Clock size={20} />
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Henüz tamamlanmış bir denemen yok.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
