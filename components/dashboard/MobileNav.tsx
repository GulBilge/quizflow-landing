'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Library, User } from 'lucide-react';
import { cn } from '@/utils/cn';

export default function MobileNav() {
    const pathname = usePathname();

    const links = [
        { href: '/dashboard', label: 'Ana Sayfa', icon: Home },
        { href: '/dashboard/library', label: 'Kütüphane', icon: Library },
        { href: '/dashboard/profile', label: 'Profil', icon: User },
    ];

    return (
        <div className="bg-slate-900 border-t border-slate-800 px-6 py-3 flex justify-between items-center pb-safe safe-area-bottom">
            {links.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                            "flex flex-col items-center gap-1 transition-colors",
                            isActive ? "text-indigo-500" : "text-slate-400"
                        )}
                    >
                        <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                        <span className="text-[10px] font-medium">{link.label}</span>
                    </Link>
                );
            })}
        </div>
    );
}
