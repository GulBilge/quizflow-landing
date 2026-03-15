"use client";

import React from "react";
import { X, Crown, Smartphone, Sparkles, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

interface PremiumWebFeatureModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function PremiumWebFeatureModal({ isOpen, onClose }: PremiumWebFeatureModalProps) {
    const t = useTranslations("Common");

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div 
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" 
                onClick={onClose}
            ></div>

            <div className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-200 dark:border-slate-800">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -ml-16 -mb-16"></div>

                <div className="p-8 relative z-10">
                    <div className="flex justify-end mb-2">
                        <button 
                            onClick={onClose} 
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors active:scale-90"
                        >
                            <X className="text-slate-400" size={20} />
                        </button>
                    </div>

                    <div className="text-center space-y-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-3xl flex items-center justify-center text-white mx-auto shadow-xl shadow-indigo-500/20 transform rotate-3">
                            <Crown size={40} />
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                                {t("premium_web_feature_title")}
                            </h3>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest">
                                <Sparkles size={12} />
                                <span>Premium Only</span>
                            </div>
                        </div>

                        <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                            {t("premium_web_feature_desc")}
                        </p>

                        <div className="pt-4 space-y-3">
                            <Link
                                href="/mobile"
                                className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-indigo-600 dark:bg-indigo-500 text-white rounded-2xl font-bold text-base shadow-lg shadow-indigo-600/25 hover:bg-indigo-700 dark:hover:bg-indigo-400 transition-all hover:scale-[1.02] active:scale-[0.98] group"
                            >
                                <Smartphone size={20} />
                                <span>{t("premium_web_feature_btn")}</span>
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <button
                                onClick={onClose}
                                className="w-full py-4 text-slate-400 dark:text-slate-500 font-bold hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                            >
                                {t("vazgec")}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
