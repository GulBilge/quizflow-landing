"use client";

import React, { useState } from "react";
import { Search, Crown, Sun, Moon, Globe, User } from "lucide-react";

interface HeaderProps {
    user: any;
}

export default function Header({ user }: HeaderProps) {
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    const toggleTheme = () => {
        // Implementation for theme switching will go here
        console.log("Toggle theme");
    };

    return (
        <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
            <div className="flex h-16 items-center justify-between px-4 md:px-8">
                {/* Left Side: Welcome Text (Visible on desktop) */}
                <div className="hidden lg:block">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                        Hoş geldin, {user?.user_metadata?.full_name?.split(' ')[0] || 'Öğrenci'} 👋
                    </h2>
                </div>

                {/* Right Side: Search & Actions */}
                <div className="flex flex-1 items-center justify-end gap-3 md:gap-4 lg:gap-6">
                    {/* Search Bar */}
                    <div className={`relative flex items-center transition-all duration-300 ${isSearchFocused ? 'w-full max-w-sm' : 'w-10 sm:w-48 md:w-64'}`}>
                        <div className="absolute left-3 text-slate-400">
                            <Search size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="Sınav ara..."
                            className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setIsSearchFocused(false)}
                        />
                    </div>

                    <div className="flex items-center gap-1 sm:gap-2">
                        {/* Premium Button */}
                        <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold shadow-sm hover:shadow-md transition-all hover:scale-105 active:scale-95">
                            <Crown size={14} fill="white" />
                            Premium
                        </button>

                        {/* Language Selector */}
                        <button className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" title="Dil Seçimi">
                            <Globe size={20} />
                        </button>

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Tema Değiştir"
                        >
                            <Sun size={20} className="hidden dark:block" />
                            <Moon size={20} className="block dark:hidden" />
                        </button>

                        {/* User Profile */}
                        <div className="ml-2 w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm cursor-pointer border-2 border-transparent hover:border-indigo-500 transition-all">
                            {user?.user_metadata?.full_name?.[0] || <User size={16} />}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
