"use client";

import { useState } from "react";
import { 
    CheckCircle2, 
    ArrowLeft, 
    Eye, 
    Edit3, 
    Globe, 
    Twitter, 
    Linkedin, 
    Mail, 
    Save, 
    FileText,
    Target,
    Users,
    Zap,
    ChevronRight,
    Loader2
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { approveCampaign } from "../../actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // Assuming sonner is available based on modern shadcn setup, otherwise I'll fallback

interface ReviewContentProps {
    campaign: any;
    blogPost: any;
    socialPosts: any[];
}

export default function ReviewContent({ campaign, blogPost, socialPosts }: ReviewContentProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"blog" | "social">("blog");
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Form state
    const [blogContent, setBlogContent] = useState(blogPost?.content_markdown || "");
    const [metaTitle, setMetaTitle] = useState(blogPost?.meta_title || "");
    const [metaDescription, setMetaDescription] = useState(blogPost?.meta_description || "");
    const [reviewerNotes, setReviewerNotes] = useState("");

    const handleApprove = async () => {
        setIsSubmitting(true);
        try {
            const result = await approveCampaign(campaign.id, {
                reviewer_notes: reviewerNotes,
                updated_blog_content: blogContent,
                updated_meta_title: metaTitle,
                updated_meta_description: metaDescription
            });

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Kampanya onaylandı! Dağıtım süreci başlatıldı.");
                router.push("/admin/marketing");
                router.refresh();
            }
        } catch (err) {
            toast.error("Bir hata oluştu.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            {/* Top Navigation */}
            <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-slate-100 shrink-0 z-10">
                <div className="flex items-center gap-4">
                    <Link href="/admin/marketing">
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-900">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div className="h-4 w-px bg-slate-200" />
                    <div>
                        <h1 className="font-bold text-slate-900 line-clamp-1">{campaign.title}</h1>
                        <p className="text-xs text-slate-400">Kampanya İncelemesi • n8n {campaign.n8n_execution_id?.slice(0, 8)}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" className="gap-2">
                        <Save className="w-4 h-4" /> Taslak Kaydet
                    </Button>
                    <Button 
                        size="sm" 
                        onClick={handleApprove} 
                        disabled={isSubmitting}
                        className="bg-indigo-600 hover:bg-indigo-700 gap-2 shadow-sm shadow-indigo-100"
                    >
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                        Onayla ve Yayınla
                    </Button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Left Strategist Sidebar */}
                <aside className="w-80 bg-white border-r border-slate-100 overflow-y-auto hidden xl:block p-6 space-y-8 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                    <div>
                        <Label className="text-[10px] uppercase font-bold tracking-widest text-indigo-600 mb-4 block">Ajan Stratejisi</Label>
                        <div className="space-y-4">
                            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                                <p className="text-xs font-bold text-slate-400 flex items-center gap-1.5 uppercase"><Target className="w-3 h-3"/> Hedef Kitle</p>
                                <p className="text-sm font-medium text-slate-700">{campaign.target_audience || "Tanımlanmamış"}</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                                <p className="text-xs font-bold text-slate-400 flex items-center gap-1.5 uppercase"><Zap className="w-3 h-3"/> İçerik Açısı</p>
                                <p className="text-sm font-medium text-slate-700 italic">"{campaign.content_angle || "Tanımlanmamış"}"</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                                <p className="text-xs font-bold text-slate-400 flex items-center gap-1.5 uppercase"><ChevronRight className="w-3 h-3"/> Anahtar Kelime</p>
                                <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 border-indigo-100 hover:bg-indigo-50">{campaign.target_keyword}</Badge>
                            </div>
                        </div>
                    </div>

                    <div>
                        <Label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-4 block">SEO Detayları</Label>
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold text-slate-600">Meta Title</Label>
                                <Input 
                                    value={metaTitle} 
                                    onChange={(e) => setMetaTitle(e.target.value)}
                                    className="text-sm bg-slate-50/50 border-slate-100 focus:bg-white transition-all h-9"
                                />
                                <p className="text-[10px] text-slate-400 text-right">{metaTitle.length}/60</p>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold text-slate-600">Meta Description</Label>
                                <Textarea 
                                    value={metaDescription} 
                                    onChange={(e) => setMetaDescription(e.target.value)}
                                    className="text-sm bg-slate-50/50 border-slate-100 focus:bg-white transition-all min-h-[80px]"
                                />
                                <p className="text-[10px] text-slate-400 text-right">{metaDescription.length}/160</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <Label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-4 block">Editör Notları</Label>
                        <Textarea 
                            placeholder="Dağıtım ekibine veya ajana not bırakın..."
                            value={reviewerNotes}
                            onChange={(e) => setReviewerNotes(e.target.value)}
                            className="text-sm border-dashed min-h-[100px]"
                        />
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 flex flex-col bg-slate-50/30 overflow-hidden">
                    {/* Tabs */}
                    <div className="px-8 pt-4 flex items-center gap-6 border-b border-slate-100 bg-white/50 backdrop-blur-sm shrink-0">
                        <button 
                            onClick={() => setActiveTab("blog")}
                            className={`pb-3 text-sm font-bold transition-all border-b-2 flex items-center gap-2 ${activeTab === "blog" ? "text-indigo-600 border-indigo-600" : "text-slate-400 border-transparent hover:text-slate-600"}`}
                        >
                            <FileText className="w-4 h-4" /> Blog Yazısı
                        </button>
                        <button 
                            onClick={() => setActiveTab("social")}
                            className={`pb-3 text-sm font-bold transition-all border-b-2 flex items-center gap-2 ${activeTab === "social" ? "text-indigo-600 border-indigo-600" : "text-slate-400 border-transparent hover:text-slate-600"}`}
                        >
                            <Users className="w-4 h-4" /> Sosyal Medya
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-slate-200">
                        {activeTab === "blog" ? (
                            <div className="max-w-4xl mx-auto space-y-6">
                                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden min-h-[600px] flex flex-col">
                                    <div className="px-6 py-3 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Edit3 className="w-4 h-4 text-slate-400" />
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Markdown Editor</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Badge variant="outline" className="text-[10px] font-mono text-slate-400 font-normal">{blogContent.split(/\s+/).length} kelime</Badge>
                                        </div>
                                    </div>
                                    <textarea 
                                        value={blogContent}
                                        onChange={(e) => setBlogContent(e.target.value)}
                                        className="flex-1 p-8 font-mono text-sm resize-none focus:outline-none leading-relaxed text-slate-700 bg-transparent"
                                        placeholder="Markdown içeriği burada görünecek..."
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="max-w-3xl mx-auto space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {socialPosts.map((post, idx) => {
                                        const platformIcons = {
                                            'twitter_x': <Twitter className="w-5 h-5 text-[#1DA1F2]" />,
                                            'linkedin': <Linkedin className="w-5 h-5 text-[#0A66C2]" />,
                                            'newsletter': <Mail className="w-5 h-5 text-emerald-500" />,
                                            'instagram': <Globe className="w-5 h-5 text-pink-500" />
                                        };
                                        
                                        return (
                                            <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
                                                <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        {(platformIcons as any)[post.platform] || <Zap className="w-5 h-5 text-slate-400" />}
                                                        <span className="font-bold text-slate-800 text-sm capitalize">{post.platform?.replace('_', ' ')}</span>
                                                    </div>
                                                </div>
                                                <div className="p-5 flex-1 bg-slate-50/30">
                                                    <pre className="text-xs text-slate-600 whitespace-pre-wrap font-sans leading-relaxed">
                                                        {JSON.stringify(post.content, null, 2)}
                                                    </pre>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    
                                    {socialPosts.length === 0 && (
                                        <div className="col-span-full p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200">
                                            <p className="text-slate-400 text-sm italic">Bu kampanya için henüz sosyal medya içeriği üretilmemiş.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
