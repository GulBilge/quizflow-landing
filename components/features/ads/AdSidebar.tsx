"use client";

import React from "react";
import { Crown, Sparkles, Megaphone } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import GoogleAd from "./GoogleAd";

interface AdSidebarProps {
    isPremium?: boolean;
}

export default function AdSidebar({ isPremium = false }: AdSidebarProps) {
    const t = useTranslations("Ads");

    if (isPremium) {
        return (
            <div className="w-full bg-gradient-to-br from-indigo-500/5 to-violet-500/5 dark:from-indigo-500/10 dark:to-violet-500/10 rounded-[2.5rem] p-5 sm:p-8 border border-indigo-100/50 dark:border-indigo-900/30 flex flex-col items-center text-center justify-center min-h-[420px] relative overflow-hidden group transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl" />
                <div className="relative z-10 space-y-4">
                    <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl shadow-lg flex items-center justify-center mx-auto border border-slate-50 dark:border-slate-700">
                        <Sparkles className="text-indigo-500" size={32} />
                    </div>
                    <h4 className="text-lg font-bold text-slate-800 dark:text-white">{t("premium_status")}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                        {t("premium_desc")}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-widest">
                <Megaphone size={14} />
                <span>{t("sponsored")}</span>
            </div>

            {/* Ad Container */}
            <div className="w-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center justify-center min-h-[420px] relative overflow-hidden group transition-all duration-500 hover:shadow-xl p-5 sm:p-8">

                {/* Ad Content - Placeholder for Google AdSense or House Ad */}
                <div className="relative z-10 w-full p-4">
                    {/* House Ad: Premium Upgrade */}
                    <div className="space-y-6">
                        <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-3xl shadow-xl flex items-center justify-center mx-auto transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 border border-slate-50 dark:border-slate-700">
                            <Crown className="text-amber-400" size={40} fill="currentColor" />
                        </div>

                        <div className="space-y-2">
                            <h4 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">{t("upgrade_title")}</h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed px-4">
                                {t("upgrade_desc")}
                            </p>
                        </div>

                        <Link href="/checkout" className="block w-full px-4">
                            <button className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 sm:px-8 py-4 rounded-2xl font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-2 group-hover:bg-indigo-600 group-hover:text-white dark:group-hover:bg-indigo-600 transition-colors shrink-0">
                                <Crown size={18} />
                                <span>{t("upgrade_btn")}</span>
                            </button>
                        </Link>
                    </div>

                    {/* Future AdSense Integration Point */}
                    <div className="mt-8 pt-6 border-t border-slate-200/50 dark:border-slate-700/50 w-full">
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 font-bold px-2">
                            {t("sponsored")}
                        </div>
                        <GoogleAd
                            slot="5202700378"
                            format="rectangle"
                            responsive="true"
                            className="w-full min-h-[250px] mx-auto bg-slate-100/50 dark:bg-slate-800/50 rounded-2xl"
                        />
                    </div>
                </div>

                {/* Animated background elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-all duration-700" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-violet-500/5 rounded-full blur-2xl group-hover:bg-violet-500/10 transition-all duration-700" />

                {/* Glossy overlay effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-gradient-to-tr from-white/10 to-transparent" />
            </div>
        </div>
    );
}
