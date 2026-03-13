'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Library, User, LogOut, Activity } from 'lucide-react';
import BrandLogo from '@/components/layout/BrandLogo';
import { cn } from '@/utils/cn';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function Sidebar({ user }: { user: any }) {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();
    const t = useTranslations('Sidebar');

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/');
        router.refresh();
    };

    const links = [
        { href: '/dashboard', label: t('home'), icon: Home },
        { href: '/dashboard/library', label: t('library'), icon: Library },
        { href: '/dashboard/performance', label: t('performance'), icon: Activity },
        { href: '/dashboard/profile', label: t('profile'), icon: User },
    ];


    return (
        <div className="flex flex-col h-full bg-slate-900 text-white border-r border-slate-800">
            <div className="flex items-center gap-2 px-6 py-6 border-b border-slate-800">
                <BrandLogo size={32} showText={true} textColor="text-white" />
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm",
                                isActive
                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                            )}
                        >
                            <Icon size={20} />
                            {link.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <div className="space-y-4">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-800">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xs ring-2 ring-indigo-500/10">
                            {user.email?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{user.user_metadata?.full_name || t('user_fallback')}</p>
                            <p className="text-xs text-slate-400 truncate">{user.email}</p>
                        </div>
                    </div>

                    <button
                        onClick={handleSignOut}
                        className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all font-medium text-sm"
                    >
                        <LogOut size={20} />
                        {t('sign_out')}
                    </button>

                </div>
            </div>
        </div>
    );
}
