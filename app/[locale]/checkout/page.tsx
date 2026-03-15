'use client';

import { motion } from 'framer-motion';
import {
  Smartphone,
  CheckCircle2,
  ArrowLeft,
  ShieldCheck,
  Star,
  Instagram,
  Facebook,
  Youtube,
  Twitter,
  ExternalLink,
  PlayCircle,
  Music
} from 'lucide-react';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export default function CheckoutPage() {
  const t = useTranslations('Checkout');
  const router = useRouter();

  const socialLinks = [
    { name: 'Instagram', icon: Instagram, href: 'https://www.instagram.com/quizyen?igsh=MWNzc3c2YWgyN3NiNw==', active: true },
    { name: 'Facebook', icon: Facebook, href: '#', active: false },
    { name: 'YouTube', icon: Youtube, href: '#', active: false },
    { name: 'TikTok', icon: Music, href: '#', active: false }, // Using Music as fallback for TikTok
    { name: 'Twitter', icon: Twitter, href: '#', active: false },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-8 transition-colors font-medium group"
        >
          <div className="p-2 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30">
            <ArrowLeft size={18} />
          </div>
          <span>Geri Dön</span>
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-bold mb-4"
          >
            <Star size={16} fill="currentColor" />
            <span>Quizyen Premium</span>
          </motion.div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
            {t('suspended_title')}
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            {t('suspended_desc')}
          </p>
        </div>

        {/* Main Action Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-[3rem] p-8 sm:p-12 shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 mb-12 relative overflow-hidden text-center"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />

          <div className="relative z-10 space-y-8">
            <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-3xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto transform rotate-3">
              <Smartphone size={40} />
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {t('download_app_btn')}
              </h2>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <a
                  href="https://play.google.com/store/apps/details?id=com.gulbilge.quizflow&pcampaignid=web_share"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold transition-all hover:scale-105"
                >
                  <PlayCircle size={24} />
                  <div className="text-left">
                    <p className="text-[10px] uppercase font-bold opacity-60 leading-none">GET IT ON</p>
                    <p className="text-lg leading-none pt-1">Google Play</p>
                  </div>
                </a>
                <div className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 rounded-2xl font-bold cursor-not-allowed border border-slate-200 dark:border-slate-600">
                  <Smartphone size={24} />
                  <div className="text-left">
                    <p className="text-[10px] uppercase font-bold opacity-60 leading-none">COMING SOON</p>
                    <p className="text-lg leading-none pt-1">App Store</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="pt-8 border-t border-slate-100 dark:border-slate-700">
              <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6">
                {t('social_media_title')}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target={social.active ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 px-5 py-3 rounded-2xl border transition-all ${
                      social.active
                        ? "bg-white dark:bg-slate-800 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 hover:shadow-lg hover:border-indigo-400"
                        : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed"
                    }`}
                  >
                    <social.icon size={20} />
                    <span className="font-bold">{social.name}</span>
                    {!social.active && (
                      <span className="text-[10px] bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded-md">
                        {t('coming_soon')}
                      </span>
                    )}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Secure Payment Badge (Kept for trust, but maybe remove if confusing? Plan says keep layout clean) */}
        <div className="flex flex-col items-center gap-4 text-slate-400 dark:text-slate-500 opacity-50">
          <div className="flex items-center gap-6">
            <ShieldCheck size={48} className="opacity-20" />
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />
            <div className="text-sm font-semibold max-w-[200px] leading-tight">
              Güvenli Ödeme Altyapısı ile 256-bit SSL Koruma
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
