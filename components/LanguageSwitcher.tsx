"use client";

import { usePathname, useRouter } from '@/i18n/routing';
import { Globe } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useTransition } from 'react';

export function LanguageSwitcher() {
    const [isPending, startTransition] = useTransition();
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const t = useTranslations('Header');

    function toggleLanguage() {
        const nextLocale = locale === 'tr' ? 'en' : 'tr';
        startTransition(() => {
            router.replace(pathname, { locale: nextLocale });
        });
    }

    return (
        <button
            onClick={toggleLanguage}
            disabled={isPending}
            className="group relative p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50"
            title={t('toggle_language')}
        >
            <Globe size={20} className="transition-transform group-hover:rotate-12" />
            <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white border border-white dark:border-slate-900">
                {locale.toUpperCase()}
            </span>
        </button>
    );
}
