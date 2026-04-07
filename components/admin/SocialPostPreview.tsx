import React from "react";
import { cn } from "@/utils/cn";
import { 
    Twitter, 
    Linkedin, 
    Mail, 
    MoreHorizontal, 
    Heart, 
    MessageCircle, 
    Share2, 
    Repeat2,
    CheckCircle2,
    Send
} from "lucide-react";

interface SocialPostPreviewProps {
    platform: 'twitter_x' | 'linkedin' | 'newsletter' | string;
    content: any;
    className?: string;
}

export function SocialPostPreview({ platform, content, className }: SocialPostPreviewProps) {
    if (!content) return <div className="p-10 text-center text-slate-400 italic">Preveiw içeriği yok.</div>;

    switch (platform) {
        case 'twitter_x':
            return <TwitterPreview content={content} className={className} />;
        case 'linkedin':
            return <LinkedinPreview content={content} className={className} />;
        case 'newsletter':
            return <NewsletterPreview content={content} className={className} />;
        default:
            return (
                <div className="p-10 border rounded-xl bg-slate-50 text-slate-500">
                    Bilinmeyen platform: {platform}
                </div>
            );
    }
}

function TwitterPreview({ content, className }: { content: any; className?: string }) {
    const thread = content.thread || [];
    const tweets = Array.isArray(thread) ? thread : [content.post || ""];

    return (
        <div className={cn("space-y-4", className)}>
            {tweets.map((tweet: string, i: number) => (
                <div key={i} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm max-w-[500px]">
                    <div className="flex gap-3">
                        <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-xl">Q</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1">
                                <span className="font-bold text-slate-900 truncate">Quizyen</span>
                                <CheckCircle2 className="w-4 h-4 text-blue-500 fill-current" />
                                <span className="text-slate-500 text-sm">@quizyen_ai · 1dk</span>
                            </div>
                            <p className="mt-1 text-slate-900 leading-normal whitespace-pre-wrap">{tweet}</p>
                            <div className="mt-3 flex items-center justify-between text-slate-500 max-w-sm">
                                <div className="flex items-center gap-2 hover:text-blue-500 cursor-pointer transition-colors">
                                    <MessageCircle className="w-4 h-4" />
                                    <span className="text-xs">12</span>
                                </div>
                                <div className="flex items-center gap-2 hover:text-green-500 cursor-pointer transition-colors">
                                    <Repeat2 className="w-4 h-4" />
                                    <span className="text-xs">4</span>
                                </div>
                                <div className="flex items-center gap-2 hover:text-rose-500 cursor-pointer transition-colors">
                                    <Heart className="w-4 h-4" />
                                    <span className="text-xs">24</span>
                                </div>
                                <div className="flex items-center gap-2 hover:text-blue-500 cursor-pointer transition-colors">
                                    <Share2 className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                        <MoreHorizontal className="w-5 h-5 text-slate-400" />
                    </div>
                </div>
            ))}
        </div>
    );
}

function LinkedinPreview({ content, className }: { content: any; className?: string }) {
    const post = content.post || content.body || "";
    
    return (
        <div className={cn("bg-white border border-slate-200 rounded-xl shadow-sm max-w-[550px] overflow-hidden", className)}>
            <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex gap-2">
                        <div className="w-12 h-12 rounded-sm bg-indigo-600 flex items-center justify-center">
                            <span className="text-white font-bold text-xl">Q</span>
                        </div>
                        <div>
                            <p className="font-bold text-sm text-slate-900">Quizyen AI</p>
                            <p className="text-xs text-slate-500">Eğitim & Teknoloji · Takipçi Sayısı: 5.402</p>
                            <p className="text-[10px] text-slate-400 flex items-center gap-1">1dk · <Linkedin className="w-2.5 h-2.5 fill-current" /></p>
                        </div>
                    </div>
                    <MoreHorizontal className="w-5 h-5 text-slate-400" />
                </div>
                <p className="text-sm text-slate-900 leading-relaxed whitespace-pre-wrap">{post}</p>
            </div>
            <div className="px-4 py-2 border-t border-slate-50 flex items-center justify-between text-slate-500 text-xs">
                <div className="flex items-center gap-1">
                    <div className="flex -space-x-1">
                        <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center ring-1 ring-white">
                            <Heart className="w-2.5 h-2.5 text-white fill-current" />
                        </div>
                        <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center ring-1 ring-white">
                            <Repeat2 className="w-2.5 h-2.5 text-white" />
                        </div>
                    </div>
                    <span>42</span>
                </div>
                <span>12 yorum · 5 paylaşım</span>
            </div>
            <div className="px-4 py-1 border-t border-slate-50 flex items-center justify-around">
                <button className="flex items-center gap-2 py-2 px-3 text-slate-500 font-medium text-sm hover:bg-slate-50 rounded-md transition-colors">
                    <Heart className="w-5 h-5" /> Beğen
                </button>
                <button className="flex items-center gap-2 py-2 px-3 text-slate-500 font-medium text-sm hover:bg-slate-50 rounded-md transition-colors">
                    <MessageCircle className="w-5 h-5" /> Yorum Yap
                </button>
                <button className="flex items-center gap-2 py-2 px-3 text-slate-500 font-medium text-sm hover:bg-slate-50 rounded-md transition-colors">
                    <Repeat2 className="w-5 h-5" /> Paylaş
                </button>
                <button className="flex items-center gap-2 py-2 px-3 text-slate-500 font-medium text-sm hover:bg-slate-50 rounded-md transition-colors">
                    <Send className="w-5 h-5" /> Gönder
                </button>
            </div>
        </div>
    );
}

function NewsletterPreview({ content, className }: { content: any; className?: string }) {
    return (
        <div className={cn("bg-white border border-slate-200 rounded-xl shadow-lg max-w-[650px] overflow-hidden", className)}>
            <div className="bg-slate-100 p-4 border-b border-slate-200">
                <div className="space-y-2">
                    <div className="flex gap-2 text-sm">
                        <span className="text-slate-400 w-16">Konu:</span>
                        <span className="font-bold text-slate-900">{content.subject || "Newsletter Başlığı"}</span>
                    </div>
                    <div className="flex gap-2 text-sm text-slate-500 border-t border-slate-200 pt-2">
                        <span className="w-16">Kimden:</span>
                        <span>Quizyen AI &lt;merhaba@quizyen.com&gt;</span>
                    </div>
                </div>
            </div>
            {content.preview_text && (
                <div className="px-6 py-2 bg-amber-50 text-[11px] text-amber-600 font-medium uppercase tracking-wider border-b border-amber-100">
                    Önizleme Metni: {content.preview_text}
                </div>
            )}
            <div className="p-8 prose prose-slate max-w-none">
                <div className="flex justify-center mb-8">
                    <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center">
                        <span className="text-white font-bold text-2xl">Q</span>
                    </div>
                </div>
                <div dangerouslySetInnerHTML={{ __html: content.body_html || content.body || "<p>İçerik yükleniyor...</p>" }} />
                <div className="mt-12 pt-8 border-t border-slate-100 text-center text-xs text-slate-400">
                    <p>© 2026 Quizyen AI. Tüm hakları saklıdır.</p>
                    <p className="mt-2 text-indigo-600 hover:underline cursor-pointer">Abonelikten çık</p>
                </div>
            </div>
        </div>
    );
}
