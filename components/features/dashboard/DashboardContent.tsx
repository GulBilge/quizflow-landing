"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Play, Clock, BookOpen, Search, TrendingUp, CheckCircle2, Crown } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

interface DashboardContentProps {
    user: any;
    recentActivity: any[];
    lastAttempt: any;
}

export default function DashboardContent({ user, recentActivity, lastAttempt }: DashboardContentProps) {
    const [selectedQuiz, setSelectedQuiz] = useState<any>(null);

    // If a quiz is selected, we show its stats, otherwise we show the last attempt stats
    const displayStats = selectedQuiz || lastAttempt;

    const calculateDoughnut = (correct: number, total: number) => {
        if (total === 0) return { strokeDasharray: "0 100", percentage: 0 };
        const percentage = Math.round((correct / total) * 100);
        return { strokeDasharray: `${percentage} ${100 - percentage}`, percentage };
    };

    const stats = displayStats ? calculateDoughnut(displayStats.correct_count || 0, (displayStats.correct_count || 0) + (displayStats.wrong_count || 0)) : null;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Create New Quiz Card */}
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-600/20 relative overflow-hidden group border border-white/10">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/15 transition-all duration-700"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-center md:text-left">
                        <h2 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight">Potansiyelini Keşfet 🚀</h2>
                        <p className="text-indigo-100 max-w-lg mb-8 text-base md:text-lg opacity-90 leading-relaxed">
                            Notlarını yükle, yapay zeka senin için saniyeler içinde kişiselleştirilmiş bir çalışma planı ve sınav hazırlasın.
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                            <button className="bg-white text-indigo-600 px-8 py-3.5 rounded-2xl font-bold text-base hover:bg-indigo-50 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 shadow-lg shadow-black/10">
                                <Plus size={20} className="stroke-[3]" />
                                Yeni Sınav Oluştur
                            </button>
                            <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-3.5 rounded-2xl font-bold text-base hover:bg-white/20 transition-all">
                                Nasıl Çalışır?
                            </button>
                        </div>
                    </div>
                    <div className="hidden lg:block">
                        <div className="w-32 h-32 bg-white/15 rounded-[2rem] flex items-center justify-center backdrop-blur-md border border-white/20 rotate-12 group-hover:rotate-0 transition-transform duration-500 shadow-2xl">
                            <Plus size={48} className="text-white" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats & Activity Grid */}
            <div className="grid lg:grid-cols-12 gap-8">

                {/* Left Column: Recent Activity (8 columns) */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Clock className="text-indigo-600 dark:text-indigo-400" size={20} />
                            <h3 className="font-bold text-xl text-slate-800 dark:text-slate-100">Son Çalışmaların</h3>
                        </div>
                        <Link href="/dashboard/library" className="text-sm text-indigo-600 hover:text-indigo-700 font-bold bg-indigo-50 dark:bg-indigo-900/30 px-4 py-1.5 rounded-full transition-colors">
                            Tümünü Gör
                        </Link>
                    </div>

                    <div className="grid gap-4">
                        {recentActivity && recentActivity.length > 0 ? (
                            recentActivity.map((item: any) => (
                                <div
                                    key={item.id}
                                    onClick={() => setSelectedQuiz(item.quizzes)}
                                    className={`group cursor-pointer bg-white dark:bg-slate-800 p-5 rounded-2xl border transition-all duration-300 flex flex-col sm:flex-row items-center gap-5 ${selectedQuiz?.id === item.quizzes?.id
                                            ? 'border-indigo-500 ring-2 ring-indigo-500/10 shadow-lg'
                                            : 'border-slate-100 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-800 hover:shadow-md'
                                        }`}
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 group-hover:scale-110 transition-transform shadow-inner">
                                        <BookOpen size={24} />
                                    </div>
                                    <div className="flex-1 min-w-0 text-center sm:text-left">
                                        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-lg truncate mb-1">
                                            {item.quizzes?.title}
                                        </h4>
                                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-slate-500 dark:text-slate-400">
                                            <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-700/50 px-2.5 py-1 rounded-lg">
                                                <TrendingUp size={14} className="text-emerald-500" />
                                                {item.quizzes?.question_count || 0} Soru
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <Clock size={14} />
                                                {item.last_accessed_at ? formatDistanceToNow(new Date(item.last_accessed_at), { addSuffix: true, locale: tr }) : 'Yeni'}
                                            </span>
                                        </div>
                                    </div>
                                    <Link
                                        href={`/dashboard/quiz/${item.quizzes?.id}`}
                                        className="sm:w-auto w-full"
                                    >
                                        <button className="w-full sm:w-auto bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 group/btn">
                                            <span>Çöz</span>
                                            <Play size={14} fill="currentColor" className="group-hover/btn:translate-x-0.5 transition-transform" />
                                        </button>
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16 px-4 bg-white dark:bg-slate-800/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700 text-center">
                                <div className="w-24 h-24 mb-6 relative">
                                    <div className="absolute inset-0 bg-indigo-100 dark:bg-indigo-900/20 rounded-full animate-ping opacity-25"></div>
                                    <div className="relative w-full h-full bg-indigo-50 dark:bg-indigo-900/40 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                        <Search size={40} />
                                    </div>
                                </div>
                                <h4 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Henüz bir çalışman yok</h4>
                                <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-8 leading-relaxed">
                                    Hemen yukarıdan ilk dökümanını yükleyerek yapay zeka ile öğrenmeye başlayabilirsin!
                                </p>
                                <button className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2">
                                    <Plus size={20} />
                                    İlk PDF'ini Yükle
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Stats (4 columns) */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="text-indigo-600 dark:text-indigo-400" size={20} />
                        <h3 className="font-bold text-xl text-slate-800 dark:text-slate-100">
                            {selectedQuiz ? 'Seçili Sınav' : 'Son Deneme'} İstatistikleri
                        </h3>
                    </div>

                    {displayStats ? (
                        <div className="bg-slate-900 dark:bg-indigo-950 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden border border-white/5">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>

                            <h4 className="font-bold text-indigo-300 text-base mb-2 uppercase tracking-widest flex items-center gap-2">
                                <CheckCircle2 size={14} />
                                {selectedQuiz ? 'Hızlı Bakış' : 'Genel Başarı'}
                            </h4>
                            <p className="font-bold text-lg mb-8 line-clamp-1 opacity-90">
                                {displayStats.title || displayStats.quizzes?.title}
                            </p>

                            <div className="flex items-center justify-between mb-10">
                                <div className="space-y-4">
                                    <div className="flex items-end gap-1">
                                        <span className="text-6xl font-black tracking-tighter text-indigo-50">
                                            {displayStats.score || 0}
                                        </span>
                                        <span className="text-xl text-indigo-300/60 font-medium mb-1.5">/100</span>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2 text-sm">
                                            <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                                            <span className="text-indigo-100/70 font-medium">{displayStats.correct_count || 0} Doğru</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <div className="w-2 h-2 rounded-full bg-rose-400"></div>
                                            <span className="text-indigo-100/70 font-medium">{displayStats.wrong_count || 0} Yanlış</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Modern SVG Doughnut Chart */}
                                <div className="relative w-32 h-32 flex items-center justify-center">
                                    <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 36 36">
                                        <circle
                                            cx="18" cy="18" r="16"
                                            fill="none"
                                            className="stroke-white/5"
                                            strokeWidth="3.5"
                                        />
                                        <circle
                                            cx="18" cy="18" r="16"
                                            fill="none"
                                            className="stroke-indigo-500 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]"
                                            strokeWidth="3.5"
                                            strokeDasharray={stats?.strokeDasharray || "0 100"}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-xl font-black text-white leading-none">%{stats?.percentage || 0}</span>
                                        <span className="text-[10px] font-bold text-indigo-300/60 uppercase tracking-tighter mt-1">BAŞARI</span>
                                    </div>
                                </div>
                            </div>

                            <Link
                                href={selectedQuiz ? `/dashboard/quiz/${selectedQuiz.id}` : `/dashboard/quiz/${lastAttempt.quiz_id}/result/${lastAttempt.id}`}
                                className="block group/link"
                            >
                                <div className="w-full bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/10 p-4 rounded-2xl text-center text-sm font-bold transition-all flex items-center justify-center gap-2">
                                    {selectedQuiz ? 'Hemen Çözmeye Başla' : 'Sonuçları Analiz Et'}
                                    <TrendingUp size={16} className="group-hover/link:translate-x-1 transition-transform" />
                                </div>
                            </Link>

                            {/* Ad Banner Area */}
                            {!user?.is_premium && (
                                <div className="mt-8 pt-8 border-t border-white/5">
                                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5 flex flex-col items-center justify-center min-h-[150px] group/ad relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent"></div>
                                        <span className="text-[10px] absolute top-2 right-2 bg-white/10 px-1.5 py-0.5 rounded uppercase tracking-widest opacity-50 font-bold">REKLAM</span>
                                        <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center mb-3 text-white/30 group-hover/ad:scale-110 transition-transform">
                                            <Crown size={20} />
                                        </div>
                                        <p className="text-xs text-indigo-200/50 text-center font-medium">Reklamları kaldırmak için Premium'a geçin</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-slate-800 rounded-3xl p-10 border border-slate-100 dark:border-slate-700 text-center flex flex-col items-center shadow-sm">
                            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-700/50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-300 dark:text-slate-500">
                                <TrendingUp size={32} />
                            </div>
                            <h4 className="font-bold text-slate-800 dark:text-white mb-2">Veri Bulunamadı</h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-[200px]">
                                Grafiklerin oluşması için ilk sınavını tamamlamalısın.
                            </p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
