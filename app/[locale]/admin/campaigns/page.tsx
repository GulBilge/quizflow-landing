import { createClient } from "@/utils/supabase/server";
import { 
    Megaphone, 
    Search, 
    Plus, 
    Filter, 
    ArrowRight,
    TrendingUp,
    Clock,
    CheckCircle2,
    Calendar
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { CampaignStatusBadge } from "@/components/admin/CampaignStatusBadge";
import { cn } from "@/utils/cn";

export default async function CampaignsPage({
    params: { locale }
}: {
    params: { locale: string }
}) {
    const supabase = await createClient();

    const { data: campaigns, error } = await supabase
        .from("campaigns")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Campaign fetch error:", error);
    }

    const stats = {
        total: campaigns?.length || 0,
        pending: (campaigns as any[])?.filter(c => c.status === 'pending_review').length || 0,
        published: (campaigns as any[])?.filter(c => c.status === 'published').length || 0,
        publishing: (campaigns as any[])?.filter(c => c.status === 'publishing').length || 0,
    };

    return (
        <div className="p-6 md:p-10 space-y-8 bg-slate-50/50 min-h-full">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                        <Megaphone className="text-indigo-600 w-8 h-8" />
                        İçerik Kampanyaları
                    </h1>
                    <p className="text-slate-500 mt-1">Multi-agent AI sistemi tarafından üretilen kampanyaları yönetin ve onaylayın.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2 bg-white h-11 px-6 rounded-xl border-slate-200 shadow-sm transition-all hover:bg-slate-50">
                        <Filter className="w-4 h-4" /> Filtrele
                    </Button>
                    <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 h-11 px-6 rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-95">
                        <Plus className="w-4 h-4" /> Yeni Kampanya Başlat
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Toplam Kampanya", value: stats.total, icon: Megaphone, color: "text-indigo-600", bg: "bg-indigo-50" },
                    { label: "İnceleme Bekliyor", value: stats.pending, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
                    { label: "Yayınlananlar", value: stats.published, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
                    { label: "Ort. Performans", value: "8.4", icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50" },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm flex items-center justify-between group hover:border-indigo-200 transition-all duration-300">
                        <div>
                            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                            <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
                        </div>
                        <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl group-hover:scale-110 transition-transform`}>
                            <stat.icon className="w-7 h-7" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/20 overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white/50 backdrop-blur-sm">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Kampanya başlığı, anahtar kelime veya konu ara..." 
                            className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border-slate-200 focus:bg-white rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
                        />
                    </div>
                    <div className="flex items-center gap-4 text-xs font-medium text-slate-400 uppercase tracking-widest px-4">
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                            Canlı Güncelleme Aktif
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100">Kampanya Bilgisi</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 text-center">Durum</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100">AI Aşaması</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100">Hedef Verisi</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100">Oluşturma</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 text-right">Aksiyon</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {campaigns && campaigns.length > 0 ? (campaigns as any[]).map((campaign: any) => (
                                <tr key={campaign.id} className="hover:bg-indigo-50/30 transition-all duration-200 group">
                                    <td className="px-8 py-6">
                                        <div className="space-y-1 max-w-xs md:max-w-sm">
                                            <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 text-base">{campaign.title}</p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded leading-none uppercase tracking-tighter">Slug</span>
                                                <span className="text-xs font-medium text-slate-400 truncate tracking-tight">/{campaign.slug || 'gen-waiting...'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <CampaignStatusBadge status={campaign.status} />
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col gap-1.5">
                                            <span className="text-xs font-bold text-slate-600 capitalize flex items-center gap-1.5">
                                                <div className="w-1 h-1 rounded-full bg-slate-400"></div>
                                                {campaign.pipeline_stage?.replace('_', ' ')}
                                            </span>
                                            <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-indigo-600 transition-all duration-1000" 
                                                    style={{ 
                                                        width: campaign.pipeline_stage === 'completed' ? '100%' : 
                                                               campaign.pipeline_stage === 'social_media' ? '75%' :
                                                               campaign.pipeline_stage === 'writing' ? '50%' :
                                                               campaign.pipeline_stage === 'strategy' ? '25%' : '10%' 
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-900">{campaign.target_keyword}</span>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">SEO Anahtar Kelimesi</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <Calendar className="w-3.5 h-3.5" />
                                            <span className="text-xs font-medium">
                                                {format(new Date(campaign.created_at), "d MMM yyyy", { locale: tr })}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <Link href={`/${locale}/admin/campaigns/${campaign.id}/review`}>
                                            <Button size="sm" className={cn(
                                                "h-10 px-5 gap-2 rounded-xl transition-all font-bold shadow-md active:scale-95",
                                                campaign.status === 'pending_review' 
                                                    ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200" 
                                                    : "bg-slate-100 hover:bg-slate-200 text-slate-700 shadow-transparent"
                                            )}>
                                                {campaign.status === 'pending_review' ? "İncele" : "Detay"}
                                                <ArrowRight className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="px-8 py-32 text-center">
                                        <div className="flex flex-col items-center gap-4 max-w-sm mx-auto">
                                            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-300">
                                                <Megaphone className="w-10 h-10" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xl font-bold text-slate-900">Henüz kampanya yok</p>
                                                <p className="text-sm text-slate-500">n8n pipeline'ını tetikleyerek veya yeni butonuna tıklayarak ilk içeriği oluşturun.</p>
                                            </div>
                                            <Button variant="outline" className="mt-2 h-11 px-8 rounded-xl border-slate-200">İlk Kampanyayı Başlat</Button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination Placeholder */}
                <div className="px-8 py-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
                    <p>Toplam {stats.total} kampanya gösteriliyor</p>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" disabled size="sm" className="h-8 px-3 rounded-lg">Geri</Button>
                        <div className="flex items-center gap-1">
                            <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">1</span>
                        </div>
                        <Button variant="ghost" disabled size="sm" className="h-8 px-3 rounded-lg">İleri</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
