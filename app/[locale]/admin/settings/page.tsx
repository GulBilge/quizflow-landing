import { createClient } from "@/utils/supabase/server";
import { 
    Settings, 
    Bell, 
    Shield, 
    Globe, 
    User, 
    Smartphone,
    CreditCard,
    Zap,
    Save
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function AdminSettingsPage({
    params: { locale }
}: {
    params: { locale: string }
}) {
    return (
        <div className="p-6 md:p-10 space-y-10 bg-slate-50/50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                        <Settings className="text-indigo-600 w-8 h-8" />
                        Admin Ayarları
                    </h1>
                    <p className="text-slate-500 mt-1">Sistem tercihlerini, bildirimleri ve güvenlik ayarlarını yönetin.</p>
                </div>
                <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 h-11 px-8 rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-95">
                    <Save className="w-4 h-4" /> Değişiklikleri Kaydet
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sidebar Settings Navigation */}
                <div className="lg:col-span-1 space-y-2">
                    {[
                        { label: 'Genel', icon: Globe, active: true },
                        { label: 'Güvenlik & Erişim', icon: Shield, active: false },
                        { label: 'Bildirimler', icon: Bell, active: false },
                        { label: 'Plan & Ödeme', icon: CreditCard, active: false },
                        { label: 'API & Entegrasyonlar', icon: Zap, active: false },
                    ].map((item, i) => (
                        <button
                            key={i}
                            className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-bold transition-all ${
                                item.active 
                                    ? "bg-white text-indigo-600 shadow-sm border border-slate-200" 
                                    : "text-slate-500 hover:bg-slate-100/50 hover:text-slate-700"
                            }`}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </button>
                    ))}
                </div>

                {/* Settings Form Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-slate-50">
                            <h3 className="text-lg font-bold text-slate-900">Sistem Tercihleri</h3>
                            <p className="text-sm text-slate-500">Panelin genel çalışma şeklini ayarlayın.</p>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Varsayılan Dil</label>
                                    <select className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium appearance-none">
                                        <option value="tr">Türkçe</option>
                                        <option value="en">English</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Zaman Dilimi</label>
                                    <select className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium appearance-none">
                                        <option value="europe/istanbul">Europe/Istanbul (GMT+3)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                        <Smartphone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">Bakım Modu</p>
                                        <p className="text-xs text-slate-500">Aktif edildiğinde sadece yöneticiler panele erişebilir.</p>
                                    </div>
                                </div>
                                <div className="w-12 h-6 bg-slate-200 rounded-full relative cursor-pointer">
                                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-rose-50 border border-rose-100 rounded-[2.5rem] p-8 flex gap-6 items-start">
                        <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                            <AlertCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-rose-900 text-lg">Tehlikeli Bölge</h4>
                            <p className="text-sm text-rose-700/70 mb-4">Bu ayarlar geri alınamaz ve tüm sistemi etkiler.</p>
                            <Button variant="ghost" className="text-rose-600 hover:bg-rose-100 font-bold border border-rose-200 rounded-xl px-6">
                                Tüm Cache'i Temizle
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function AlertCircle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </svg>
  )
}
