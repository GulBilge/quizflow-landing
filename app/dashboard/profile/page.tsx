import { createClient } from "@/utils/supabase/server";
import { User, Mail, LogOut, Trash2, Shield, Moon, Sun, Globe } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/?login=true");
    }

    // Fetch detailed profile if needed
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Profil & Ayarlar</h1>

            {/* User Info Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-center gap-6">
                <div className="relative">
                    <div className="w-24 h-24 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-3xl font-bold ring-4 ring-white dark:ring-slate-800 shadow-lg">
                        {user.email?.charAt(0).toUpperCase()}
                    </div>
                    {profile?.is_pro && (
                        <div className="absolute bottom-0 right-0 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm border-2 border-white dark:border-slate-800">
                            PRO
                        </div>
                    )}
                </div>

                <div className="text-center md:text-left flex-1">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user.user_metadata?.full_name || 'Kullanıcı'}</h2>
                    <div className="flex items-center justify-center md:justify-start gap-2 text-slate-500 dark:text-slate-400 mt-1">
                        <Mail size={16} />
                        <span>{user.email}</span>
                    </div>
                    <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-3">
                        <div className="bg-slate-100 dark:bg-slate-700/50 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300">
                            Üyelik: <span className="font-bold text-indigo-600 dark:text-indigo-400">{profile?.is_pro ? 'Premium' : 'Ücretsiz'}</span>
                        </div>
                        <div className="bg-slate-100 dark:bg-slate-700/50 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300">
                            ID: {user.id.substring(0, 8)}...
                        </div>
                    </div>
                </div>
            </div>

            {/* Settings Sections */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* App Settings */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                    <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <Globe size={18} />
                        Uygulama Ayarları
                    </h3>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700/30">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                                <Moon size={18} />
                            </div>
                            <span className="font-medium text-sm">Karanlık Mod</span>
                        </div>
                        <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-200 dark:bg-indigo-600 transition-colors">
                            <span className="translate-x-1 dark:translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700/30">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
                                <Globe size={18} />
                            </div>
                            <span className="font-medium text-sm">Dil</span>
                        </div>
                        <span className="text-xs font-bold text-slate-500 bg-white dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-600">TR</span>
                    </div>
                </div>

                {/* Account Actions */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                    <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <Shield size={18} />
                        Hesap İşlemleri
                    </h3>

                    <form action="/auth/signout" method="post">
                        <button type="submit" className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-300 transition-colors text-left group">
                            <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-200">
                                <LogOut size={18} />
                            </div>
                            <span className="font-medium text-sm">Çıkış Yap</span>
                        </button>
                    </form>

                    <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 text-red-600 transition-colors text-left group">
                        <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg text-red-500 group-hover:text-red-700">
                            <Trash2 size={18} />
                        </div>
                        <div className="flex-1">
                            <span className="font-medium text-sm block">Hesabımı Sil</span>
                            <span className="text-[10px] opacity-70">Bu işlem geri alınamaz</span>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}
