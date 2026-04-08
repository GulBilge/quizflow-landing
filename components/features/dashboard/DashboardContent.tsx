"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Play, Clock, BookOpen, Search, TrendingUp, CheckCircle2, Crown, Sparkles, LayoutGrid } from "lucide-react";
import QuizUpload from "./QuizUpload";
import RecentQuizCard from "./RecentQuizCard";
import { quizService } from "@/lib/quizService";
import { useRouter } from "next/navigation";
import EditQuizTitleModal from "./EditQuizTitleModal";
import AdSidebar from "../ads/AdSidebar";
import { useTranslations, useLocale } from "next-intl";
import PremiumWebFeatureModal from "./PremiumWebFeatureModal";

interface DashboardContentProps {
    user: any;
    profile: any;
    recentActivity: any[];
    lastAttempt: any;
    userFolders: any[];
}

export default function DashboardContent({ user, profile, recentActivity: initialActivity, lastAttempt, userFolders }: DashboardContentProps) {
    const t = useTranslations("Dashboard");
    const tLibrary = useTranslations("Library");
    const tCommon = useTranslations("Common");
    const locale = useLocale();
    const router = useRouter();
    const [recentActivity, setRecentActivity] = useState(initialActivity);
    const [selectedActivity, setSelectedActivity] = useState<any>(recentActivity[0] || null);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);

    // Edit Title States
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingQuiz, setEditingQuiz] = useState<any>(null);

    // Folder Move States
    const [movingQuiz, setMovingQuiz] = useState<any>(null);
    const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);

    // Dynamic Greeting
    const hour = new Date().getHours();
    const greetingKey = hour < 12 ? "greeting_morning" : hour < 18 ? "greeting_afternoon" : "greeting_evening";
    const firstName = user?.user_metadata?.full_name?.split(' ')[0] || t("firstName_fallback");

    // Handlers
    const handleDelete = async (userQuizId: string) => {
        if (!confirm(tLibrary("delete_quiz_confirm"))) return;
        const success = await quizService.deleteQuiz(userQuizId, user.id);
        if (success) {
            setRecentActivity(prev => prev.filter(a => a.id !== userQuizId));
            if (selectedActivity?.id === userQuizId) setSelectedActivity(null);
        }
    };

    const handleRename = async (newTitle: string) => {
        if (!editingQuiz) return;
        const success = await quizService.updateQuizTitle(editingQuiz.id, user.id, newTitle);
        if (success) {
            setRecentActivity(prev => prev.map(a => a.id === editingQuiz.id ? { ...a, user_quiz_name: newTitle } : a));
            if (selectedActivity?.id === editingQuiz.id) {
                setSelectedActivity((prev: any) => ({ ...prev, user_quiz_name: newTitle }));
            }
        }
    };

    const handleMoveToFolder = async (userFolderId: string | null, folderName: string) => {
        if (!movingQuiz) return;
        const success = await quizService.moveQuizToFolder(movingQuiz.id, user.id, userFolderId);
        if (success) {
            setRecentActivity(prev => prev.map(a => a.id === movingQuiz.id ? { ...a, user_folder_name: folderName } : a));
            setIsFolderModalOpen(false);
            setMovingQuiz(null);
            router.refresh(); // Refresh to sync potential sidebar changes
        }
    };

    // Stats calculation for the right panel
    const displayStats = selectedActivity?.lastAttempt || lastAttempt;
    const calculateProgress = (correct: number, total: number) => {
        if (total === 0) return 0;
        return Math.round((correct / total) * 100);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-full overflow-x-hidden px-1 pb-10">

            {/* Folder Selection Modal */}
            {isFolderModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] w-full max-w-md shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
                        <div className="p-8 border-b border-slate-50 dark:border-slate-700">
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{tLibrary("move_to_folder")}</h3>
                            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1">
                                {t("move_to_folder_desc", { name: movingQuiz?.user_quiz_name || movingQuiz?.quizzes?.title })}
                            </p>
                        </div>
                        <div className="p-4 max-h-[40vh] overflow-y-auto space-y-2">
                            <button
                                onClick={() => handleMoveToFolder(null, tLibrary("genel"))}
                                className="w-full text-left p-4 rounded-3xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-between group"
                            >
                                <span className="font-bold text-slate-700 dark:text-slate-200">{t("genel_klasorsuz")}</span>
                                <Plus size={18} className="text-slate-300 group-hover:text-indigo-500" />
                            </button>
                            {userFolders.map((folder: any) => (
                                <button
                                    key={folder.id}
                                    onClick={() => handleMoveToFolder(folder.id, folder.custom_name)}
                                    className="w-full text-left p-4 rounded-3xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-between group"
                                >
                                    <span className="font-bold text-slate-700 dark:text-slate-200">{folder.custom_name}</span>
                                    <Plus size={18} className="text-slate-300 group-hover:text-indigo-500" />
                                </button>
                            ))}
                        </div>
                        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700">
                            <button
                                onClick={() => setIsFolderModalOpen(false)}
                                className="w-full py-4 rounded-2xl font-bold bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-300 border border-slate-100 dark:border-slate-600 hover:bg-slate-50 transition-all"
                            >
                                {tCommon("vazgec")}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header & Greeting Section */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            {t(greetingKey)}, <span className="text-indigo-600 dark:text-indigo-400">{firstName}!</span>
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm font-medium mt-1">
                            {t("search_prompt")}
                        </p>
                    </div>

                </div>

                {/* Mobile full-width upload button */}
                <button
                    onClick={() => {
                        if (!profile?.is_pro && (recentActivity && recentActivity.length > 0)) {
                            router.push("/mobile?reason=limit");
                            return;
                        }
                        setIsUploadOpen(true);
                    }}
                    className="flex md:hidden w-full items-center justify-center gap-3 py-4 rounded-2xl font-bold text-base text-white shadow-lg shadow-indigo-600/25 active:scale-[0.97] transition-all bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700"
                >
                    <span className="flex items-center justify-center w-7 h-7 bg-white/20 rounded-xl">
                        <Plus size={18} className="stroke-[3]" />
                    </span>
                    <span>{t("new_quiz")}</span>
                    <Sparkles size={16} className="opacity-75" />
                </button>

                <div className="hidden md:flex gap-3">
                    <button
                        onClick={() => {
                            if (!profile?.is_pro && (recentActivity && recentActivity.length > 0)) {
                                router.push("/mobile?reason=limit");
                                return;
                            }
                            setIsUploadOpen(true);
                        }}
                        className="flex items-center gap-2 px-6 py-3.5 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all hover:shadow-lg hover:shadow-indigo-600/20 active:scale-95"
                    >
                        <Plus size={18} />
                        <span>{t("new_quiz")}</span>
                    </button>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-12 gap-8 items-start">

                {/* Left Column: Recent Activity (8 columns) */}
                <div className="lg:col-span-8 space-y-6 order-1 lg:order-1 min-w-0 overflow-hidden">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400">
                                <Clock size={20} />
                            </div>
                            <h3 className="font-bold text-xl text-slate-800 dark:text-slate-100 uppercase tracking-tight">{t("recent_activity")}</h3>
                        </div>

                        <Link href="/dashboard/library" className="group flex items-center gap-1.5 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline decoration-2 underline-offset-4">
                            {t("see_all")}
                            <LayoutGrid size={16} className="group-hover:rotate-12 transition-transform" />
                        </Link>
                    </div>

                    <div className="flex flex-col gap-4 w-full overflow-hidden">
                        {recentActivity && recentActivity.length > 0 ? (
                            recentActivity.map((item, index) => (
                                <RecentQuizCard
                                    key={item.id}
                                    item={item}
                                    isFirst={index === 0}
                                    isSelected={selectedActivity?.id === item.id}
                                    onPress={() => setSelectedActivity(item)}
                                    onDelete={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                                    onEditTitle={(e) => {
                                        e.stopPropagation();
                                        setEditingQuiz(item);
                                        setIsEditModalOpen(true);
                                    }}
                                    onMoveToFolder={(e) => {
                                        e.stopPropagation();
                                        setMovingQuiz(item);
                                        setIsFolderModalOpen(true);
                                    }}
                                />
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 px-6 bg-slate-50/50 dark:bg-slate-800/30 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-700 text-center">
                                <div className="w-24 h-24 mb-6 relative">
                                    <div className="absolute inset-0 bg-indigo-100 dark:bg-indigo-900/20 rounded-full animate-ping opacity-25"></div>
                                    <div className="relative w-full h-full bg-white dark:bg-slate-800 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-xl border border-slate-100 dark:border-slate-700">
                                        <BookOpen size={40} />
                                    </div>
                                </div>
                                <h4 className="text-2xl font-black text-slate-800 dark:text-white mb-3 tracking-tight">{t("empty_state_title")}</h4>
                                <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-8 font-medium leading-relaxed">
                                    {t("empty_state_desc")}
                                </p>
                                <button
                                    onClick={() => setIsUploadOpen(true)}
                                    className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3.5 rounded-2xl font-bold hover:opacity-90 transition-all flex items-center gap-2 shadow-xl shadow-black/10"
                                >
                                    <Plus size={20} className="stroke-[3]" />
                                    {t("upload_first_pdf")}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-4 lg:sticky lg:top-24 order-2 lg:order-2">
                    <AdSidebar isPremium={profile?.is_pro} />
                </div>
            </div>

            {/* Edit Title Modal */}
            <EditQuizTitleModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setEditingQuiz(null);
                }}
                onSuccess={handleRename}
                currentTitle={editingQuiz?.user_quiz_name || editingQuiz?.quizzes?.title || ""}
            />

            {/* Upload Modal */}
            {isUploadOpen && (
                <QuizUpload 
                    onClose={() => setIsUploadOpen(false)} 
                    isPremium={profile?.is_pro}
                />
            )}

            {/* Premium Feature Restriction Modal */}
            <PremiumWebFeatureModal 
                isOpen={isPremiumModalOpen} 
                onClose={() => setIsPremiumModalOpen(false)} 
            />
        </div>
    );
}
