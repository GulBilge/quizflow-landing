"use client";

import React, { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import {
    Trophy,
    CheckCircle2,
    XCircle,
    Activity,
    Filter,
    ChevronDown,
    ArrowLeft,
    Calendar,
    LayoutGrid,
    Search
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/utils/cn";
import { Sparkline, ProgressCircle, MiniBarChart } from "./MiniCharts";
import { motion, AnimatePresence } from "framer-motion";

interface PerformanceContentProps {
    attempts: any[];
    library: any[];
    folders: any[];
    initialQuizId?: string;
}

export default function PerformanceContent({
    attempts,
    library,
    folders,
    initialQuizId
}: PerformanceContentProps) {
    const t = useTranslations("Performance");
    const [selectedQuizId, setSelectedQuizId] = useState<string | "all">(initialQuizId || "all");
    const [selectedFolderId, setSelectedFolderId] = useState<string | "all">("all");
    const [searchTerm, setSearchTerm] = useState("");

    // Filter Logic
    const filteredAttempts = useMemo(() => {
        return attempts.filter(att => {
            const matchesQuiz = selectedQuizId === "all" || att.quiz_id === selectedQuizId;

            // If folder is selected, we need to find if this attempt's quiz belongs to that folder
            let matchesFolder = selectedFolderId === "all";
            if (!matchesFolder) {
                const libItem = library.find(l => l.quiz_id === att.quiz_id);
                matchesFolder = libItem?.user_folder_id === selectedFolderId;
            }

            return matchesQuiz && matchesFolder;
        }).sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime());
    }, [attempts, selectedQuizId, selectedFolderId, library]);

    // Stats Calculation
    const stats = useMemo(() => {
        if (filteredAttempts.length === 0) return null;

        const total = filteredAttempts.length;
        const avgScore = filteredAttempts.reduce((acc, curr) => acc + (curr.score || 0), 0) / total;
        const totalCorrect = filteredAttempts.reduce((acc, curr) => acc + (curr.correct_count || 0), 0);
        const totalWrong = filteredAttempts.reduce((acc, curr) => acc + (curr.wrong_count || 0), 0);
        const successRate = (totalCorrect / (totalCorrect + totalWrong || 1)) * 100;

        // Score trend (last 10 attempts in chronological order)
        const trend = [...filteredAttempts]
            .slice(0, 10)
            .reverse()
            .map(a => Math.round(a.score || 0));

        // Quiz distribution for Bar Chart (top 5)
        const quizMap = new Map();
        filteredAttempts.forEach(att => {
            const libItem = library.find(l => l.quiz_id === att.quiz_id);
            const name = libItem?.user_quiz_name || "Sınav";
            quizMap.set(name, (quizMap.get(name) || 0) + 1);
        });
        const distribution = Array.from(quizMap.entries())
            .map(([label, value]) => ({ label, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);

        return {
            total,
            avgScore,
            successRate,
            totalCorrect,
            totalWrong,
            trend,
            distribution
        };
    }, [filteredAttempts, library]);

    return (
        <div className="max-w-5xl mx-auto space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Link
                            href="/dashboard"
                            className="p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                        >
                            <ArrowLeft size={20} className="text-slate-600 dark:text-slate-400" />
                        </Link>
                        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                            {t("title")}
                        </h1>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base font-medium">
                        {t("subtitle")}
                    </p>
                </div>

                <div className="status-badge flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-2xl font-bold text-sm border border-indigo-100 dark:border-indigo-800/30">
                    <Activity size={16} />
                    {stats?.total || 0} {t("total_attempts")}
                </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <LayoutGrid size={18} className="text-slate-400" />
                    </div>
                    <select
                        value={selectedFolderId}
                        onChange={(e) => {
                            setSelectedFolderId(e.target.value);
                            setSelectedQuizId("all"); // Reset quiz filter when folder changes
                        }}
                        className="w-full pl-12 pr-10 py-3.5 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl appearance-none focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 transition-all font-bold text-slate-700 dark:text-slate-200 shadow-sm"
                    >
                        <option value="all">{t("all_folders")}</option>
                        {folders.map(f => (
                            <option key={f.id} value={f.id}>{f.custom_name}</option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                        <ChevronDown size={18} />
                    </div>
                </div>

                <div className="relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Search size={18} className="text-slate-400" />
                    </div>
                    <select
                        value={selectedQuizId}
                        onChange={(e) => setSelectedQuizId(e.target.value)}
                        className="w-full pl-12 pr-10 py-3.5 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl appearance-none focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 transition-all font-bold text-slate-700 dark:text-slate-200 shadow-sm"
                    >
                        <option value="all">{t("all_quizzes")}</option>
                        {library
                            .filter(l => selectedFolderId === "all" || l.user_folder_id === selectedFolderId)
                            .map(l => (
                                <option key={l.quiz_id} value={l.quiz_id}>{l.user_quiz_name}</option>
                            ))
                        }
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                        <ChevronDown size={18} />
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            {stats ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Main Stats Card */}
                    <motion.div
                        whileHover={{ y: -4 }}
                        className="md:col-span-2 bg-indigo-600 rounded-[2rem] p-6 md:p-8 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Trophy size={140} weight="fill" />
                        </div>

                        <div className="relative z-10 flex flex-col md:flex-row gap-8 justify-between">
                            <div className="space-y-4">
                                <h3 className="text-white/80 font-bold uppercase tracking-wider text-xs">
                                    {t("avg_score")}
                                </h3>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl md:text-6xl font-black">
                                        %{Math.round(stats.avgScore)}
                                    </span>
                                    <div className="h-2 w-2 rounded-full bg-indigo-300 animate-pulse" />
                                </div>
                                <div className="flex items-center gap-4 pt-2">
                                    <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full text-sm font-bold backdrop-blur-sm">
                                        <CheckCircle2 size={16} className="text-emerald-300" />
                                        {stats.totalCorrect} {t("correct")}
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full text-sm font-bold backdrop-blur-sm">
                                        <XCircle size={16} className="text-rose-300" />
                                        {stats.totalWrong} {t("wrong")}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-center md:items-end justify-center gap-4 bg-white/10 p-5 rounded-3xl backdrop-blur-sm">
                                <span className="text-xs font-bold uppercase tracking-widest text-white/70">
                                    {t("score_trend")}
                                </span>
                                <Sparkline data={stats.trend} color="white" width={160} height={60} />
                            </div>
                        </div>
                    </motion.div>

                    {/* Success Rate Circle */}
                    <motion.div
                        whileHover={{ y: -4 }}
                        className="bg-white dark:bg-slate-800 rounded-[2rem] p-8 border border-slate-100 dark:border-slate-700 shadow-xl flex flex-col items-center justify-center gap-6"
                    >
                        <h3 className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider text-xs">
                            {t("success_rate")}
                        </h3>
                        <div className="scale-150 py-4">
                            <ProgressCircle percentage={stats.successRate} size={80} strokeWidth={8} color="#4f46e5" />
                        </div>
                        <p className="text-center text-sm font-medium text-slate-500 dark:text-slate-400">
                            {t("total_attempts")}: {stats.total}
                        </p>
                    </motion.div>

                    {/* Topic/Quiz Distribution */}
                    <div className="md:col-span-3 bg-white dark:bg-slate-800 rounded-[2rem] p-8 border border-slate-100 dark:border-slate-700 shadow-xl">
                        <h3 className="text-slate-700 dark:text-slate-200 font-black text-lg mb-8 flex items-center gap-3">
                            <Activity className="text-indigo-600" size={24} />
                            {t("topic_distribution")}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                            <div className="space-y-4">
                                {stats.distribution.map((item, i) => (
                                    <div key={i} className="flex flex-col gap-1.5">
                                        <div className="flex justify-between text-sm font-bold">
                                            <span className="text-slate-700 dark:text-slate-300 truncate pr-4">{item.label}</span>
                                            <span className="text-indigo-600 dark:text-indigo-400">{item.value} {t("total_attempts")}</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(item.value / stats.total) * 100}%` }}
                                                transition={{ duration: 1, delay: i * 0.1 }}
                                                className="h-full bg-indigo-600 rounded-full"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-900/40 p-6 rounded-3xl h-full flex flex-col justify-center">
                                <h4 className="text-xs font-black uppercase text-slate-400 mb-6 text-center">SON 10 SINAV PUANI</h4>
                                <div className="flex items-end justify-center gap-3 h-24">
                                    {stats.trend.map((val, i) => (
                                        <div key={i} className="relative group flex-1">
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: `${val}%` }}
                                                className="w-full bg-indigo-500/20 group-hover:bg-indigo-500 rounded-t-lg transition-colors"
                                            />
                                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                {val}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-700">
                    <div className="inline-flex p-4 bg-slate-50 dark:bg-slate-900/40 rounded-full mb-4">
                        <Filter size={32} className="text-slate-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t("no_data")}</h3>
                    <p className="text-slate-500 max-w-xs mx-auto text-sm">{t("subtitle")}</p>
                </div>
            )}
        </div>
    );
}
