'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Library, User, Brain } from 'lucide-react';
import { cn } from '@/utils/cn';

export default function Sidebar({ user }: { user: any }) {
    const pathname = usePathname();

    const links = [
        { href: '/dashboard', label: 'Ana Sayfa', icon: Home },
        { href: '/dashboard/library', label: 'Kütüphane', icon: Library },
        { href: '/dashboard/profile', label: 'Profil', icon: User },
    ];

    return (
        <div className="flex flex-col h-full bg-slate-900 text-white border-r border-slate-800">
            <div className="flex items-center gap-2 px-6 py-6 border-b border-slate-800">
                <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
                    <Brain size={20} />
                </div>
                <span className="font-bold text-xl tracking-tight">QuizFlow</span>
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
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-800">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xs ring-2 ring-indigo-500/10">
                        {user.email?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{user.user_metadata?.full_name || 'Kullanıcı'}</p>
                        <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
