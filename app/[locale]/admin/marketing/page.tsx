import { createClient } from "@/utils/supabase/server";
import { 
    Megaphone, 
    Search, 
    Plus, 
    Filter, 
    MoreHorizontal, 
    Clock, 
    CheckCircle2, 
    AlertCircle, 
    TrendingUp,
    Eye,
    Edit3,
    ArrowRight
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Button } from "@/components/ui/button";

export default async function MarketingDashboard() {
    const supabase = await createClient();

    // CRM-style campaign listing
    const { data: campaigns, error } = await supabase
        .from("campaigns")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Campaign fetch error:", error);
    }

    const stats = {
        total: campaigns?.length || 0,
        pending: campaigns?.filter(c => c.status === 'pending_review').length || 0,
        published: campaigns?.filter(c => c.status === 'published').length || 0,
        draft: campaigns?.filter(c => c.status === 'draft').length || 0,
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'published':
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700"><CheckCircle2 className="w-3 h-3" /> Yayınlandı</span>;
            case 'pending_review':
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700"><Clock className="w-3 h-3" /> İnceleme Bekliyor</span>;
            case 'draft':
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">Taslak</span>;
            case 'rejected':
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-700">Reddedildi</span>;
            default:
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">{status}</span>;
        }
    };

    return (
        <div className="p-6 md:p-10 space-y-8 bg-gray-50/50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                        <Megaphone className="text-indigo-600 w-8 h-8" />
                        Pazarlama Kampanyaları
                    </h1>
                    <p className="text-slate-500 mt-1">Multi-agent AI sistemi tarafından üretilen içerikleri yönetin.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2">
                        <Filter className="w-4 h-4" /> Filtrele
                    </Button>
                    <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700">
                        <Plus className="w-4 h-4" /> Yeni Kampanya
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: "Toplam Kampanya", value: stats.total, icon: Megaphone, color: "text-indigo-600", bg: "bg-indigo-50" },
                    { label: "Onay Bekleyen", value: stats.pending, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
                    { label: "Yayında", value: stats.published, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
                    { label: "Performans Skoru", value: "8.4", icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50" },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                        </div>
                        <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-50 flex items-center justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Kampanya ara..." 
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 italic">Son güncelleme: Az önce</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Kampanya Bilgisi</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Durum</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Aşama</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Olası Erişim</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tarih</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Aksiyon</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {campaigns && campaigns.length > 0 ? campaigns.map((campaign) => (
                                <tr key={campaign.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="space-y-1">
                                            <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">{campaign.title}</p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-mono text-slate-400">/{campaign.slug || 'slug-yok'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        {getStatusBadge(campaign.status)}
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-sm font-medium text-slate-600 capitalize">{campaign.pipeline_stage?.replace('_', ' ')}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-700">{campaign.search_volume?.toLocaleString() || '-'}</span>
                                            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Aylık Hacim</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-sm text-slate-500">
                                        {format(new Date(campaign.created_at), "d MMM yyyy", { locale: tr })}
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        {campaign.status === 'pending_review' ? (
                                            <Link href={`/admin/marketing/${campaign.id}/review`}>
                                                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 gap-1.5 shadow-sm shadow-indigo-200">
                                                    İncele <ArrowRight className="w-3 h-3" />
                                                </Button>
                                            </Link>
                                        ) : (
                                            <div className="flex items-center justify-end gap-1">
                                                <Link href={`/admin/marketing/${campaign.id}`}>
                                                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-indigo-600">
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                                                <Search className="w-8 h-8" />
                                            </div>
                                            <p className="text-slate-500 font-medium">Henüz pazarlama kampanyası bulunmuyor.</p>
                                            <Button variant="outline" size="sm">Yeni Kampanya Başlat</Button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
