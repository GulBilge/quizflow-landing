"use client";

import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { cn } from "@/utils/cn";
import { Crown, Menu, Moon, Search, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import MobileSidebar from "./MobileSidebar";


interface HeaderProps {
    user: any;
}

export default function Header({ user }: HeaderProps) {
    const t = useTranslations('Header');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
    };

    return (
        <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
            <div className="flex h-16 items-center justify-between px-4 md:px-8">
                {/* Mobile Menu Button (Visible on mobile) */}
                <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="p-2.5 -ml-2 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 bg-slate-100/50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all active:scale-95 lg:hidden"
                    aria-label="Menu"
                >
                    <Menu size={22} strokeWidth={2.5} />
                </button>

                {/* Left Side: Welcome Text (Visible on desktop) */}
                <div className="hidden lg:block">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                        {t('welcome')}, {user?.user_metadata?.full_name?.split(' ')[0] || t('student')}
                    </h2>
                </div>

                {/* Right Side: Search & Actions */}
                <div className="flex flex-1 items-center justify-end gap-2 sm:gap-4">
                    {/* Search Bar */}
                    <div className={cn(
                        "relative flex items-center transition-all duration-300",
                        isSearchFocused ? "flex-1 max-w-xs sm:max-w-sm lg:max-w-md" : "w-10 lg:w-48 xl:w-64"
                    )}>
                        <div className="absolute left-3 text-slate-400 pointer-events-none">
                            <Search size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder={t('search_placeholder')}
                            className={cn(
                                "w-full bg-slate-100 dark:bg-slate-800/50 border-none rounded-2xl py-2 pl-10 pr-4 text-sm transition-all outline-none focus:ring-2 focus:ring-indigo-500",
                                !isSearchFocused && "cursor-pointer sm:cursor-text"
                            )}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setIsSearchFocused(false)}
                        />
                    </div>

                    <div className={cn("flex items-center gap-1 sm:gap-2 transition-opacity duration-300")}>
                        {/* Premium Button */}
                        <button className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all hover:scale-105 active:scale-95">
                            <Crown size={14} fill="white" />
                            Premium
                        </button>

                        <div className="flex items-center border-l border-slate-200 dark:border-slate-800 ml-2 pl-2 gap-1">
                            {/* Language Switcher */}
                            <LanguageSwitcher />

                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                title={t('toggle_theme')}
                            >
                                {mounted && (resolvedTheme === "dark" ? <Sun size={20} /> : <Moon size={20} />)}
                                {!mounted && <Sun size={20} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sidebar */}
            <MobileSidebar
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                user={user}
            />
        </header>
    );
}
