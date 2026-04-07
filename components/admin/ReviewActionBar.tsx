"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { 
    CheckCircle, 
    XCircle, 
    Info, 
    Loader2, 
    Sparkles,
    Twitter,
    Linkedin,
    Mail,
    Globe
} from "lucide-react";
import { cn } from "@/utils/cn";

interface ReviewActionBarProps {
    campaignId: string;
    currentStatus: string;
    isSubmitting: boolean;
    onApprove: (options: { platforms: string[], notes: string }) => void;
    onReject: (reason: string) => void;
}

export function ReviewActionBar({ 
    campaignId, 
    currentStatus, 
    isSubmitting,
    onApprove, 
    onReject 
}: ReviewActionBarProps) {
    const [notes, setNotes] = React.useState("");
    const [selectedPlatforms, setSelectedPlatforms] = React.useState<string[]>(['blog', 'twitter', 'linkedin', 'newsletter']);

    const togglePlatform = (id: string) => {
        setSelectedPlatforms(prev => 
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    const isPending = currentStatus === 'pending_review';

    if (!isPending && !isSubmitting) {
        return (
            <div className="bg-white border-t border-slate-200 p-6 flex items-center justify-between shadow-2xl">
                <div className="flex items-center gap-3 text-slate-500">
                    <Info className="w-5 h-5 text-indigo-500" />
                    <p className="text-sm font-medium">Bu kampanya şu anda <b>{currentStatus}</b> durumunda. İnceleme aşaması tamamlanmış.</p>
                </div>
                <Button variant="outline" disabled className="rounded-xl px-6">Düzenleme Devre Dışı</Button>
            </div>
        );
    }

    return (
        <div className="bg-white border-t border-slate-200 p-6 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] backdrop-blur-md bg-white/90">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-end md:items-center justify-between gap-6">
                {/* Platform Selection */}
                <div className="space-y-3">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Yayın Kanalları</p>
                    <div className="flex flex-wrap gap-2">
                        {[
                            { id: 'blog', icon: Globe, label: 'Blog', color: 'text-indigo-600', bg: 'bg-indigo-50' },
                            { id: 'twitter', icon: Twitter, label: 'Twitter', color: 'text-sky-500', bg: 'bg-sky-50' },
                            { id: 'linkedin', icon: Linkedin, label: 'LinkedIn', color: 'text-blue-700', bg: 'bg-blue-50' },
                            { id: 'newsletter', icon: Mail, label: 'Newsletter', color: 'text-amber-600', bg: 'bg-amber-50' },
                        ].map((p) => (
                            <button
                                key={p.id}
                                onClick={() => togglePlatform(p.id)}
                                className={cn(
                                    "flex items-center gap-2 px-3 py-2 rounded-xl border transition-all active:scale-95",
                                    selectedPlatforms.includes(p.id) 
                                        ? `border-transparent ${p.bg} ${p.color} ring-2 ring-indigo-500/20`
                                        : "border-slate-200 bg-white text-slate-400 grayscale hover:grayscale-0"
                                )}
                            >
                                <p.icon className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-tight">{p.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Notes Input */}
                <div className="flex-1 max-w-xl w-full">
                    <div className="relative group">
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="İçerik hakkında notlar veya revize isteği ekleyin..."
                            className="w-full h-12 py-3 px-4 bg-slate-50 border-slate-100 rounded-2xl text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all resize-none placeholder:text-slate-400 group-hover:bg-slate-100/50"
                        />
                        <div className="absolute right-3 top-3">
                            <Sparkles className="w-4 h-4 text-indigo-300" />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    <Button 
                        variant="ghost" 
                        onClick={() => onReject(notes)}
                        className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 px-6 h-12 rounded-2xl group transition-all"
                    >
                        <XCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                        Reddet
                    </Button>
                    <Button 
                        onClick={() => onApprove({ platforms: selectedPlatforms, notes })}
                        disabled={isSubmitting || selectedPlatforms.length === 0}
                        className="bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200 px-8 h-12 rounded-2xl transition-all active:scale-95 group min-w-[180px]"
                    >
                        {isSubmitting ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <CheckCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                                Onayla & Yayınla
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
