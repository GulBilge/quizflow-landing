"use client";

import React, { useState, useEffect } from "react";
import { X, ArrowRight, Loader2 } from "lucide-react";
import GoogleAd from "./GoogleAd";

interface AdInterstitialProps {
    isOpen: boolean;
    onClose: () => void;
    onProceed: () => void;
    title?: string;
    description?: string;
    autoProceedDelay?: number; // Delay in milliseconds
    adSlot: string;
}

export default function AdInterstitial({
    isOpen,
    onClose,
    onProceed,
    title = "Sıradaki Adıma Geçiliyor",
    description = "AI sürecine devam etmek için lütfen kısa bir süre bekleyin veya devam et butonuna tıklayın.",
    autoProceedDelay = 8000, // Default 8 seconds
    adSlot
}: AdInterstitialProps) {
    const [timeLeft, setTimeLeft] = useState(autoProceedDelay / 1000);
    const [canProceed, setCanProceed] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setCanProceed(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        // Also enable proceed button after a few seconds even if timer isn't up
        const minWait = setTimeout(() => {
            setCanProceed(true);
        }, 3000);

        return () => {
            clearInterval(timer);
            clearTimeout(minWait);
        };
    }, [isOpen, autoProceedDelay]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/90 backdrop-blur-md animate-in fade-in duration-300">
            <div className="absolute top-4 right-4 sm:top-8 sm:right-8">
                <button 
                    onClick={onClose}
                    className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all active:scale-90"
                >
                    <X size={24} />
                </button>
            </div>

            <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/10">
                <div className="p-6 sm:p-10 flex flex-col items-center text-center">
                    <div className="mb-6">
                        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                            {title}
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto text-sm sm:text-base">
                            {description}
                        </p>
                    </div>

                    {/* Ad Unit Container */}
                    <div className="w-full min-h-[250px] bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-center justify-center mb-8 border border-slate-100 dark:border-slate-700 relative overflow-hidden group">
                        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                            <span className="text-4xl font-black tracking-tighter uppercase">SPONSORED</span>
                        </div>
                        <div className="relative z-10 w-full py-4">
                            <GoogleAd 
                                slot={adSlot} 
                                format="rectangle" 
                                responsive="true" 
                                className="mx-auto max-w-full"
                            />
                        </div>
                    </div>

                    <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={onProceed}
                            className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl ${
                                canProceed 
                                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/20' 
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                            }`}
                        >
                            {canProceed ? (
                                <>
                                    <span>Devam Et</span>
                                    <ArrowRight size={20} />
                                </>
                            ) : (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Bekleyin ({timeLeft}s)</span>
                                </>
                            )}
                        </button>
                        
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-black">
                            SADECE BİRKAÇ SANİYE KALDI
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
