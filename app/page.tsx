'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, FileText, Zap, Brain, ArrowRight, Smartphone, UploadCloud, PlayCircle, Twitter } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Supabase istemcisini oluşturuyoruz
// Supabase istemcisini oluşturuyoruz
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Home() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState(''); // Kullanıcıya gösterilecek mesaj state'i

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. VALIDATION: Basit e-posta kontrolü
    if (!email || !email.includes('@') || !email.includes('.')) {
      setStatus('error');
      setMessage('Please enter a valid email address.');

      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 3000);

      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const { error } = await supabase
        .from('waitlist')
        .insert({ email });

      if (error) {
        // Unique Violation (Zaten kayıtlı)
        if (error.code === '23505') {
          setStatus('success');
          setMessage("You're already on the list! 🎉");
          setEmail('');
        } else {
          throw error;
        }
      } else {
        // Başarılı
        setStatus('success');
        setMessage('You are in! 🚀');
        setEmail('');
      }
    } catch (error) {
      console.error('Error:', error);
      setStatus('error');
      setMessage('Something went wrong. Try again.');
    }

    // 4 saniye sonra butonu sıfırla
    setTimeout(() => {
      setStatus('idle');
      setMessage('');
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-indigo-500 selection:text-white overflow-hidden">

      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-neutral-950/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg" style={{ backgroundColor: 'rgb(44 63 113)', boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)' }}>
              <img src="/webicon.jpg" alt="QuizFlow Logo" className="w-7 h-7" />
              {/* <Sparkles size={18} className="text-white" /> */}
            </div>
            QuizFlow
          </div>
          <a href="#waitlist" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">
            Get Early Access
          </a>
        </div>
      </nav>

      <main className="relative z-10 pt-32 pb-20 px-4">

        {/* HERO SECTION */}
        <div className="max-w-4xl mx-auto text-center space-y-8 mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Waitlist is now open
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight"
          >
            <span className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">Don't just read PDFs.</span>
            <br />
            <span className="text-indigo-500">Interact with them.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed"
          >
            Upload your static PDF exams or lecture notes and instantly transform them into
            <span className="text-white font-medium"> interactive quizzes</span> with AI-powered feedback.
            Stop memorizing blindly, start learning actively.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row w-full max-w-md gap-3">
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === 'loading' || status === 'success'}
                className="flex-1 bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-neutral-600 transition-all disabled:opacity-50"
              />
              <button
                disabled={status === 'loading' || status === 'success'}
                className={`
                  px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap shadow-lg 
                  ${status === 'success'
                    ? 'bg-green-600 hover:bg-green-600 text-white cursor-default'
                    : status === 'error'
                      ? 'bg-red-600 hover:bg-red-500 text-white'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
                  }
                `}
              >
                {status === 'loading' ? (
                  <span className="animate-pulse">Saving...</span>
                ) : status === 'success' ? (
                  message
                ) : status === 'error' ? (
                  message
                ) : (
                  <>
                    Join Waitlist <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-xs text-neutral-500"
          >
            🔒 Secure your spot for the <strong>Lifetime Deal</strong>. No spam, just updates.
          </motion.p>
        </div>

        {/* VISUAL DEMO / HOW IT WORKS */}
        <div className="max-w-5xl mx-auto mb-32">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-white mb-2">From Static File to Active Learning</h2>
            <p className="text-neutral-500">How QuizFlow works in 3 simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="bg-neutral-900/40 border border-white/5 p-8 rounded-2xl flex flex-col items-center text-center group hover:bg-neutral-900/60 transition-colors">
              <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mb-6 text-indigo-400 group-hover:scale-110 transition-transform">
                <UploadCloud size={32} />
              </div>
              <h3 className="text-lg font-bold mb-2">1. Upload PDF</h3>
              <p className="text-sm text-neutral-400">Drag & drop your lecture slides, past exams, or textbook chapters.</p>
            </div>

            {/* Step 2 */}
            <div className="bg-neutral-900/40 border border-white/5 p-8 rounded-2xl flex flex-col items-center text-center group hover:bg-neutral-900/60 transition-colors relative">
              <div className="hidden md:block absolute top-1/2 -left-3 -translate-y-1/2 text-neutral-700">
                <ArrowRight size={24} />
              </div>
              <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mb-6 text-indigo-400 group-hover:scale-110 transition-transform">
                <Brain size={32} />
              </div>
              <h3 className="text-lg font-bold mb-2">2. AI Analysis</h3>
              <p className="text-sm text-neutral-400">Gemini AI scans the content, identifies key concepts, and generates questions.</p>
            </div>

            {/* Step 3 */}
            <div className="bg-neutral-900/40 border border-white/5 p-8 rounded-2xl flex flex-col items-center text-center group hover:bg-neutral-900/60 transition-colors relative">
              <div className="hidden md:block absolute top-1/2 -left-3 -translate-y-1/2 text-neutral-700">
                <ArrowRight size={24} />
              </div>
              <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mb-6 text-indigo-400 group-hover:scale-110 transition-transform">
                <PlayCircle size={32} />
              </div>
              <h3 className="text-lg font-bold mb-2">3. Start Quiz</h3>
              <p className="text-sm text-neutral-400">Solve the interactive quiz, track your score, and review explanations.</p>
            </div>
          </div>
        </div>

        {/* FEATURES GRID */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          <div className="col-span-1 lg:col-span-2 bg-gradient-to-br from-indigo-900/20 to-neutral-900 border border-white/5 p-8 rounded-3xl">
            <div className="h-10 w-10 bg-indigo-600 rounded-lg flex items-center justify-center mb-4">
              <FileText className="text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3">PDF to Interactive Exam</h3>
            <p className="text-neutral-400 max-w-md">
              The core superpower. Don't just read through boring PDF files. Let our AI convert them into a test format instantly, so you can practice actively instead of passively reading.
            </p>
          </div>

          <div className="bg-neutral-900/30 border border-white/5 p-8 rounded-3xl">
            <div className="h-10 w-10 bg-neutral-800 rounded-lg flex items-center justify-center mb-4 text-indigo-400">
              <Zap />
            </div>
            <h3 className="text-xl font-bold mb-2">Instant Feedback</h3>
            <p className="text-neutral-400 text-sm">
              Get immediate explanations for every answer. Understand "Why" it's wrong, not just "What" is wrong.
            </p>
          </div>

          <div className="bg-neutral-900/30 border border-white/5 p-8 rounded-3xl">
            <div className="h-10 w-10 bg-neutral-800 rounded-lg flex items-center justify-center mb-4 text-indigo-400">
              <Smartphone />
            </div>
            <h3 className="text-xl font-bold mb-2">Mobile First</h3>
            <p className="text-neutral-400 text-sm">
              Designed for your phone. Turn your commute or coffee break into a productive study session.
            </p>
          </div>

          <div className="col-span-1 lg:col-span-2 bg-neutral-900/30 border border-white/5 p-8 rounded-3xl flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">Powered by Google Gemini</h3>
              <p className="text-neutral-400 text-sm">
                We use the latest AI models to ensure the questions generated are relevant, accurate, and context-aware. It's like having a private tutor analyzing your notes.
              </p>
            </div>
            <div className="w-full md:w-32 h-12 flex items-center justify-center gap-1">
              <div className="w-2 h-8 bg-indigo-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-12 bg-indigo-400 rounded-full animate-pulse delay-75"></div>
              <div className="w-2 h-6 bg-purple-500 rounded-full animate-pulse delay-150"></div>
            </div>
          </div>
        </div>

        {/* NEW: SOCIAL PROOF / BUILD IN PUBLIC SECTION */}
        <div className="max-w-4xl mx-auto mb-32 px-4">
          <a
            href="https://x.com/bilgegulko1"
            target="_blank"
            rel="noopener noreferrer"
            className="block group relative overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/50 hover:bg-neutral-900 hover:border-indigo-500/50 transition-all duration-300"
          >
            <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
              <Twitter size={120} className="text-indigo-500 -rotate-12 translate-x-10 -translate-y-10" />
            </div>

            <div className="p-8 flex flex-col md:flex-row items-center gap-6 relative z-10">
              <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center shrink-0 border-2 border-indigo-500 shadow-lg shadow-indigo-500/20">
                {/* Eğer profil fotoğrafın varsa buraya <img /> koyabiliriz, şimdilik ikon */}
                <Twitter className="text-white" size={28} />
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">
                  Witness the Journey on X
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  I'm building QuizFlow in public. Follow <strong>@bilgegulko1</strong> to see behind-the-scenes updates, vote on upcoming features, and be part of the story.
                </p>
              </div>
              <div className="ml-auto mt-4 md:mt-0">
                <span className="inline-flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-full font-bold text-sm hover:bg-indigo-50  transition-colors">
                  Follow Me <ArrowRight size={16} />
                </span>
              </div>
            </div>
          </a>
        </div>

        {/* FOOTER CTA */}
        <div id="waitlist" className="max-w-3xl mx-auto text-center space-y-6 pt-20 border-t border-white/5">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Upgrade Your Study Game?</h2>
          <p className="text-neutral-400">
            Join the waitlist today. We are building this in public, and early supporters get the best deal.
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="bg-white text-black hover:bg-neutral-200 px-8 py-4 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]"
            >
              Join the Waitlist
            </button>
          </div>
        </div>
      </main>

      <footer className="py-10 text-center text-neutral-600 text-sm">
        <div className="flex flex-col items-center gap-4">
          <p>© 2026 QuizFlow. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="/privacy" className="text-neutral-500 hover:text-indigo-400 transition-colors">
              Privacy Policy
            </a>
            <span className="text-neutral-700">•</span>
            <a href="/delete-account" className="text-neutral-500 hover:text-red-400 transition-colors">
              Delete Account
            </a>
            <span className="text-neutral-700">•</span>
            <a href="https://x.com/bilgegulko1" target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-indigo-400 transition-colors">
              Twitter
            </a>
          </div>
          <p className="flex items-center gap-1.5 text-neutral-500 hover:text-indigo-400 transition-colors cursor-default select-none">
            <span>Developed with love</span>
            <span className="text-red-500 animate-pulse text-base">❤️</span>
          </p>
        </div>
      </footer>
    </div>
  );
}