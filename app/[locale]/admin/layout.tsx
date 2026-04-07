import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { 
    LayoutDashboard, 
    Megaphone, 
    Music2, 
    Settings, 
    LogOut,
    User,
    Bell,
    Layers,
    MessageSquareQuote
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { env } from "@/utils/env";

export default async function AdminLayout({
    children,
    params: { locale },
}: {
    children: React.ReactNode;
    params: { locale: string };
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect(`/${locale}/admin/login`);
    }

    // Security check (Duplicate of actions.ts logic for layout)
    const adminEmails = (env.ADMIN_EMAILS || "")
        .split(",")
        .map((e: string) => e.trim().replace(/['"]+/g, '').toLowerCase());
    const userEmail = (user.email || "").trim().toLowerCase();
    const superAdminEmail = (env.SUPERADMIN_EMAIL || "").trim().toLowerCase();

    if (!adminEmails.includes(userEmail) && userEmail !== superAdminEmail) {
        redirect(`/${locale}/dashboard`);
    }

    const navigation = [
        { name: "Dashboard", href: `/${locale}/admin`, icon: LayoutDashboard },
        { name: "Kampanyalar", href: `/${locale}/admin/campaigns`, icon: Megaphone },
        { name: "Marka Sesi", href: `/${locale}/admin/brand-voice`, icon: MessageSquareQuote },
        { name: "Sistem Logları", href: `/${locale}/admin/logs`, icon: Layers },
        { name: "Ayarlar", href: `/${locale}/admin/settings`, icon: Settings },
    ];

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 flex-shrink-0 hidden md:flex flex-col sticky top-0 h-screen">
                <div className="p-6">
                    <Link href={`/${locale}/admin`} className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                            <span className="text-white font-bold text-xl">Q</span>
                        </div>
                        <span className="font-bold text-xl text-slate-900 tracking-tight">Quizyen Admin</span>
                    </Link>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition-all group"
                        >
                            <item.icon className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <div className="bg-indigo-50 rounded-2xl p-4">
                        <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">Superadmin Modu</p>
                        <p className="text-xs text-indigo-400 leading-tight">İçerik onaylama ve sistem ayarları aktiftir.</p>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Topbar */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
                    <div className="md:hidden">
                        <Link href={`/${locale}/admin`} className="font-bold text-xl text-indigo-600">Q</Link>
                    </div>
                    <div className="flex-1 hidden md:block">
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">Quizyen AI Marketing Suite</p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
                        </button>
                        
                        <div className="h-8 w-px bg-slate-200 mx-1"></div>
                        
                        <div className="flex items-center gap-3">
                            <div className="flex flex-col items-end">
                                <span className="text-sm font-bold text-slate-900 leading-none">{user.email?.split('@')[0]}</span>
                                <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-tight">Çevrimiçi</span>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                                <User className="w-6 h-6 text-slate-400" />
                            </div>
                            <form action="/auth/signout" method="post">
                                <Button variant="ghost" size="icon" type="submit" className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all">
                                    <LogOut className="w-5 h-5" />
                                </Button>
                            </form>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
