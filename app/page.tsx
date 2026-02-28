'use client';

import { useState, useEffect } from 'react';
import AuthModal from '@/components/auth/AuthModal';
import { motion } from 'framer-motion';
import {
  Sparkles,
  FileText,
  Zap,
  Brain,
  ArrowRight,
  Smartphone,
  UploadCloud,
  PlayCircle,
  Library,
  BarChart,
  Menu,
  X,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get('login') === 'true') {
        setIsAuthModalOpen(true);
      }
    }
  }, []);

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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">

      {/* NAVBAR */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
                <Brain size={20} />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">Quizyen</span>
            </div>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Özellikler</a>
              <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Nasıl Çalışır?</a>
              <a href="#faq" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">SSS</a>
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
              >
                Giriş Yap
              </button>
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-full font-semibold text-sm transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30"
              >
                Hemen İndir
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-600 hover:text-indigo-600">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-4">
              <a href="#features" className="block text-slate-600 font-medium" onClick={() => setIsMenuOpen(false)}>Özellikler</a>
              <a href="#how-it-works" className="block text-slate-600 font-medium" onClick={() => setIsMenuOpen(false)}>Nasıl Çalışır?</a>
              <a href="#faq" className="block text-slate-600 font-medium" onClick={() => setIsMenuOpen(false)}>SSS</a>
              <button
                onClick={() => { setIsMenuOpen(false); setIsAuthModalOpen(true); }}
                className="w-full bg-slate-100 text-slate-900 py-3 rounded-lg font-semibold mb-2"
              >
                Giriş Yap
              </button>
              <button
                onClick={() => { setIsMenuOpen(false); setIsAuthModalOpen(true); }}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold"
              >
                Hemen İndir
              </button>
            </div>
          </motion.div>
        )}
      </nav>

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
              <span>Yapay Zeka Destekli Öğrenme</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-6">
              Ders Notlarınızı <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Saniyeler İçinde</span> Sınav Sorularına Dönüştürün.
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 mb-8 leading-relaxed">
              Yapay Zeka destekli Quizyen ile PDF'lerinizi yükleyin, anında test çözmeye başlayın. Sınavlara hazırlanmanın en akıllı yolu.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-indigo-600/20 transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                <Smartphone size={20} />
                Ücretsiz Dene
              </button>

              <button className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2">
                <PlayCircle size={20} className="text-indigo-600" />
                Nasıl Çalışır?
              </button>
            </div>

            <div className="mt-10 flex items-center justify-center lg:justify-start gap-4 text-sm text-slate-500 font-medium">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs overflow-hidden">
                    <img src={`https://ui-avatars.com/api/?name=User+${i}&background=random`} alt="User" />
                  </div>
                ))}
              </div>
              <p>1000+ Öğrenci Tarafından Kullanılıyor</p>
            </div>
          </motion.div>

          {/* Visual / Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative mx-auto lg:mr-0"
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

                  <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-500">
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">Vize Notları.pdf</p>
                      <p className="text-xs text-slate-500">2.4 MB • Hazır</p>
                    </div>
                    <div className="ml-auto">
                      <CheckCircle2 size={20} className="text-green-500" />
                    </div>
                  </div>

                  <button className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-indigo-600/20 mt-auto">
                    Quiz Oluştur ✨
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
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeIn}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 text-indigo-600 font-semibold uppercase tracking-wide text-sm">
                <span className="w-8 h-[2px] bg-indigo-600"></span>
                Eski Yöntem
              </div>
              <h2 className="text-3xl font-bold text-slate-900">Yüzlerce sayfa PDF okumaktan sıkıldınız mı?</h2>
              <p className="text-slate-600 text-lg">
                Uzun ders notlarını pasif bir şekilde okumak verimsiz ve sıkıcıdır. Bilgiyi akılda tutmak zorlaşır ve sınav stresi artar.
              </p>
              <div className="flex items-start gap-4 opacity-50">
                <FileText size={48} className="text-slate-400" />
                <div className="h-2 w-full bg-slate-100 rounded-full mt-2"></div>
                <div className="h-2 w-3/4 bg-slate-100 rounded-full mt-2"></div>
              </div>
            </div>

            <div className="bg-indigo-900 text-white p-10 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

              <div className="relative z-10 space-y-6">
                <div className="inline-flex items-center gap-2 text-indigo-300 font-semibold uppercase tracking-wide text-sm">
                  <span className="w-8 h-[2px] bg-indigo-400"></span>
                  Yeni Yöntem (Quizyen)
                </div>
                <h2 className="text-3xl font-bold">Quizyen sizin yerinize okur, özetler ve soru sorar.</h2>
                <p className="text-indigo-100 text-lg">
                  Yapay zeka içeriği analiz eder ve interaktif, öğretici bir deneyime dönüştürür. Aktif öğrenme ile hafızanızı güçlendirin.
                </p>
                <div className="inline-flex bg-white/10 backdrop-blur-sm p-4 rounded-xl items-center gap-4">
                  <Sparkles className="text-yellow-400" size={32} />
                  <span className="font-bold text-xl">Anında Üretim</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES (BENTO GRID) */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
              Öğrenme Sürecinizi Hızlandırın
            </h2>
            <p className="text-lg text-slate-600">
              Sınavlara hazırlanmak hiç bu kadar kolay olmamıştı. İşte Quizyen'un süper güçleri.
            </p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[300px]"
          >
            {/* Feature 1 (Large) */}
            <motion.div variants={fadeIn} className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-8 overflow-hidden relative">
              <div className="flex-1 space-y-4 relative z-10">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                  <UploadCloud size={24} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">PDF Analizi</h3>
                <p className="text-slate-600">
                  Herhangi bir ders notunu, kitabı veya makaleyi yükleyin. Gelişmiş okuma modülümüz içeriği saniyeler içinde tarar ve anlar.
                </p>
              </div>
              <div className="flex-1 bg-slate-50 rounded-2xl h-full w-full relative overflow-hidden border border-slate-100">
                {/* Visual placeholder */}
                <div className="absolute inset-4 bg-white rounded-xl shadow-sm p-4 space-y-2 opacity-80">
                  <div className="h-2 bg-slate-100 rounded w-full"></div>
                  <div className="h-2 bg-slate-100 rounded w-5/6"></div>
                  <div className="h-2 bg-slate-100 rounded w-full"></div>
                  <div className="h-2 bg-slate-100 rounded w-4/5"></div>
                </div>
              </div>
            </motion.div>

            {/* Feature 2 */}
            <motion.div variants={fadeIn} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col justify-between">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-4">
                <Sparkles size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Yapay Zeka Üretimi</h3>
                <p className="text-slate-600 text-sm">
                  AI, en önemli kısımları analiz eder ve sınav formatına uygun çoktan seçmeli sorular üretir.
                </p>
              </div>
              <div className="mt-4 flex gap-1">
                <div className="h-1.5 w-full bg-purple-200 rounded-full"></div>
                <div className="h-1.5 w-2/3 bg-purple-100 rounded-full"></div>
              </div>
            </motion.div>

            {/* Feature 3 */}
            <motion.div variants={fadeIn} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col justify-between">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                <Library size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Kişisel Kütüphane</h3>
                <p className="text-slate-600 text-sm">
                  Tüm sınavlarınız tek bir yerde. Derslerine göre klasörle, düzenle ve istediğin zaman tekrar et.
                </p>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="h-10 bg-slate-50 rounded-lg border border-slate-100"></div>
                <div className="h-10 bg-slate-50 rounded-lg border border-slate-100"></div>
              </div>
            </motion.div>

            {/* Feature 4 (Large) */}
            <motion.div variants={fadeIn} className="lg:col-span-2 bg-indigo-900 rounded-3xl p-8 shadow-sm border border-indigo-800 flex flex-col md:flex-row-reverse items-center gap-8 text-white relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

              <div className="flex-1 space-y-4 relative z-10">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-indigo-300">
                  <BarChart size={24} />
                </div>
                <h3 className="text-2xl font-bold">İlerleme Takibi</h3>
                <p className="text-indigo-200">
                  Hangi konuda eksiksiniz? Detaylı istatistiklerle performansınızı görün ve eksiklerinizi kapatın.
                </p>
              </div>
              <div className="flex-1 w-full relative z-10">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                  <div className="flex items-end gap-2 h-32 justify-between px-2">
                    <div className="w-full bg-indigo-500/50 rounded-t-lg h-[40%]"></div>
                    <div className="w-full bg-indigo-500/70 rounded-t-lg h-[70%]"></div>
                    <div className="w-full bg-indigo-400 rounded-t-lg h-[50%]"></div>
                    <div className="w-full bg-white rounded-t-lg h-[90%] shadow-[0_0_15px_rgba(255,255,255,0.3)]"></div>
                    <div className="w-full bg-indigo-400 rounded-t-lg h-[60%]"></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
              Nasıl Çalışır?
            </h2>
            <p className="text-lg text-slate-600">
              Karmaşık süreçler yok. Sadece 3 basit adım.
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
              <h3 className="text-xl font-bold text-slate-900 mb-3">Yükle</h3>
              <p className="text-slate-600 max-w-xs">
                Ders notlarınızı veya çıkmış sorularınızı PDF formatında sisteme yükleyin.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-24 h-24 bg-white rounded-full border-4 border-slate-100 flex items-center justify-center mb-6 shadow-sm group-hover:border-indigo-100 group-hover:scale-110 transition-all duration-300">
                <span className="text-4xl font-bold text-slate-200 group-hover:text-indigo-600 transition-colors">2</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Üret</h3>
              <p className="text-slate-600 max-w-xs">
                Yapay zeka içeriği analiz etsin ve saniyeler içinde size özel bir sınav hazırlasın.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-24 h-24 bg-white rounded-full border-4 border-slate-100 flex items-center justify-center mb-6 shadow-sm group-hover:border-indigo-100 group-hover:scale-110 transition-all duration-300">
                <span className="text-4xl font-bold text-slate-200 group-hover:text-indigo-600 transition-colors">3</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Çöz</h3>
              <p className="text-slate-600 max-w-xs">
                Bilginizi sınayın, anında geri bildirim alın ve eksiklerinizi kapatın.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-indigo-600 to-violet-600 rounded-[2.5rem] p-12 sm:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-indigo-600/30">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

          <div className="relative z-10 max-w-2xl mx-auto space-y-8">
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              Sınavlara Çalışmayı Oyunlaştırın.
            </h2>
            <p className="text-xl text-indigo-100">
              Hemen indirin ve öğrenme hızınızı ikiye katlayın. Ücretsiz başlayın.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button className="bg-white text-indigo-600 hover:bg-slate-100 px-8 py-4 rounded-xl font-bold shadow-lg transition-transform hover:scale-105 flex items-center gap-3">
                <Smartphone size={24} />
                <span>App Store'dan İndir</span>
              </button>
              <button className="bg-indigo-800/40 hover:bg-indigo-800/60 text-white px-8 py-4 rounded-xl font-bold border border-indigo-400/30 backdrop-blur-sm transition-transform hover:scale-105 flex items-center gap-3">
                <PlayCircle size={24} />
                <span>Google Play</span>
              </button>
            </div>
            <p className="text-sm opacity-60 mt-4">iOS çok yakında!</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
                  <Brain size={18} />
                </div>
                <span className="font-bold text-lg text-slate-900">Quizyen</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                Yapay zeka ile öğrenme sürecinizi optimize edin. Daha az çalışın, daha çok öğrenin.
              </p>
            </div>

            <div className="col-span-1">
              <h4 className="font-bold text-slate-900 mb-4">Ürün</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a href="#" className="hover:text-indigo-600">Özellikler</a></li>
                <li><a href="#" className="hover:text-indigo-600">Fiyatlandırma</a></li>
                <li><a href="#" className="hover:text-indigo-600">SSS</a></li>
              </ul>
            </div>

            <div className="col-span-1">
              <h4 className="font-bold text-slate-900 mb-4">Şirket</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a href="#" className="hover:text-indigo-600">Hakkımızda</a></li>
                <li><a href="#" className="hover:text-indigo-600">Blog</a></li>
                <li><a href="#" className="hover:text-indigo-600">İletişim</a></li>
              </ul>
            </div>

            <div className="col-span-1">
              <h4 className="font-bold text-slate-900 mb-4">Yasal</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a href="#" className="hover:text-indigo-600">Gizlilik Politikası</a></li>
                <li><a href="#" className="hover:text-indigo-600">Kullanım Koşulları</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-400">© 2026 Quizyen. Tüm hakları saklıdır.</p>
            <div className="flex items-center gap-6">
              {/* Social icons could go here */}
            </div>
          </div>
        </div>
      </footer>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}