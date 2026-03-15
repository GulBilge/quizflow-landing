'use client';

import { motion, AnimatePresence } from 'framer-motion';
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
  Music,
  Bell,
  CheckCircle,
  Apple,
  Mail,
  Loader2
} from 'lucide-react';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function CheckoutPage() {
  const t = useTranslations('Checkout');
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isWaitlisted, setIsWaitlisted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setEmail(user.email);
        setIsLoggedIn(true);
      }
    };
    checkUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error: insertError } = await (supabase
        .from('waitlist' as any) as any)
        .insert([{ email }], { count: 'minimal' });

      if (insertError) {
        if (insertError.code === '23505') { // Unique violation
          setIsWaitlisted(true); // Already on list
        } else {
          throw insertError;
        }
      } else {
        setIsWaitlisted(true);
      }
    } catch (err: any) {
      console.error('Waitlist error:', err);
      setError(err.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

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
          className="bg-white dark:bg-slate-800 rounded-[3rem] p-8 sm:p-12 shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 mb-12 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />

          <div className="relative z-10 text-center space-y-8">
            <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-3xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto transform -rotate-3">
              <Apple size={40} />
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">
                {t('ios_waitlist_title')}
              </h2>
              <p className="text-lg text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                {t('ios_waitlist_desc')}
              </p>
            </div>

            <AnimatePresence mode="wait">
              {!isWaitlisted ? (
                <motion.form
                  key="waitlist-form"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onSubmit={handleSubmit}
                  className="max-w-md mx-auto w-full space-y-4"
                >
                  {!isLoggedIn && (
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                        <Mail size={20} />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="E-posta adresiniz"
                        className="block w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all outline-none text-slate-900 dark:text-white"
                      />
                    </div>
                  )}

                  {isLoggedIn && (
                    <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800 text-sm text-indigo-700 dark:text-indigo-300">
                      Kayıtlı e-posta adresiniz: <span className="font-bold">{email}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full inline-flex items-center justify-center gap-3 px-10 py-5 bg-indigo-600 dark:bg-indigo-500 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group"
                  >
                    {isLoading ? (
                      <Loader2 size={24} className="animate-spin" />
                    ) : (
                      <>
                        <Bell size={24} className="group-hover:animate-bounce" />
                        <span>{t('ios_waitlist_btn')}</span>
                      </>
                    )}
                  </button>

                  {error && (
                    <p className="text-sm font-medium text-red-500 dark:text-red-400">
                      {error}
                    </p>
                  )}
                </motion.form>
              ) : (
                <motion.div
                  key="waitlist-success"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center gap-4 py-4"
                >
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center">
                    <CheckCircle size={32} />
                  </div>
                  <p className="text-xl font-bold text-slate-800 dark:text-slate-200">
                    {t('ios_waitlist_success')}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Platform Options (Google Play kept below as secondary option) */}
            <div className="pt-12 border-t border-slate-100 dark:border-slate-700">
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-6">
                Veya Hemen Deneyin
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="https://play.google.com/store/apps/details?id=com.gulbilge.quizflow&pcampaignid=web_share"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold transition-all hover:bg-indigo-600 dark:hover:bg-indigo-500 hover:text-white"
                >
                  <PlayCircle size={20} />
                  <div className="text-left">
                    <p className="text-[8px] uppercase font-bold opacity-60 leading-none">GET IT ON</p>
                    <p className="text-sm leading-none pt-1">Google Play</p>
                  </div>
                </a>
                <div className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-3 bg-slate-50 dark:bg-slate-900 text-slate-400 dark:text-slate-600 rounded-xl font-bold border border-slate-200 dark:border-slate-800 opacity-50 cursor-not-allowed">
                  <Apple size={20} />
                  <div className="text-left">
                    <p className="text-[8px] uppercase font-bold opacity-60 leading-none">{t('coming_soon')}</p>
                    <p className="text-sm leading-none pt-1">App Store</p>
                  </div>
                </div>
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
