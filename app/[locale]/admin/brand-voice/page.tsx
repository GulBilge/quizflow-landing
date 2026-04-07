import { createClient } from "@/utils/supabase/server";
import { 
    MessageSquareQuote, 
    Plus, 
    Search, 
    Edit2, 
    Trash2, 
    Check, 
    X,
    MessageSquare,
    BookOpen,
    Target,
    Zap,
    AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";

export default async function BrandVoicePage({
    params: { locale }
}: {
    params: { locale: string }
}) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("brand_voice_guidelines")
        .select("*")
        .order("priority", { ascending: true });

    const guidelines = data || [];

    if (error) {
        console.error("Guidelines fetch error:", error);
    }

    const categories = [
        { id: 'tone', label: 'Ses Tonu & Tavır', icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' },
        { id: 'vocabulary', label: 'Kelime Dağarcığı', icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { id: 'cta_templates', label: 'CTA Şablonları', icon: Target, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { id: 'avoid_list', label: 'Yasaklılar Listesi', icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50' },
    ];

    const groupedGuidelines = (category: string) => 
        guidelines.filter((g: any) => g.category === category);

    return (
        <div className="p-6 md:p-10 space-y-10 bg-slate-50/50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                        <MessageSquareQuote className="text-indigo-600 w-8 h-8" />
                        Marka Sesi & Yönergeler
                    </h1>
                    <p className="text-slate-500 mt-1">AI ajanlarının içerik üretirken uyduğu temel kuralları ve marka kimliğini yönetin.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 h-11 px-6 rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-95">
                        <Plus className="w-4 h-4" /> Yeni Kural Ekle
                    </Button>
                </div>
            </div>

            {/* Quick Stats Overlay */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {categories.map((cat) => (
                    <div key={cat.id} className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm flex items-center gap-4 group hover:border-indigo-200 transition-all cursor-pointer">
                        <div className={cn("p-3 rounded-2xl transition-transform group-hover:scale-110", cat.bg, cat.color)}>
                            <cat.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{cat.label}</p>
                            <p className="text-xl font-bold text-slate-900">{groupedGuidelines(cat.id).length} Kural</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content: Categorized View */}
            <div className="space-y-8">
                {categories.map((cat) => {
                    const items = groupedGuidelines(cat.id);
                    return (
                        <div key={cat.id} className="space-y-4">
                            <div className="flex items-center gap-3 px-2">
                                <cat.icon className={cn("w-5 h-5", cat.color)} />
                                <h2 className="text-lg font-bold text-slate-800 tracking-tight">{cat.label}</h2>
                                <div className="h-px flex-1 bg-slate-200 ml-2"></div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {items.length > 0 ? items.map((item: any) => (
                                    <div key={item.id} className="bg-white rounded-[2rem] p-8 border border-slate-200/60 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                                        {/* Priority Badge */}
                                        <div className="absolute top-0 right-10 bg-slate-50 text-slate-400 text-[10px] font-bold px-3 py-1 rounded-b-lg border-x border-b border-slate-200 uppercase tracking-tighter">
                                            Öncelik: {item.priority}
                                        </div>

                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <div className={cn("w-2 h-2 rounded-full", item.is_active ? "bg-emerald-500" : "bg-slate-300")}></div>
                                                <h3 className="font-bold text-slate-900 text-lg group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{item.title}</h3>
                                            </div>
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <p className="text-sm text-slate-500 leading-relaxed mb-6">
                                            {item.content}
                                        </p>

                                        {item.examples && (
                                            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-50">
                                                <div className="space-y-2">
                                                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1">
                                                        <Check className="w-3 h-3" /> Doğru Örnek
                                                    </p>
                                                    <div className="bg-emerald-50/50 p-3 rounded-xl text-xs text-emerald-800 italic leading-snug border border-emerald-100">
                                                        "{(item.examples as any).good?.[0] || 'Örnek eklenmemiş.'}"
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <p className="text-[10px] font-bold text-rose-600 uppercase tracking-widest flex items-center gap-1">
                                                        <X className="w-3 h-3" /> Yanlış Örnek
                                                    </p>
                                                    <div className="bg-rose-50/50 p-3 rounded-xl text-xs text-rose-800 italic leading-snug border border-rose-100">
                                                        "{(item.examples as any).bad?.[0] || 'Örnek eklenmemiş.'}"
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )) : (
                                    <div className="md:col-span-2 bg-slate-100/30 border-2 border-dashed border-slate-200 rounded-[2rem] py-12 flex flex-col items-center justify-center text-slate-400">
                                        <MessageSquare className="w-8 h-8 mb-2 opacity-20" />
                                        <p className="text-sm font-medium">Bu kategoride henüz kural tanımlanmamış.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}
