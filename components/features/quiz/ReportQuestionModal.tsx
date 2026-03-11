"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Flag, CheckCircle2, AlertCircle, Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { createClient } from "@/utils/supabase/client";

interface ReportQuestionModalProps {
    isOpen: boolean;
    onClose: () => void;
    quizId: string;
    userId: string;
    questionIndex: number;
}

const REASONS = ["wrong_answer", "typo", "irrelevant", "other"];

export default function ReportQuestionModal({
    isOpen,
    onClose,
    quizId,
    userId,
    questionIndex
}: ReportQuestionModalProps) {
    const t = useTranslations("Report");
    const ct = useTranslations("Common");
    const [selectedReason, setSelectedReason] = useState<string | null>(null);
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedReason || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const { error } = await supabase
                .from("question_reports" as any)
                .insert({
                    user_id: userId,
                    quiz_id: quizId,
                    question_index: questionIndex,
                    issue_type: selectedReason,
                    description: description,
                    status: "pending"
                } as any);

            if (error) throw error;
            
            setIsSuccess(true);
            setTimeout(() => {
                onClose();
                // Reset state after closing
                setTimeout(() => {
                    setIsSuccess(false);
                    setSelectedReason(null);
                    setDescription("");
                }, 300);
            }, 2000);
        } catch (error) {
            console.error("Error reporting question:", error);
            alert(ct("error"));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800"
                    >
                        {isSuccess ? (
                            <div className="p-12 text-center space-y-4">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto"
                                >
                                    <CheckCircle2 size={40} className="text-emerald-600 dark:text-emerald-400" />
                                </motion.div>
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                                    {t("success_msg")}
                                </h2>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-rose-50 dark:bg-rose-900/20 rounded-xl">
                                            <Flag size={20} className="text-rose-600 dark:text-rose-400" />
                                        </div>
                                        <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                            {t("modal_title")}
                                        </h2>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                                    >
                                        <X size={20} className="text-slate-400" />
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    {REASONS.map((reason) => (
                                        <button
                                            key={reason}
                                            type="button"
                                            onClick={() => setSelectedReason(reason)}
                                            className={cn(
                                                "w-full p-4 rounded-2xl border-2 text-left font-bold transition-all flex items-center justify-between group",
                                                selectedReason === reason
                                                    ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/10 text-indigo-900 dark:text-indigo-100"
                                                    : "border-slate-50 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400"
                                            )}
                                        >
                                            {t(`reason_${reason}`)}
                                            <div className={cn(
                                                "w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center",
                                                selectedReason === reason
                                                    ? "border-indigo-600 bg-indigo-600"
                                                    : "border-slate-300 dark:border-slate-600"
                                            )}>
                                                {selectedReason === reason && <div className="w-2 h-2 bg-white rounded-full shadow-sm" />}
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                <div className="space-y-2">
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder={t("description_placeholder")}
                                        className="w-full min-h-[100px] p-4 bg-slate-50/50 dark:bg-slate-800/50 border-2 border-slate-50 dark:border-slate-800 rounded-2xl focus:outline-none focus:border-indigo-600 transition-all font-medium text-slate-900 dark:text-slate-100 resize-none"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={!selectedReason || isSubmitting}
                                    className="w-full h-14 rounded-2xl font-black bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 gap-3 active:scale-[0.98] transition-all"
                                >
                                    {isSubmitting ? ct("loading") : (
                                        <>
                                            <Send size={18} />
                                            {t("submit")}
                                        </>
                                    )}
                                </Button>
                            </form>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
