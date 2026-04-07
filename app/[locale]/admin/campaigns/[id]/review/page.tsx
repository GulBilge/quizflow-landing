"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCampaignRealtime } from "@/hooks/useCampaignRealtime";
import { 
    Layout, 
    Type, 
    Twitter, 
    Linkedin, 
    Mail, 
    ChevronLeft, 
    Save, 
    Eye, 
    Edit3,
    Sparkles,
    CheckCircle2,
    Info,
    Calendar,
    Globe
} from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { CampaignStatusBadge } from "@/components/admin/CampaignStatusBadge";
import { SocialPostPreview } from "@/components/admin/SocialPostPreview";
import { ReviewActionBar } from "@/components/admin/ReviewActionBar";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { cn } from "@/utils/cn";

export default function CampaignReviewPage() {
    const params = useParams();
    const router = useRouter();
    const campaignId = params.id as string;
    const { campaign, socialPosts, blogPost, isLoading, error } = useCampaignRealtime(campaignId);

    const [activeTab, setActiveTab] = useState<'blog' | 'twitter' | 'linkedin' | 'newsletter'>('blog');
    const [blogDraft, setBlogDraft] = useState({
        content: "",
        meta_title: "",
        meta_description: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editMode, setEditMode] = useState(true);

    useEffect(() => {
        if (blogPost) {
            setBlogDraft({
                content: blogPost.content_markdown || "",
                meta_title: blogPost.meta_title || "",
                meta_description: blogPost.meta_description || ""
            });
        }
    }, [blogPost]);

    const handleApprove = async (options: { platforms: string[], notes: string }) => {
        setIsSubmitting(true);
        try {
            // Simulate API call to approveCampaign action
            const response = await fetch(`/api/admin/campaigns/${campaignId}/review`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'approve',
                    platforms: options.platforms,
                    notes: options.notes,
                    updated_blog: blogDraft
                })
            });

            if (!response.ok) throw new Error("Onaylama başarısız oldu.");

            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#4f46e5', '#10b981', '#f59e0b']
            });

            toast.success("Kampanya onaylandı! Dağıtım pipeline'ı başlatıldı.");
            
            // Redirect after a short delay
            setTimeout(() => {
                router.push(`/${params.locale}/admin/campaigns`);
            }, 3000);
        } catch (err: any) {
            toast.error(err.message || "Bir hata oluştu.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReject = async (reason: string) => {
        if (!reason) {
            toast.error("Reddetme nedeni girmelisiniz.");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch(`/api/admin/campaigns/${campaignId}/review`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'reject',
                    reason
                })
            });

            if (!response.ok) throw new Error("İşlem gagal.");

            toast.info("Kampanya reddedildi.");
            router.push(`/${params.locale}/admin/campaigns`);
        } catch (err: any) {
            toast.error(err.message || "Bir hata oluştu.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-500 font-medium">İçerik yükleniyor...</p>
            </div>
        );
    }

    if (error || !campaign) {
        return (
            <div className="p-10 text-center">
                <p className="text-rose-500 font-bold text-xl">Bir hata oluştu!</p>
                <p className="text-slate-500 mt-2">{error || "Kampanya bulunamadı."}</p>
                <Link href={`/${params.locale}/admin/campaigns`}>
                    <Button className="mt-4">Geri Dön</Button>
                </Link>
            </div>
        );
    }

    const currentSocialPost = socialPosts.find(p => {
        if (activeTab === 'twitter') return p.platform === 'twitter_x';
        if (activeTab === 'linkedin') return p.platform === 'linkedin';
        if (activeTab === 'newsletter') return p.platform === 'newsletter';
        return false;
    });

    return (
        <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
            {/* Review Header */}
            <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between flex-shrink-0 z-20">
                <div className="flex items-center gap-6">
                    <Link href={`/${params.locale}/admin/campaigns`}>
                        <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-600">
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-bold text-slate-900 tracking-tight">{campaign.title}</h2>
                            <CampaignStatusBadge status={campaign.status} />
                        </div>
                        <div className="flex items-center gap-4 mt-1">
                            <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                                <Calendar className="w-3 h-3" />
                                {format(new Date(campaign.created_at), "d MMMM yyyy", { locale: tr })}
                            </span>
                            <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                                <Globe className="w-3 h-3" />
                                {campaign.target_keyword}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="hidden lg:flex items-center bg-slate-100 p-1 rounded-xl mr-4">
                        <button 
                            onClick={() => setEditMode(true)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                                editMode ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                            )}
                        >
                            <Edit3 className="w-3.5 h-3.5" /> Düzenle
                        </button>
                        <button 
                            onClick={() => setEditMode(false)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                                !editMode ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                            )}
                        >
                            <Eye className="w-3.5 h-3.5" /> Önizleme
                        </button>
                    </div>
                    <Button variant="outline" className="h-10 rounded-xl gap-2 text-slate-600 border-slate-200">
                        <Save className="w-4 h-4" /> Taslağı Kaydet
                    </Button>
                </div>
            </header>

            {/* Split View Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Scrollable Main Area */}
                <div className="flex-1 overflow-y-auto bg-slate-50 p-8">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 h-full">
                        
                        {/* LEFT: Editor Panel */}
                        <div className="flex-1 flex flex-col gap-6 min-w-0">
                            {/* Tabs Navigation */}
                            <div className="flex items-center gap-1 bg-white p-1.5 rounded-2xl border border-slate-200/60 shadow-sm overflow-x-auto no-scrollbar">
                                {[
                                    { id: 'blog', icon: Layout, label: 'Blog Yazısı' },
                                    { id: 'twitter', icon: Twitter, label: 'Twitter/X' },
                                    { id: 'linkedin', icon: Linkedin, label: 'LinkedIn' },
                                    { id: 'newsletter', icon: Mail, label: 'Newsletter' },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as any)}
                                        className={cn(
                                            "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap",
                                            activeTab === tab.id 
                                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" 
                                                : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                                        )}
                                    >
                                        <tab.icon className="w-4 h-4" />
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* Inner Editor Card */}
                            <div className="flex-1 bg-white rounded-[2rem] border border-slate-200/60 shadow-sm flex flex-col min-h-[600px]">
                                {activeTab === 'blog' ? (
                                    <div className="p-10 space-y-8 h-full flex flex-col">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Meta Başlık</label>
                                                <div className="relative">
                                                    <input 
                                                        type="text" 
                                                        value={blogDraft.meta_title}
                                                        onChange={(e) => setBlogDraft(prev => ({ ...prev, meta_title: e.target.value }))}
                                                        className="w-full h-11 px-4 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium" 
                                                    />
                                                    <span className={cn(
                                                        "absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold px-1.5 py-0.5 rounded",
                                                        blogDraft.meta_title.length > 50 && blogDraft.meta_title.length < 60 ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"
                                                    )}>
                                                        {blogDraft.meta_title.length}/60
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Meta Açıklama</label>
                                                <div className="relative">
                                                    <input 
                                                        type="text" 
                                                        value={blogDraft.meta_description}
                                                        onChange={(e) => setBlogDraft(prev => ({ ...prev, meta_description: e.target.value }))}
                                                        className="w-full h-11 px-4 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium" 
                                                    />
                                                    <span className={cn(
                                                        "absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold px-1.5 py-0.5 rounded",
                                                        blogDraft.meta_description.length > 120 && blogDraft.meta_description.length < 160 ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"
                                                    )}>
                                                        {blogDraft.meta_description.length}/160
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex-1 space-y-2 flex flex-col">
                                            <div className="flex items-center justify-between pl-1">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Blog İçeriği (Markdown)</label>
                                                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-tighter bg-indigo-50 px-2 py-0.5 rounded italic">AI tarafından üretildi</span>
                                            </div>
                                            <textarea 
                                                value={blogDraft.content}
                                                onChange={(e) => setBlogDraft(prev => ({ ...prev, content: e.target.value }))}
                                                className="flex-1 w-full bg-slate-50/50 border border-slate-100 rounded-[1.5rem] p-8 text-slate-700 leading-relaxed font-mono focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all resize-none shadow-inner"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-10 space-y-8 h-full flex flex-col">
                                        <div className="flex items-center justify-between mb-2">
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900 capitalize">{activeTab} İçeriği</h3>
                                                <p className="text-sm text-slate-400">Platform'a özel olarak optimize edilmiş JSON verisi.</p>
                                            </div>
                                            <Button variant="ghost" size="sm" className="text-indigo-600 hover:bg-indigo-50 font-bold gap-2">
                                                <Sparkles className="w-4 h-4" /> AI ile Yeniden Yaz
                                            </Button>
                                        </div>
                                        
                                        <div className="flex-1 bg-slate-900 rounded-[1.5rem] p-8 border-4 border-slate-800 shadow-2xl overflow-hidden relative">
                                            <div className="absolute top-4 right-6 flex items-center gap-1.5 text-slate-500 font-mono text-[10px] uppercase tracking-widest">
                                                <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                                                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                                                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                            </div>
                                            <pre className="text-indigo-400 text-xs font-mono h-full overflow-y-auto custom-scrollbar">
                                                {JSON.stringify(currentSocialPost?.content, null, 2)}
                                            </pre>
                                        </div>
                                        
                                        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-3 text-amber-700">
                                            <Info className="w-5 h-5 flex-shrink-0" />
                                            <p className="text-xs leading-relaxed">
                                                Sosyal medya içerikleri yapılandırılmış veri (JSON) olarak saklanır. Dağıtım sırasında ilgili platformun API'sine bu formatta gönderilecektir.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* RIGHT: Preview Panel */}
                        <div className="w-full md:w-[450px] lg:w-[500px] flex flex-col gap-6 flex-shrink-0">
                            <div className="bg-white rounded-[2rem] border border-slate-200/60 shadow-sm flex flex-col h-full overflow-hidden">
                                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/30">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                        <span className="font-bold text-slate-900 tracking-tight">Canlı Önizleme</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 border border-slate-200 px-2 py-0.5 rounded-full uppercase tracking-tighter">Responsive</span>
                                </div>
                                
                                <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50 custom-scrollbar relative">
                                    <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-slate-50/50 to-transparent z-10"></div>
                                    
                                    {activeTab === 'blog' ? (
                                        <article className="prose prose-sm prose-slate prose-indigo max-w-none bg-white p-8 rounded-2xl border border-slate-200 shadow-sm min-h-[500px]">
                                            <ReactMarkdown>{blogDraft.content}</ReactMarkdown>
                                        </article>
                                    ) : (
                                        <div className="flex justify-center">
                                            <SocialPostPreview 
                                                platform={activeTab === 'twitter' ? 'twitter_x' : activeTab === 'linkedin' ? 'linkedin' : 'newsletter'} 
                                                content={currentSocialPost?.content} 
                                            />
                                        </div>
                                    )}
                                    <div className="h-20 shrink-0"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Fixed Action Bar at the bottom */}
                <div className="absolute bottom-0 inset-x-0 z-30">
                    <ReviewActionBar 
                        campaignId={campaignId} 
                        currentStatus={campaign.status} 
                        isSubmitting={isSubmitting}
                        onApprove={handleApprove}
                        onReject={handleReject}
                    />
                </div>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #cbd5e1;
                }
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}
