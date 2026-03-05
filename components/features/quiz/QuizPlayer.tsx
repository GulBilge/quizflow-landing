"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, CheckCircle2, XCircle, Info, Trophy, RotateCcw, Home } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { calculateQuizScore } from "@/utils/quiz";
import Link from "next/link";
import { cn } from "@/utils/cn";

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
    userId: string;
}

export default function QuizPlayer({ quiz, userId }: QuizPlayerProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [correctCount, setCorrectCount] = useState(0);
    const [wrongCount, setWrongCount] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);
    const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
    const supabase = createClient();

    const currentQuestion = quiz.content[currentIndex];
    const progress = ((currentIndex) / quiz.content.length) * 100;

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
        if (currentIndex < quiz.content.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setSelectedOption(null);
            setIsAnswered(false);
        } else {
            await finishQuiz();
        }
    };

    const finishQuiz = async () => {
        const finalScore = calculateQuizScore(correctCount, wrongCount, quiz.content.length);

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

        setIsCompleted(true);
    };

    if (isCompleted) {
        const score = calculateQuizScore(correctCount, wrongCount, quiz.content.length);
        return (
            <div className="max-w-2xl mx-auto py-12 px-4 animate-in fade-in zoom-in duration-500">
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800 shadow-2xl text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-violet-500"></div>

                    <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-8 text-indigo-600 dark:text-indigo-400">
                        <Trophy size={48} />
                    </div>

                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Harika İş! 🎉</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-10">Sınavı başarıyla tamamladın.</p>

                    <div className="grid grid-cols-3 gap-4 mb-10">
                        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                            <span className="block text-3xl font-black text-indigo-600 dark:text-indigo-400 leading-none mb-2">%{score}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Başarı</span>
                        </div>
                        <div className="p-6 bg-emerald-50 dark:bg-emerald-900/10 rounded-3xl border border-emerald-100 dark:border-emerald-900/20">
                            <span className="block text-3xl font-black text-emerald-600 leading-none mb-2">{correctCount}</span>
                            <span className="text-[10px] font-bold text-emerald-600/60 uppercase tracking-widest">Doğru</span>
                        </div>
                        <div className="p-6 bg-rose-50 dark:bg-rose-900/10 rounded-3xl border border-rose-100 dark:border-rose-900/20">
                            <span className="block text-3xl font-black text-rose-600 leading-none mb-2">{wrongCount}</span>
                            <span className="text-[10px] font-bold text-rose-600/60 uppercase tracking-widest">Yanlış</span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                            onClick={() => window.location.reload()}
                            variant="outline"
                            className="flex-1 h-14 rounded-2xl font-bold gap-2 text-base"
                        >
                            <RotateCcw size={20} />
                            Tekrar Dene
                        </Button>
                        <Link href="/dashboard" className="flex-1">
                            <Button className="w-full h-14 rounded-2xl font-bold bg-indigo-600 hover:bg-indigo-700 gap-2 text-base shadow-lg shadow-indigo-600/20">
                                <Home size={20} />
                                Panoya Dön
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
            <div className="mb-8 space-y-4">
                <div className="flex items-center justify-between">
                    <Link href="/dashboard" className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors flex items-center gap-1 text-sm font-medium">
                        <ChevronLeft size={16} />
                        Sınavdan Çık
                    </Link>
                    <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full">
                        Soru {currentIndex + 1} / {quiz.content.length}
                    </span>
                </div>
                <Progress value={progress} className="h-2.5 rounded-full" />
            </div>

            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 sm:p-10 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 leading-relaxed mb-10">
                        {currentQuestion.question}
                    </h2>

                    <div className="space-y-4">
                        {currentQuestion.options.map((option, index) => {
                            const isSelected = selectedOption === index;
                            const isCorrect = isAnswered && index === currentQuestion.correctAnswer;
                            const isWrong = isAnswered && isSelected && index !== currentQuestion.correctAnswer;

                            return (
                                <button
                                    key={index}
                                    disabled={isAnswered}
                                    onClick={() => handleAnswer(index)}
                                    className={cn(
                                        "w-full p-5 rounded-2xl border-2 text-left transition-all flex items-center justify-between group",
                                        !isAnswered && !isSelected && "border-slate-100 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800 bg-slate-50/50 dark:bg-slate-800/30",
                                        !isAnswered && isSelected && "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/10",
                                        isAnswered && isCorrect && "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-900 dark:text-emerald-100",
                                        isAnswered && isWrong && "border-rose-500 bg-rose-50 dark:bg-rose-900/20 text-rose-900 dark:text-rose-100",
                                        isAnswered && !isSelected && !isCorrect && "border-slate-100 dark:border-slate-800 opacity-40"
                                    )}
                                >
                                    <span className="font-semibold text-base flex-1 pr-4">{option}</span>
                                    {isAnswered && isCorrect && <CheckCircle2 className="text-emerald-500 shrink-0" size={24} />}
                                    {isAnswered && isWrong && <XCircle className="text-rose-500 shrink-0" size={24} />}
                                    {!isAnswered && (
                                        <div className={cn(
                                            "w-6 h-6 rounded-full border-2 shrink-0 transition-colors",
                                            isSelected ? "border-indigo-600 bg-indigo-600" : "border-slate-300 dark:border-slate-600 group-hover:border-indigo-400"
                                        )}>
                                            {isSelected && <div className="w-2 h-2 bg-white rounded-full m-auto mt-1.5" />}
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {isAnswered && currentQuestion.explanation && (
                        <div className="mt-10 p-6 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-3xl animate-in fade-in slide-in-from-top-4 duration-300">
                            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold mb-2">
                                <Info size={18} />
                                <span>Açıklama</span>
                            </div>
                            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed leading-relaxed font-medium">
                                {currentQuestion.explanation}
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex justify-end">
                    <Button
                        disabled={!isAnswered}
                        onClick={handleNext}
                        className="h-14 px-10 rounded-2xl font-bold bg-indigo-600 hover:bg-indigo-700 text-lg shadow-lg shadow-indigo-600/20 transition-all gap-2"
                    >
                        {currentIndex === quiz.content.length - 1 ? "Sınavı Bitir" : "Sıradaki Soru"}
                        <ChevronRight size={20} />
                    </Button>
                </div>
            </div>
        </div>
    );
}
