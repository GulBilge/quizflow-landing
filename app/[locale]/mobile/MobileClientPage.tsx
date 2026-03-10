'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Smartphone, Zap, Cloud, ShieldCheck, Download, Star, CheckCircle2, ArrowRight, BookOpen, Layers, Target, Search, Menu, Plus, ChevronRight, Play, Check, X, Trophy, Calendar } from 'lucide-react';
import Link from 'next/link';
import { use } from 'react';
import Image from 'next/image';

export default function MobileClientPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = use(params);
    const t = useTranslations('MobilePage');

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6 }
    };

    const features = [
        {
            icon: Zap,
            title: t('feature_offline_title'),
            description: t('feature_offline_desc'),
            color: 'text-[#5e5ce6]',
            bg: 'bg-[#5e5ce6]/10'
        },
        {
            icon: Target,
            title: t('feature_sync_title'),
            description: t('feature_sync_desc'),
            color: 'text-emerald-400',
            bg: 'bg-emerald-400/10'
        },
        {
            icon: Layers,
            title: t('feature_ui_title'),
            description: t('feature_ui_desc'),
            color: 'text-blue-400',
            bg: 'bg-blue-400/10'
        }
    ];

    return (
        <div className="min-h-screen bg-[#0b121f] text-slate-100 font-sans selection:bg-[#5e5ce6]/30 selection:text-white overflow-hidden">
            {/* Background Decor */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] bg-[#5e5ce6]/5 rounded-full blur-[140px]"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[70%] h-[70%] bg-[#5e5ce6]/10 rounded-full blur-[140px]"></div>
            </div>

            {/* Nav */}
            <nav className="fixed top-0 w-full z-50 bg-[#0b121f]/50 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                    <Link href={`/${locale}`} className="flex items-center gap-3 group">
                        <div className="relative w-10 h-10 bg-[#314170] rounded-xl overflow-hidden shadow-2xl group-hover:scale-110 transition-transform flex items-center justify-center p-1.5">
                            {/* Logo SVG matching the user's provided logo (Bird in Q) */}
                            <svg viewBox="0 0 100 100" className="w-full h-full text-white fill-current">
                                <path d="M50 10 C27.9 10 10 27.9 10 50 C10 72.1 27.9 90 50 90 C55.3 90 60.3 89 64.9 87.1 L82 90 L78 74 C85.6 67.5 90 59.2 90 50 C90 27.9 72.1 10 50 10 Z M50 78 C34.5 78 22 65.5 22 50 C22 34.5 34.5 22 50 22 C65.5 22 78 34.5 78 50 C78 55.4 76.5 60.4 73.9 64.6 L61.5 52.2 C65.2 46.2 61 38.2 53.5 38.2 C51 38.2 48.5 39.2 46.5 41.2 C40.5 47.2 48.5 58.2 58.5 58.2 L70.5 70.2 C65 74.9 57.8 77.7 50 77.7 Z" />
                                <circle cx="50" cy="50" r="4.5" />
                            </svg>
                        </div>
                        <span className="font-bold text-2xl tracking-tight text-white italic">Quizyen</span>
                    </Link>
                    <a
                        href="https://play.google.com/store/apps/details?id=com.gulbilge.quizflow&pcampaignid=web_share"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden sm:flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#5e5ce6] hover:bg-[#4d4bbd] text-white font-bold text-sm transition-all shadow-xl shadow-[#5e5ce6]/20"
                    >
                        <Download size={16} />
                        {t('download_cta')}
                    </a>
                </div>
            </nav>

            {/* Hero */}
            <section className="pt-40 pb-20 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-10"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#5e5ce6]/10 border border-[#5e5ce6]/20 text-[#8e8df1] text-sm font-semibold tracking-widest uppercase">
                        <Smartphone size={16} />
                        <span>PREMIUM AI TOOL</span>
                    </div>
                    <h1 className="text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] text-white">
                        {t('hero_title')}
                    </h1>
                    <p className="text-xl text-slate-400 leading-relaxed max-w-xl font-medium">
                        {t('hero_description')}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-5">
                        <a
                            href="https://play.google.com/store/apps/details?id=com.gulbilge.quizflow&pcampaignid=web_share"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-8 py-5 bg-[#5e5ce6] hover:bg-[#4d4bbd] text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-4 transition-all hover:scale-105 shadow-[0_20px_40px_-10px_rgba(94,92,230,0.4)]"
                        >
                            <Image
                                src="https://www.gstatic.com/images/branding/product/2x/google_play_96dp.png"
                                alt="Play Store"
                                width={32}
                                height={32}
                            />
                            <div className="text-left">
                                <p className="text-[10px] uppercase opacity-70 leading-none mb-1 text-white">Get it on</p>
                                <p className="text-lg leading-none font-black text-white">Google Play</p>
                            </div>
                        </a>

                        <div className="px-8 py-5 bg-white/5 border border-white/10 text-slate-500 rounded-2xl font-bold text-lg flex items-center justify-center gap-4 transition-all cursor-not-allowed">
                            <Smartphone size={28} className="opacity-30" />
                            <div className="text-left opacity-30">
                                <p className="text-[10px] uppercase leading-none mb-1">Coming soon on</p>
                                <p className="text-lg leading-none font-black">App Store</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 pt-10 border-t border-white/5">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-12 h-12 rounded-full border-2 border-[#0b121f] bg-slate-800" />
                            ))}
                        </div>
                        <div className="space-y-1">
                            <div className="flex text-[#5e5ce6] scale-110 -ml-1">
                                {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={16} fill="currentColor" />)}
                            </div>
                            <p className="text-sm text-slate-400 font-semibold uppercase tracking-wider">Join 1,000+ Students</p>
                        </div>
                    </div>
                </motion.div>

                {/* Visual Mockup - EXACT APP DASHBOARD */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="relative flex justify-center lg:justify-end"
                >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[80%] bg-[#5e5ce6]/10 rounded-full blur-[100px] -z-10"></div>

                    <div className="relative w-[320px] h-[650px] bg-[#0c141d] rounded-[3rem] p-[10px] shadow-2xl shadow-black/80 ring-1 ring-white/10 overflow-hidden transform rotate-2 hover:rotate-0 transition-transform duration-700">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-[#0c141d] rounded-b-[1.5rem] z-30 flex items-center justify-center gap-1.5">
                            <div className="w-10 h-1 bg-white/10 rounded-full"></div>
                            <div className="w-2 h-2 bg-white/10 rounded-full"></div>
                        </div>

                        <div className="h-full bg-[#0b121f] rounded-[2.3rem] overflow-hidden relative flex flex-col p-5 pt-12 space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="flex-1 bg-[#1a2333] border border-white/5 rounded-xl h-12 flex items-center px-4 gap-3">
                                    <Search size={18} className="text-slate-500" />
                                    <span className="text-sm text-slate-500 font-medium">Sınav ara...</span>
                                </div>
                                <div className="w-12 h-12 bg-[#1a2333] border border-white/5 rounded-xl flex items-center justify-center text-[#5e5ce6]">
                                    <Layers size={20} />
                                </div>
                                <div className="w-12 h-12 bg-[#1a2333] border border-white/5 rounded-xl flex items-center justify-center text-slate-300">
                                    <Menu size={20} />
                                </div>
                            </div>

                            <h2 className="text-2xl font-black text-white tracking-tight">Quizyen</h2>

                            <div className="bg-[#1a2333] border border-white/5 rounded-2xl p-5 flex items-center gap-5 group cursor-pointer hover:bg-[#1e293b] transition-colors">
                                <div className="w-14 h-14 bg-[#5e5ce6] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#5e5ce6]/20">
                                    <Plus size={32} />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm font-black text-white">Yeni Sınav Oluştur</p>
                                    <p className="text-[10px] text-slate-400 font-medium leading-tight opacity-70">Bir sınav PDF'i yükle, yapay zeka senin için interaktif bir sınav hazırlayacak.</p>
                                </div>
                                <ChevronRight size={20} className="text-slate-600" />
                            </div>

                            <div className="flex justify-between items-center pt-2">
                                <p className="text-sm font-black text-white">Son Çalışmaların</p>
                                <p className="text-[10px] text-[#5e5ce6] font-black tracking-widest">TÜMÜ</p>
                            </div>

                            <div className="bg-[#1a2333] border border-white/5 rounded-2xl p-5 space-y-4">
                                <div className="space-y-2">
                                    <div className="inline-flex items-center px-2 py-1 rounded bg-[#5e5ce6]/10 text-[#8e8df1] text-[8px] font-black tracking-widest">EN SON ÇALIŞMAN</div>
                                    <p className="text-xs font-black text-white leading-snug">Mikrobiyolojik Tanı Yöntemleri - Alıştırma</p>
                                    <div className="flex items-center gap-1.5 text-slate-500 text-[8px] font-medium">
                                        <Calendar size={10} />
                                        <span>01.02.2026 tarihinde bakıldı</span>
                                    </div>
                                </div>

                                <div className="bg-[#0b121f]/50 border border-white/5 rounded-xl p-3 grid grid-cols-3 gap-2">
                                    <div className="bg-[#1f3a37] border border-emerald-500/10 rounded-lg p-2 text-center space-y-1">
                                        <div className="w-5 h-5 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                                            <Check size={10} className="text-emerald-400" />
                                        </div>
                                        <p className="text-[7px] text-slate-500 font-bold uppercase">Doğru</p>
                                        <p className="text-xs font-black text-emerald-400 leading-none">11</p>
                                    </div>
                                    <div className="bg-[#3a1f1f] border border-rose-500/10 rounded-lg p-2 text-center space-y-1">
                                        <div className="w-5 h-5 bg-rose-500/20 rounded-full flex items-center justify-center mx-auto">
                                            <X size={10} className="text-rose-400" />
                                        </div>
                                        <p className="text-[7px] text-slate-500 font-bold uppercase">Yanlış</p>
                                        <p className="text-xs font-black text-rose-400 leading-none">1</p>
                                    </div>
                                    <div className="bg-[#1f2a3a] border border-blue-500/10 rounded-lg p-2 text-center space-y-1">
                                        <div className="w-5 h-5 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto">
                                            <Trophy size={10} className="text-blue-400" />
                                        </div>
                                        <p className="text-[7px] text-slate-500 font-bold uppercase">Puan</p>
                                        <p className="text-xs font-black text-blue-400 leading-none">90</p>
                                    </div>
                                </div>

                                <div className="flex justify-center">
                                    <p className="text-[7px] text-[#5e5ce6] font-black tracking-widest flex items-center gap-1">GEÇMİŞ SONUÇLAR <ChevronRight size={10} /></p>
                                </div>

                                <button className="w-full bg-[#5e5ce6] hover:bg-[#4d4bbd] text-white py-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#5e5ce6]/20 transition-all">
                                    <Play size={14} fill="white" />
                                    BAŞLAT
                                </button>
                            </div>
                        </div>

                        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-10 opacity-30 pointer-events-none">
                            <div className="w-5 h-5 rounded-md border-2 border-white"></div>
                            <div className="w-5 h-5 rounded-full border-2 border-white"></div>
                            <div className="w-5 h-5 rounded-md border-2 border-white transform rotate-45"></div>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Features (Modern Glassmorphism) */}
            <section className="py-40 px-6">
                <div className="max-w-7xl mx-auto space-y-16">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight">Akıllı Sınav Hazırlığı</h2>
                        <p className="text-slate-500 max-w-2xl mx-auto font-medium text-lg">Hızlı, senkronize ve modern. QuizFlow mobil ile çalışma alışkanlıklarını baştan yaratıyoruz.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, i) => (
                            <motion.div
                                key={i}
                                variants={fadeIn}
                                initial="initial"
                                whileInView="whileInView"
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="p-12 bg-white/[0.02] backdrop-blur-2xl rounded-[3rem] border border-white/5 hover:border-[#5e5ce6]/30 transition-all hover:bg-white/[0.04] group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-[#5e5ce6]/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className={`w-16 h-16 ${feature.bg} ${feature.color} rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform group-hover:rotate-6`}>
                                    <feature.icon size={32} />
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
                                <p className="text-slate-400 leading-relaxed font-medium text-lg">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Premium CTA */}
            <section className="py-40 px-6">
                <motion.div
                    {...fadeIn}
                    className="max-w-6xl mx-auto bg-gradient-to-br from-[#1a2333] to-[#0b121f] rounded-[4rem] p-16 lg:p-32 text-center relative overflow-hidden shadow-2xl border border-white/5"
                >
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#5e5ce6]/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#5e5ce6]/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>

                    <div className="relative z-10 space-y-12">
                        <div className="space-y-6">
                            <h2 className="text-5xl lg:text-7xl font-black tracking-tighter text-white mb-6">Öğrenmeye Hemen Başla</h2>
                            <p className="text-xl lg:text-2xl text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed">
                                PDF dosyalarını saniyeler içinde çözülmeye hazır testlere dönüştür. QuizFlow'un gücünü her an cebinde hisset.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
                            <a
                                href="https://play.google.com/store/apps/details?id=com.gulbilge.quizflow&pcampaignid=web_share"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-12 py-6 bg-[#5e5ce6] hover:bg-[#4d4bbd] text-white rounded-[2rem] font-black text-2xl transition-all hover:scale-105 shadow-2xl flex items-center gap-5 group"
                            >
                                <Image
                                    src="https://www.gstatic.com/images/branding/product/2x/google_play_96dp.png"
                                    alt=""
                                    width={40}
                                    height={40}
                                />
                                {t('play_store')}
                                <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                            </a>
                        </div>
                        <div className="flex justify-center gap-8 pt-8 opacity-50">
                            <div className="flex items-center gap-2 text-white font-bold uppercase tracking-[0.3em] text-[10px]">
                                <ShieldCheck size={14} className="text-[#5e5ce6]" />
                                <span>Secure Data</span>
                            </div>
                            <div className="flex items-center gap-2 text-white font-bold uppercase tracking-[0.3em] text-[10px]">
                                <Zap size={14} className="text-[#5e5ce6]" />
                                <span>Cloud Sync</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="py-24 px-6 border-t border-white/5 bg-[#0b121f]">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#314170] rounded-xl flex items-center justify-center p-2">
                            <svg viewBox="0 0 100 100" className="w-full h-full text-white fill-current opacity-50">
                                <path d="M50 10 C27.9 10 10 27.9 10 50 C10 72.1 27.9 90 50 90 C55.3 90 60.3 89 64.9 87.1 L82 90 L78 74 C85.6 67.5 90 59.2 90 50 C90 27.9 72.1 10 50 10 Z M50 78 C34.5 78 22 65.5 22 50 C22 34.5 34.5 22 50 22 C65.5 22 78 34.5 78 50 C78 55.4 76.5 60.4 73.9 64.6 L61.5 52.2 C65.2 46.2 61 38.2 53.5 38.2 C51 38.2 48.5 39.2 46.5 41.2 C40.5 47.2 48.5 58.2 58.5 58.2 L70.5 70.2 C65 74.9 57.8 77.7 50 77.7 Z" />
                            </svg>
                        </div>
                        <div className="text-left">
                            <span className="font-bold text-2xl tracking-tighter text-white block leading-none italic">Quizyen</span>
                            <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest leading-none mt-1">Mobile</span>
                        </div>
                    </div>
                    <div className="flex gap-10 text-xs text-slate-600 font-black tracking-[0.2em] uppercase">
                        <Link href="/" className="hover:text-[#5e5ce6] transition-colors">Home</Link>
                        <a href="mailto:support@quizyen.com" className="hover:text-[#5e5ce6] transition-colors">Support</a>
                        <Link href="/privacy" className="hover:text-[#5e5ce6] transition-colors">Privacy</Link>
                    </div>
                    <p className="text-[10px] text-slate-700 font-bold uppercase tracking-widest">© 2026 Quizyen. All Rights Reserved.</p>
                </div>
            </footer>
        </div>
    );
}
