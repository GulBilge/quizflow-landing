'use client';

import { useState, useEffect, Suspense } from 'react';
import AuthModal from '@/components/features/auth/AuthModal';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  FileText,
  Smartphone,
  UploadCloud,
  PlayCircle,
  Library,
  BarChart,
  Menu,
  X,
  CheckCircle2,
  ArrowRight,
  Globe,
  User,
  Instagram,
  Facebook,
  Youtube,
  Twitter,
  Music
} from 'lucide-react';
import BrandLogo from '@/components/layout/BrandLogo';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from '@/i18n/routing';

export default function Home() {
  const t = useTranslations('HomePage');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check for existing session and redirect if logged in
    const supabase = createClient();
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.replace('/dashboard');
      }
    };
    checkUser();

    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get('login') === 'true') {
        setIsAuthModalOpen(true);
      }
    }
  }, [router]);

  // Animation variants
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">

      {/* NAVBAR */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <BrandLogo size={32} showText={true} textColor="text-slate-900" />
            </div>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">{t('nav.features')}</a>
              <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">{t('nav.how_it_works')}</a>
              <Link href="/blog" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">{t('nav.blog')}</Link>
              <a href="#faq" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">{t('nav.faq')}</a>
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
              >
                {t('nav.login')}
              </button>
              <LanguageSwitcher />
              <a
                href="https://play.google.com/store/apps/details?id=com.gulbilge.quizflow&pcampaignid=web_share"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-full font-semibold text-sm transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30"
              >
                {t('nav.download_now')}
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-600 hover:text-indigo-600">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] md:hidden bg-slate-900/95 backdrop-blur-xl flex flex-col pt-24 px-6 overflow-hidden"
          >
            <button
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-5 right-6 text-white/70 hover:text-white p-2"
            >
              <X size={32} />
            </button>

            <motion.div
              className="space-y-6 flex flex-col"
              variants={staggerContainer}
              initial="hidden"
              animate="show"
            >
              {[
                { href: "#features", label: t('nav.features') },
                { href: "#how-it-works", label: t('nav.how_it_works') },
                { href: "/blog", label: t('nav.blog') },
                { href: "#faq", label: t('nav.faq') },
              ].map((item) => (
                <motion.div key={item.label} variants={fadeIn}>
                  <Link
                    href={item.href}
                    className="text-3xl font-bold text-white hover:text-indigo-400 flex items-center justify-between group"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                    <ArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </motion.div>
              ))}

              <motion.div variants={fadeIn} className="pt-8 border-t border-white/10 space-y-4">
                <button
                  onClick={() => { setIsMenuOpen(false); setIsAuthModalOpen(true); }}
                  className="w-full bg-white/10 hover:bg-white/20 text-white py-4 rounded-2xl font-bold text-lg backdrop-blur-md transition-all flex items-center justify-center gap-2"
                >
                  <User size={20} />
                  {t('nav.login')}
                </button>
                <a
                  href="https://play.google.com/store/apps/details?id=com.gulbilge.quizflow&pcampaignid=web_share"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold text-lg text-center shadow-lg shadow-indigo-600/20"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('nav.download_now')}
                </a>
                <div className="flex justify-center pt-4 scale-125 origin-center">
                  <LanguageSwitcher />
                </div>
              </motion.div>
            </motion.div>

            {/* Abstract decorative circles */}
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl -z-10"></div>
            <div className="absolute top-1/4 -right-10 w-48 h-48 bg-violet-600/20 rounded-full blur-3xl -z-10"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-slate-50 via-indigo-50/10 to-transparent">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl text-center lg:text-left mx-auto lg:mx-0"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-6">
              <Sparkles size={14} />
              <span>{t('hero.ai_badge')}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-6">
              {t('title')}
            </h1>

            <p className="text-base sm:text-xl text-slate-600 mb-8 leading-relaxed">
              {t('description')}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-indigo-600/20 transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                <Smartphone size={20} />
                {t('hero.try_free')}
              </button>

              <button className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2">
                <PlayCircle size={20} className="text-indigo-600" />
                {t('hero.how_it_works_btn')}
              </button>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 text-sm text-slate-500 font-medium">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs overflow-hidden shadow-sm">
                      <img src={`https://ui-avatars.com/api/?name=User+${i}&background=random&color=6366f1`} alt="User" />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col items-start leading-tight">
                  <div className="flex text-yellow-400 mb-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Sparkles key={i} size={12} fill="currentColor" />
                    ))}
                  </div>
                  <p>{t('hero.users_count')}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Visual / Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative mx-auto lg:mr-0 hidden sm:block"
          >
            {/* Background Decor */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-indigo-600/5 rounded-full blur-3xl -z-10"></div>

            {/* Phone Mockup Placeholder */}
            <div className="relative w-[300px] h-[600px] bg-slate-900 rounded-[3rem] border-8 border-slate-900 shadow-2xl overflow-hidden transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-xl z-20"></div>

              {/* Screen Content */}
              <div className="w-full h-full bg-white flex flex-col pt-12">
                {/* Header */}
                <div className="px-6 pb-6 border-b border-indigo-50">
                  <h3 className="text-xl font-bold text-slate-900">Quiz Oluştur</h3>
                  <p className="text-sm text-slate-500">PDF dosyanı seç ve başla</p>
                </div>

                {/* Body */}
                <div className="flex-1 p-6 space-y-4">
                  <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100 flex flex-col items-center justify-center text-center gap-2">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-2">
                      <UploadCloud size={24} />
                    </div>
                    <span className="font-semibold text-indigo-900">Dosya Yükle</span>
                    <span className="text-xs text-indigo-600/70">PDF, DOCX veya TXT</span>
                  </div>

                  <button className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-indigo-600/20 mt-auto">
                    {t('problem.instant_generation')} ✨
                  </button>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute top-20 -right-8 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 hidden sm:block"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">A</div>
                <div>
                  <p className="font-bold text-slate-800">Doğru!</p>
                  <p className="text-xs text-slate-500">Harika gidiyorsun 🎉</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* PROBLEM / SOLUTION */}
      <section className="py-24 bg-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-slate-50 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeIn}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-600 font-semibold uppercase tracking-wider text-xs">
                {t('problem.old_way')}
              </div>
              <h2 className="text-4xl font-extrabold text-slate-900 leading-tight">{t('problem.problem_title')}</h2>
              <p className="text-slate-600 text-xl leading-relaxed">
                {t('problem.problem_desc')}
              </p>
              <div className="relative p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:border-slate-200 transition-colors">
                 <div className="flex items-start gap-4">
                  <div className="bg-slate-200 p-3 rounded-2xl group-hover:bg-slate-300 transition-colors">
                    <FileText size={32} className="text-slate-500" />
                  </div>
                  <div className="flex-1 space-y-3 pt-2">
                    <div className="h-2.5 w-full bg-slate-200 rounded-full"></div>
                    <div className="h-2.5 w-3/4 bg-slate-200 rounded-full opacity-60"></div>
                    <div className="h-2.5 w-5/6 bg-slate-200 rounded-full opacity-40"></div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 bg-white px-4 py-2 rounded-xl shadow-lg border border-slate-100 text-xs font-bold text-slate-400 rotate-3">
                  SIKICI VE YAVAŞ
                </div>
              </div>
            </div>

            <div className="bg-indigo-600 text-white p-8 sm:p-12 rounded-[3rem] relative shadow-2xl shadow-indigo-600/30 overflow-hidden group hover:scale-[1.02] transition-transform duration-500">
              <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors"></div>
              <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl"></div>

              <div className="relative z-10 space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-indigo-100 font-semibold uppercase tracking-wider text-xs backdrop-blur-md">
                   {t('problem.new_way')}
                </div>
                <h2 className="text-4xl font-extrabold leading-tight">{t('problem.solution_title')}</h2>
                <p className="text-indigo-50 text-xl leading-relaxed">
                  {t('problem.solution_desc')}
                </p>
                <div className="inline-flex bg-white/15 backdrop-blur-xl p-5 rounded-2xl items-center gap-4 border border-white/20 shadow-xl">
                  <div className="bg-white/20 p-2 rounded-xl">
                    <Sparkles className="text-yellow-300 animate-pulse" size={28} />
                  </div>
                  <span className="font-bold text-2xl tracking-tight">{t('problem.instant_generation')} ✨</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES (BENTO GRID) */}
      <section id="features" className="py-24 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
              {t('features.title')}
            </h2>
            <p className="text-lg text-slate-600">
              {t('features.subtitle')}
            </p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {/* Feature 1 (Large) */}
            <motion.div variants={fadeIn} className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 sm:p-10 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row items-center gap-10 overflow-hidden relative group hover:border-indigo-200 transition-all duration-500">
              <div className="flex-1 space-y-5 relative z-10">
                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform duration-500">
                  <UploadCloud size={28} />
                </div>
                <h3 className="text-3xl font-extrabold text-slate-900 leading-tight">{t('features.f1_title')}</h3>
                <p className="text-slate-500 text-lg leading-relaxed">
                  {t('features.f1_desc')}
                </p>
              </div>
              <div className="flex-1 bg-slate-50 rounded-3xl h-64 w-full relative overflow-hidden border border-slate-100 group-hover:bg-indigo-50/50 transition-colors">
                <div className="absolute inset-6 bg-white rounded-2xl shadow-lg p-6 space-y-4 transform group-hover:-translate-y-2 transition-transform duration-500">
                   <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                      <FileText size={16} />
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full w-24"></div>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full w-full"></div>
                  <div className="h-2.5 bg-slate-100 rounded-full w-5/6"></div>
                  <div className="h-2.5 bg-slate-100 rounded-full w-full"></div>
                  <div className="flex justify-end gap-2 pt-2">
                    <div className="h-8 w-20 bg-indigo-600 rounded-lg"></div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Feature 2 */}
            <motion.div variants={fadeIn} className="bg-white rounded-[2.5rem] p-8 sm:p-10 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-between group hover:border-purple-200 transition-all duration-500">
              <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:rotate-12 transition-transform duration-500">
                <Sparkles size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-slate-900 mb-3">{t('features.f2_title')}</h3>
                <p className="text-slate-500 leading-relaxed">
                  {t('features.f2_desc')}
                </p>
              </div>
              <div className="mt-8 flex gap-2">
                <div className="h-2 w-full bg-purple-100 rounded-full overflow-hidden">
                   <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: "70%" }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-purple-500"
                   />
                </div>
              </div>
            </motion.div>

            {/* Feature 3 */}
            <motion.div variants={fadeIn} className="bg-white rounded-[2.5rem] p-8 sm:p-10 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-between group hover:border-blue-200 transition-all duration-500">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform duration-500">
                <Library size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-slate-900 mb-3">{t('features.f3_title')}</h3>
                <p className="text-slate-500 leading-relaxed">
                  {t('features.f3_desc')}
                </p>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-3">
                <div className="h-12 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center">
                  <div className="w-6 h-1 bg-slate-200 rounded-full"></div>
                </div>
                <div className="h-12 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center">
                  <div className="w-6 h-1 bg-slate-200 rounded-full"></div>
                </div>
              </div>
            </motion.div>

            {/* Feature 4 (Large) */}
            <motion.div variants={fadeIn} className="lg:col-span-2 bg-slate-900 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl border border-slate-800 flex flex-col md:flex-row-reverse items-center gap-10 text-white relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-transparent"></div>
              
              <div className="flex-1 space-y-5 relative z-10">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500">
                  <BarChart size={28} />
                </div>
                <h3 className="text-3xl font-extrabold leading-tight">{t('features.f4_title')}</h3>
                <p className="text-slate-400 text-lg leading-relaxed">
                  {t('features.f4_desc')}
                </p>
              </div>
              <div className="flex-1 w-full relative z-10 bg-white/5 rounded-3xl p-8 backdrop-blur-sm border border-white/10">
                <div className="flex items-end gap-3 h-40 justify-between px-2">
                  <motion.div initial={{ height: 0 }} whileInView={{ height: "40%" }} transition={{ duration: 1 }} className="flex-1 bg-indigo-500/30 rounded-t-xl"></motion.div>
                  <motion.div initial={{ height: 0 }} whileInView={{ height: "70%" }} transition={{ duration: 1, delay: 0.1 }} className="flex-1 bg-indigo-500/50 rounded-t-xl"></motion.div>
                  <motion.div initial={{ height: 0 }} whileInView={{ height: "50%" }} transition={{ duration: 1, delay: 0.2 }} className="flex-1 bg-indigo-400/60 rounded-t-xl"></motion.div>
                  <motion.div initial={{ height: 0 }} whileInView={{ height: "90%" }} transition={{ duration: 1, delay: 0.3 }} className="flex-1 bg-white rounded-t-xl shadow-[0_0_20px_rgba(255,255,255,0.4)]"></motion.div>
                  <motion.div initial={{ height: 0 }} whileInView={{ height: "60%" }} transition={{ duration: 1, delay: 0.4 }} className="flex-1 bg-indigo-500/80 rounded-t-xl"></motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
              {t('testimonials.title')}
            </h2>
            <p className="text-lg text-slate-500">
              {t('testimonials.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: t('testimonials.a1_name'), role: t('testimonials.a1_role'), text: t('testimonials.a1_text'), avatar: "https://ui-avatars.com/api/?name=Ayse+Y&background=random" },
              { name: t('testimonials.e1_name'), role: t('testimonials.e1_role'), text: t('testimonials.e1_text'), avatar: "https://ui-avatars.com/api/?name=Emre+K&background=random" },
              { name: t('testimonials.s1_name'), role: t('testimonials.s1_role'), text: t('testimonials.s1_text'), avatar: "https://ui-avatars.com/api/?name=Selin+B&background=random" }
            ].map((testimonial, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 flex flex-col hover:bg-white hover:shadow-xl hover:border-indigo-100 transition-all duration-300"
              >
                <div className="flex text-yellow-500 gap-1 mb-6">
                  {[1,2,3,4,5].map(star => <Sparkles key={star} size={14} fill="currentColor" />)}
                </div>
                <p className="text-slate-600 text-lg italic mb-8 leading-relaxed">"{testimonial.text}"</p>
                <div className="mt-auto flex items-center gap-4">
                  <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full ring-2 ring-white shadow-md" />
                  <div>
                    <h4 className="font-bold text-slate-900">{testimonial.name}</h4>
                    <p className="text-sm text-slate-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
              {t('how_it_works.title')}
            </h2>
            <p className="text-lg text-slate-600">
              {t('how_it_works.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-slate-200 z-0"></div>

            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-24 h-24 bg-white rounded-full border-4 border-slate-100 flex items-center justify-center mb-6 shadow-sm group-hover:border-indigo-100 group-hover:scale-110 transition-all duration-300">
                <span className="text-4xl font-bold text-slate-200 group-hover:text-indigo-600 transition-colors">1</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{t('how_it_works.s1_title')}</h3>
              <p className="text-slate-600 max-w-xs">
                {t('how_it_works.s1_desc')}
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-24 h-24 bg-white rounded-full border-4 border-slate-100 flex items-center justify-center mb-6 shadow-sm group-hover:border-indigo-100 group-hover:scale-110 transition-all duration-300">
                <span className="text-4xl font-bold text-slate-200 group-hover:text-indigo-600 transition-colors">2</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{t('how_it_works.s2_title')}</h3>
              <p className="text-slate-600 max-w-xs">
                {t('how_it_works.s2_desc')}
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-24 h-24 bg-white rounded-full border-4 border-slate-100 flex items-center justify-center mb-6 shadow-sm group-hover:border-indigo-100 group-hover:scale-110 transition-all duration-300">
                <span className="text-4xl font-bold text-slate-200 group-hover:text-indigo-600 transition-colors">3</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{t('how_it_works.s3_title')}</h3>
              <p className="text-slate-600 max-w-xs">
                {t('how_it_works.s3_desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-indigo-50/50 rounded-full blur-3xl -z-10"></div>
        
        <div className="max-w-6xl mx-auto bg-slate-900 rounded-[3.5rem] p-10 sm:p-16 md:p-24 text-center text-white relative overflow-hidden shadow-[0_40px_100px_-20px_rgba(79,70,229,0.3)] group">
          {/* Animated Background Gradients */}
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-indigo-600/30 via-transparent to-violet-600/20 opacity-50 group-hover:opacity-70 transition-opacity duration-700"></div>
          <motion.div 
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px]"
          ></motion.div>
          <motion.div 
            animate={{ scale: [1, 1.2, 1], rotate: [0, -5, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-32 -left-32 w-96 h-96 bg-violet-500/10 rounded-full blur-[100px]"
          ></motion.div>

          <div className="relative z-10 max-w-3xl mx-auto space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-indigo-300 font-bold text-sm tracking-widest uppercase"
            >
              <Sparkles size={16} className="text-yellow-400" />
              {t('cta_new.badge')}
            </motion.div>

            <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1]">
              {t.rich('cta_new.title', {
                akillica: (chunks) => <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">{chunks}</span>
              })}
            </h2>
            
            <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              {t('cta_new.desc')}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="w-full sm:w-auto bg-white text-slate-900 hover:bg-slate-100 px-10 py-5 rounded-2xl font-black text-xl shadow-[0_20px_40px_-10px_rgba(255,255,255,0.2)] transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
              >
                {t('cta_new.btn_start')}
                <ArrowRight size={24} className="text-indigo-600" />
              </button>
              
              <div className="flex flex-col items-center gap-3">
                <div className="flex gap-4">
                  <a
                    href="https://play.google.com/store/apps/details?id=com.gulbilge.quizflow&pcampaignid=web_share"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/5 hover:bg-white/10 text-white p-4 rounded-2xl border border-white/10 backdrop-blur-sm transition-all hover:-translate-y-1"
                  >
                    <PlayCircle size={32} />
                  </a>
                  <div className="bg-white/5 text-white/30 p-4 rounded-2xl border border-white/5 backdrop-blur-sm cursor-not-allowed">
                    <Smartphone size={32} />
                  </div>
                </div>
                <span className="text-xs font-bold text-white/40 tracking-widest uppercase">{t('cta_new.mobile_app')}</span>
              </div>
            </div>

            <div className="pt-8 flex flex-wrap justify-center gap-x-8 gap-y-4 opacity-40">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} />
                <span className="text-sm font-medium">{t('cta_new.feature_card')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} />
                <span className="text-sm font-medium">{t('cta_new.feature_setup')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} />
                <span className="text-sm font-medium">{t('cta_new.feature_unlimited')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <BrandLogo size={28} showText={true} textColor="text-slate-900" />
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                {t('footer.desc')}
              </p>
            </div>

            <div className="col-span-1">
              <h4 className="font-bold text-slate-900 mb-4">{t('footer.product')}</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a href="#features" className="hover:text-indigo-600">{t('nav.features')}</a></li>
                <li><Link href="/checkout" className="hover:text-indigo-600">{t('footer.pricing')}</Link></li>
                <li><a href="#faq" className="hover:text-indigo-600">{t('nav.faq')}</a></li>
              </ul>
            </div>

            <div className="col-span-1">
              <h4 className="font-bold text-slate-900 mb-4">{t('footer.company')}</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a href="#" className="hover:text-indigo-600">{t('footer.about_us')}</a></li>
                <li><Link href="/blog" className="hover:text-indigo-600">{t('nav.blog')}</Link></li>
                <li><a href="#" className="hover:text-indigo-600">{t('footer.contact')}</a></li>
              </ul>
            </div>

            <div className="col-span-1">
              <h4 className="font-bold text-slate-900 mb-4">{t('footer.legal')}</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a href="#" className="hover:text-indigo-600">{t('footer.privacy_policy')}</a></li>
                <li><a href="#" className="hover:text-indigo-600">{t('footer.terms_of_service')}</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-400">{t('footer.copyright')}</p>
            <div className="flex items-center gap-4">
              <a href="https://www.instagram.com/quizyen?igsh=MWNzc3c2YWgyN3NiNw==" target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all" title="Instagram">
                <Instagram size={20} />
              </a>
              <div className="p-2 rounded-xl bg-slate-50 text-slate-300 cursor-not-allowed" title="Facebook (Yakında)">
                <Facebook size={20} />
              </div>
              <div className="p-2 rounded-xl bg-slate-50 text-slate-300 cursor-not-allowed" title="YouTube (Yakında)">
                <Youtube size={20} />
              </div>
              <div className="p-2 rounded-xl bg-slate-50 text-slate-300 cursor-not-allowed" title="TikTok (Yakında)">
                <Music size={20} />
              </div>
              <div className="p-2 rounded-xl bg-slate-50 text-slate-300 cursor-not-allowed" title="Twitter (Yakında)">
                <Twitter size={20} />
              </div>
            </div>
          </div>
        </div>
      </footer>
      <Suspense fallback={null}>
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      </Suspense>
    </div>
  );
}