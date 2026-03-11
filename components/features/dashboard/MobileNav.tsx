'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Library, User, Activity } from 'lucide-react';
import { cn } from '@/utils/cn';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';


export default function MobileNav() {
    const pathname = usePathname();
    const t = useTranslations('Sidebar');
 
    const links = [
        { href: '/dashboard', label: t('home'), icon: Home },
        { href: '/dashboard/library', label: t('library'), icon: Library },
        { href: '/dashboard/performance', label: t('performance'), icon: Activity },
        { href: '/dashboard/profile', label: t('profile'), icon: User },
    ];

    return (
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-6 py-3 flex justify-between items-center pb-safe safe-area-bottom">
            {links.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                            "flex flex-col items-center gap-1.5 transition-all duration-300 relative px-4 py-1",
                            isActive ? "text-indigo-600 dark:text-indigo-400 scale-110" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        )}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="mobile-nav-pill"
                                className="absolute inset-0 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl -z-10"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                        <span className={cn(
                            "text-[10px] font-bold tracking-tight uppercase",
                            isActive ? "opacity-100" : "opacity-70 group-hover:opacity-100"
                        )}>{link.label}</span>
                    </Link>
                );
            })}
        </div>
    );
}
