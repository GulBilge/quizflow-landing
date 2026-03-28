"use client";

import React, { useState, useEffect, useRef } from "react";
import {
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    XCircle,
    Info,
    Trophy,
    RotateCcw,
    Home,
    Target,
    CheckCircle,
    AlertCircle,
    Type,
    Flag,
    User,
    Download,
    Lock
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { calculateQuizScore, randomizeQuizData } from "@/utils/quiz";
import Link from "next/link";
import { cn } from "@/utils/cn";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import ReportQuestionModal from "./ReportQuestionModal";
import AdInterstitial from "../ads/AdInterstitial";
import PdfDownloadSection from "./PdfDownloadSection";
import QuizShareSection from "./QuizShareSection";

interface Question {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
}

interface QuizPlayerProps {
    quiz: {
        id: string;
        title: string;
        content: Question[];
    };
    userId?: string;
    isPremium?: boolean;
    isShared?: boolean;
}

const QuizStarter = ({
    title,
    onStart,
    t
}: {
    title: string;
    onStart: (shuffle: boolean) => void;
    t: any;
}) => {
    return (
        <div className="max-w-2xl mx-auto py-12 px-4 flex flex-col items-center justify-center min-h-[80vh]">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="w-full bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-12 border border-slate-100 dark:border-slate-800 shadow-2xl text-center relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

                <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Target size={40} className="text-indigo-600 dark:text-indigo-400" />
                </div>

                <h2 className="text-3xl font-black mb-2 text-slate-900 dark:text-white">
                    {t("title")}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mb-10">
                    {t("message", { title })}
                </p>

                <div className="grid gap-4 mb-8">
                    <button
                        onClick={() => onStart(false)}
                        className="group flex items-center p-6 rounded-3xl border-2 border-slate-100 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 bg-slate-50 dark:bg-slate-800/50 transition-all text-left"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center mr-4 shrink-0 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                            <ChevronRight size={24} />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-slate-900 dark:text-white">{t("original")}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{t("original_desc")}</p>
                        </div>
                    </button>

                    <button
                        onClick={() => onStart(true)}
                        className="group flex items-center p-6 rounded-3xl border-2 border-slate-100 dark:border-slate-800 hover:border-purple-500 dark:hover:border-purple-500 bg-slate-50 dark:bg-slate-800/50 transition-all text-left"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center mr-4 shrink-0 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                            <RotateCcw size={24} />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-slate-900 dark:text-white">{t("shuffle")}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{t("shuffle_desc")}</p>
                        </div>
                    </button>
                </div>

                <Link href="/dashboard" className="text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors">
                    {t("vazgec", { defaultValue: "Vazgeç" })}
                </Link>
            </motion.div>
        </div>
    );
};

type FontSize = "small" | "medium" | "large";

export default function QuizPlayer({ quiz, userId, isPremium = false, isShared = false }: QuizPlayerProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [correctCount, setCorrectCount] = useState(0);
    const [wrongCount, setWrongCount] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);
    const [quizData, setQuizData] = useState<Question[]>(quiz.content);
    const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
    const [fontSize, setFontSize] = useState<FontSize>("medium");
    const [userData, setUserData] = useState<{ name?: string; avatar?: string } | null>(null);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [isShowingAd, setIsShowingAd] = useState(false);
    const [pendingShuffle, setPendingShuffle] = useState(false);
    const explanationRef = useRef<HTMLDivElement>(null);
    const supabase = createClient();
    const t = useTranslations("Quiz");
    const st = useTranslations("QuizStarter");
    const ct = useTranslations("Common");
    const rt = useTranslations("Report");

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserData({
                    name: user.user_metadata?.full_name || user.email?.split('@')[0],
                    avatar: user.user_metadata?.avatar_url
                });
            }
        };
        fetchUser();
    }, []);

    useEffect(() => {
        if (isAnswered && explanationRef.current) {
            explanationRef.current.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }
    }, [isAnswered]);

    useEffect(() => {
        if (isShared && !hasStarted) {
            handleStart(false);
        }
    }, [isShared]);

    useEffect(() => {
        if (isCompleted) {
            const duration = 3 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

            const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

            const interval: any = setInterval(function () {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
            }, 250);

            return () => clearInterval(interval);
        }
    }, [isCompleted]);

    const currentQuestion = quizData[currentIndex];
    const progress = ((currentIndex) / quizData.length) * 100;

    const handleAnswer = (index: number) => {
        if (isAnswered) return;

        setSelectedOption(index);
        setIsAnswered(true);
        setUserAnswers(prev => ({ ...prev, [currentIndex]: index }));

        if (index === currentQuestion.correctAnswer) {
            setCorrectCount(prev => prev + 1);
        } else {
            setWrongCount(prev => prev + 1);
        }
    };

    const handleNext = async () => {
        if (currentIndex < quizData.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setSelectedOption(null);
            setIsAnswered(false);
        } else {
            await finishQuiz();
        }
    };

    const finishQuiz = async () => {
        const finalScore = calculateQuizScore(correctCount, wrongCount, quizData.length);

        if (userId) {
            const { error } = await supabase
                .from("quiz_attempts" as any)
                .insert({
                    user_id: userId,
                    quiz_id: quiz.id,
                    score: finalScore,
                    correct_count: correctCount,
                    wrong_count: wrongCount,
                    user_answers: userAnswers,
                    status: "completed",
                    completed_at: new Date().toISOString()
                } as any);

            if (error) console.error("Error saving attempt:", error);
        }

        setIsCompleted(true);
    };

    const getDynamicGrading = (score: number) => {
        if (score === 100) return { title: t("grading_legendary"), color: "text-emerald-600 dark:text-emerald-400" };
        if (score >= 85) return { title: t("grading_great"), color: "text-indigo-600 dark:text-indigo-400" };
        if (score >= 70) return { title: t("grading_congrats"), color: "text-blue-600 dark:text-blue-400" };
        return { title: t("grading_completed"), color: "text-slate-600 dark:text-slate-400" };
    };

    const cycleFontSize = () => {
        setFontSize(prev => {
            if (prev === "small") return "medium";
            if (prev === "medium") return "large";
            return "small";
        });
    };

    const getFontSizeClass = (type: "question" | "option") => {
        if (type === "question") {
            if (fontSize === "small") return "text-lg";
            if (fontSize === "medium") return "text-xl sm:text-2xl";
            return "text-3xl";
        }
        if (fontSize === "small") return "text-xs sm:text-sm";
        if (fontSize === "medium") return "text-sm sm:text-base";
        return "text-lg sm:text-xl";
    };

    const handleStart = (shuffle: boolean) => {
        setPendingShuffle(shuffle);
        if (isPremium || isShared) {
            proceedToQuiz();
        } else {
            setIsShowingAd(true);
        }
    };

    const proceedToQuiz = () => {
        if (pendingShuffle) {
            setQuizData(randomizeQuizData(quiz.content));
        }
        setIsShowingAd(false);
        setHasStarted(true);
    };

    const handleGuestLogin = async () => {
        const nextPath = `/quiz-import?id=${quiz.id}`;
        // Get locale from URL path
        const locale = window.location.pathname.split('/')[1] || 'tr';
        
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}&locale=${locale}`,
                queryParams: { prompt: "select_account" },
            },
        });
    };

    if (!hasStarted) {
        return (
            <>
                <QuizStarter title={quiz.title} onStart={handleStart} t={st} />
                <AdInterstitial
                    isOpen={isShowingAd}
                    onClose={proceedToQuiz}
                    onProceed={proceedToQuiz}
                    adSlot="5202700378" /* Quiz interstitial slot */
                    title={ct("quiz_preparing")}
                    description={ct("quiz_preparing_description")}
                />
            </>
        );
    }

    if (isCompleted) {
        const score = calculateQuizScore(correctCount, wrongCount, quizData.length);
        const { title, color } = getDynamicGrading(score);

        return (
            <div className="max-w-2xl mx-auto py-12 px-4 flex flex-col items-center justify-center min-h-[80vh]">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="w-full bg-white dark:bg-slate-900 rounded-[2.5rem] p-5 sm:p-8 md:p-12 border border-slate-100 dark:border-slate-800 shadow-2xl text-center relative overflow-hidden"
                >
                    {/* Background decoration */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl"></div>

                    {/* User Identity Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col items-center mb-8"
                    >
                        <div className="w-20 h-20 rounded-full border-4 border-indigo-500/20 p-1 mb-3 relative">
                            {userData?.avatar ? (
                                <img src={userData.avatar} alt={userData.name} className="w-full h-full rounded-full object-cover" />
                            ) : (
                                <div className="w-full h-full rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                    <User size={32} className="text-slate-400" />
                                </div>
                            )}
                            {userId && (
                                <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1 border-2 border-white dark:border-slate-900">
                                    <CheckCircle2 size={14} className="text-white" />
                                </div>
                            )}
                        </div>
                        <span className="text-sm font-black text-slate-400 uppercase tracking-widest">
                            {userId ? userData?.name : ct("user_fallback")}
                        </span>
                    </motion.div>

                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 15 }}
                        className="w-20 h-20 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-900/40 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner relative group"
                    >
                        <Trophy size={40} className="text-indigo-600 dark:text-indigo-400 group-hover:rotate-12 transition-transform duration-300" />
                        <motion.div
                            animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 rounded-3xl bg-indigo-400/20 blur-xl -z-10"
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <h2 className={cn("text-3xl sm:text-4xl font-black mb-2 tracking-tight", color)}>
                            {title}
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-lg mb-10 font-medium italic">
                            {quiz.title}
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                        {[
                            {
                                label: t("stat_success"),
                                value: `%${score}`,
                                icon: Target,
                                color: "text-indigo-600 dark:text-indigo-400",
                                bg: "bg-indigo-50 dark:bg-indigo-900/10",
                                border: "border-indigo-100 dark:border-indigo-900/20"
                            },
                            {
                                label: ct("correct"),
                                value: correctCount,
                                icon: CheckCircle,
                                color: "text-emerald-600 dark:text-emerald-400",
                                bg: "bg-emerald-50 dark:bg-emerald-900/10",
                                border: "border-emerald-100 dark:border-emerald-900/20"
                            },
                            {
                                label: ct("wrong"),
                                value: wrongCount,
                                icon: AlertCircle,
                                color: "text-rose-600 dark:text-rose-400",
                                bg: "bg-rose-50 dark:bg-rose-900/10",
                                border: "border-rose-100 dark:border-rose-900/20"
                            },
                        ].map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + (i * 0.1) }}
                                className={cn(
                                    "p-6 rounded-[2rem] border flex flex-col items-center justify-center gap-2 transition-transform hover:scale-[1.02] duration-300",
                                    stat.bg,
                                    stat.border
                                )}
                            >
                                <stat.icon size={20} className={stat.color} />
                                <span className={cn("text-3xl font-black leading-none", stat.color)}>
                                    {stat.value}
                                </span>
                                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{stat.label}</span>
                            </motion.div>
                        ))}
                    </div>

                    {!userId && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className="mb-8 p-6 rounded-[2rem] bg-indigo-50 dark:bg-indigo-900/10 border-2 border-indigo-100 dark:border-indigo-900/20 text-center relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
                                <RotateCcw size={48} className="text-indigo-600" />
                            </div>
                            <h3 className="text-xl font-black text-indigo-900 dark:text-indigo-100 mb-2">
                                {t("guest_login_title")}
                            </h3>
                            <p className="text-sm text-indigo-700/70 dark:text-indigo-300/70 mb-6 font-medium max-w-sm mx-auto">
                                {t("guest_login_desc")}
                            </p>
                            <Button 
                                onClick={handleGuestLogin}
                                className="h-12 px-8 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="currentColor" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="currentColor" />
                                </svg>
                                {t("guest_login_btn")}
                            </Button>
                        </motion.div>
                    )}

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="flex flex-col sm:flex-row gap-4 mb-4"
                    >
                        <Button
                            onClick={() => window.location.reload()}
                            variant="outline"
                            className="flex-1 h-14 rounded-2xl font-bold gap-3 text-base border-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95"
                        >
                            <RotateCcw size={20} className="text-indigo-600" />
                            {t("try_again")}
                        </Button>
                        <Link href="/dashboard" className="flex-1">
                            <Button className="w-full h-14 rounded-2xl font-bold bg-indigo-600 hover:bg-indigo-700 gap-3 text-base shadow-xl shadow-indigo-600/20 transition-all active:scale-95">
                                <Home size={20} />
                                {t("return_dashboard")}
                            </Button>
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                        className="mb-4 border-t border-slate-100 dark:border-slate-800 pt-6"
                    >
                        <QuizShareSection
                            quizId={quiz.id}
                            quizTitle={quiz.title}
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.0 }}
                        className="mb-8"
                    >
                        <PdfDownloadSection
                            quizId={quiz.id}
                            quizTitle={quiz.title}
                            isPremiumContext={isPremium}
                            initialQuizData={quiz}
                        />
                    </motion.div>

                    <div className="flex items-center justify-center gap-2 pt-4 border-t border-slate-100 dark:border-slate-800 opacity-60">
                        <img src="/favicon.ico" className="w-4 h-4" alt="Quizyen" />
                        <span className="text-xs font-bold text-slate-500">{t("built_with_quizyen")}</span>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-4 px-4 sm:px-6">
            <div className="mb-6 space-y-4">
                <div className="flex items-center justify-between">
                    <Link href="/dashboard" className="text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors flex items-center gap-2 text-sm font-semibold group">
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30">
                            <ChevronLeft size={16} />
                        </div>
                        {t("exit_quiz")}
                    </Link>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <button
                            onClick={cycleFontSize}
                            className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors group"
                            title={t("font_size")}
                        >
                            <Type size={18} className={cn("transition-all", fontSize === "large" ? "scale-125" : fontSize === "small" ? "scale-75" : "scale-100")} />
                        </button>

                        <div className="flex items-center gap-1.5 sm:gap-2 bg-emerald-50 dark:bg-emerald-900/20 px-3 sm:px-4 py-1.5 rounded-2xl border border-emerald-100 dark:border-emerald-900/20">
                            <CheckCircle size={14} className="text-emerald-600 dark:text-emerald-400" />
                            <span className="text-xs sm:text-sm font-black text-emerald-600 dark:text-emerald-400">{correctCount}</span>
                        </div>

                        <span className="text-xs sm:text-sm font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-3 sm:px-4 py-1.5 rounded-2xl">
                            {currentIndex + 1} / {quizData.length}
                        </span>
                    </div>
                </div>
                <div className="relative pt-1">
                    <Progress value={progress} className="h-3 rounded-full bg-slate-100 dark:bg-slate-800" />
                    <div
                        className="absolute top-0 h-3 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                >
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 sm:p-10 border border-slate-100 dark:border-slate-800 shadow-2xl shadow-indigo-200/20 dark:shadow-none min-h-[400px] flex flex-col">
                        <div className="flex-1">
                            <h2 className={cn("font-black text-slate-900 dark:text-slate-100 leading-tight mb-8 transition-all", getFontSizeClass("question"))}>
                                {currentQuestion.question}
                            </h2>

                            <div className="grid grid-cols-1 gap-3">
                                {currentQuestion.options.map((option, index) => {
                                    const isSelected = selectedOption === index;
                                    const isCorrect = isAnswered && index === currentQuestion.correctAnswer;
                                    const isWrong = isAnswered && isSelected && index !== currentQuestion.correctAnswer;

                                    return (
                                        <motion.button
                                            key={index}
                                            whileTap={{ scale: 0.98 }}
                                            disabled={isAnswered}
                                            onClick={() => handleAnswer(index)}
                                            className={cn(
                                                "w-full p-5 rounded-2xl border-2 text-left transition-all flex items-center justify-between group relative overflow-hidden",
                                                !isAnswered && !isSelected && "border-slate-100 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800 bg-slate-50/50 dark:bg-slate-800/30",
                                                !isAnswered && isSelected && "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/10",
                                                isAnswered && isCorrect && "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-900 dark:text-emerald-100 z-10",
                                                isAnswered && isWrong && "border-rose-500 bg-rose-50 dark:bg-rose-900/20 text-rose-900 dark:text-rose-100 z-10",
                                                isAnswered && !isSelected && !isCorrect && "border-slate-100 dark:border-slate-800 opacity-40"
                                            )}
                                        >
                                            <span className={cn("font-bold flex-1 pr-6 transition-all", getFontSizeClass("option"))}>{option}</span>

                                            {isAnswered && isCorrect && (
                                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="shrink-0 bg-emerald-500 rounded-full p-1">
                                                    <CheckCircle2 className="text-white" size={16} />
                                                </motion.div>
                                            )}
                                            {isAnswered && isWrong && (
                                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="shrink-0 bg-rose-500 rounded-full p-1">
                                                    <XCircle className="text-white" size={16} />
                                                </motion.div>
                                            )}
                                            {!isAnswered && (
                                                <div className={cn(
                                                    "w-6 h-6 rounded-full border-2 shrink-0 transition-all flex items-center justify-center",
                                                    isSelected ? "border-indigo-600 bg-indigo-600" : "border-slate-300 dark:border-slate-600 group-hover:border-indigo-400"
                                                )}>
                                                    {isSelected && <div className="w-2 h-2 bg-white rounded-full shadow-sm" />}
                                                </div>
                                            )}
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </div>

                        {isAnswered && currentQuestion.explanation && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                ref={explanationRef}
                                className="mt-8 p-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-3xl"
                            >
                                <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400 font-black mb-3 text-sm uppercase tracking-wider">
                                    <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
                                        <Info size={14} />
                                    </div>
                                    {t("explanation_title")}
                                </div>
                                <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed font-semibold">
                                    {currentQuestion.explanation}
                                </p>
                            </motion.div>
                        )}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                        {userId ? (
                            <Button
                                variant="ghost"
                                className="h-14 px-4 sm:px-6 rounded-2xl font-black text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-900/20 gap-2 transition-all"
                                onClick={() => setIsReportModalOpen(true)}
                            >
                                <Flag size={18} />
                                <span className="hidden sm:inline">{rt("report_question")}</span>
                            </Button>
                        ) : (
                            <div />
                        )}

                        <Button
                            disabled={!isAnswered}
                            onClick={handleNext}
                            className={cn(
                                "h-14 px-8 sm:px-10 rounded-2xl font-black text-base sm:text-lg shadow-2xl transition-all gap-3 active:scale-95",
                                isAnswered ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/30" : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 shadow-none"
                            ) as string}
                        >
                            {currentIndex === quizData.length - 1 ? t("finish_quiz") : t("next_question")}
                            <ChevronRight size={22} />
                        </Button>
                    </div>

                </motion.div>
            </AnimatePresence>

            <ReportQuestionModal
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
                quizId={quiz.id}
                userId={userId}
                questionIndex={currentIndex}
            />
        </div>
    );
}
