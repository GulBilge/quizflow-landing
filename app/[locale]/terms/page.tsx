'use client';

import { motion } from 'framer-motion';
import { FileText, ArrowLeft } from 'lucide-react';
import { Link } from '@/i18n/routing';

export default function TermsOfService() {
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
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tighter hover:opacity-80 transition-opacity">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg" style={{ backgroundColor: 'rgb(44 63 113)', boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)' }}>
                            <img src="/webicon.jpg" alt="Quizyen Logo" className="w-7 h-7" />
                        </div>
                        Quizyen
                    </Link>
                    <Link href="/" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors flex items-center gap-2">
                        <ArrowLeft size={16} />
                        Back to Home
                    </Link>
                </div>
            </nav>

            <main className="relative z-10 pt-32 pb-20 px-4">
                <div className="max-w-4xl mx-auto">

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl mb-6">
                            <FileText className="text-indigo-400" size={32} />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                            <span className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">Terms of Service</span>
                        </h1>
                        <p className="text-neutral-400">Last updated: April 07, 2026</p>
                    </motion.div>

                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="prose prose-invert prose-neutral max-w-none"
                    >
                        <div className="space-y-8 text-neutral-300">

                            {/* 1. Acceptance of Terms */}
                            <section className="bg-neutral-900/40 border border-white/5 p-8 rounded-2xl">
                                <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
                                <p className="leading-relaxed">
                                    By accessing and using Quizyen, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                                </p>
                            </section>

                            {/* 2. Description of Service */}
                            <section className="bg-neutral-900/40 border border-white/5 p-8 rounded-2xl">
                                <h2 className="text-2xl font-bold text-white mb-4">2. Description of Service</h2>
                                <p className="leading-relaxed">
                                    Quizyen provides an AI-powered platform that converts PDF documents and notes into interactive quizzes. We reserve the right to modify or discontinue the service at any time without notice.
                                </p>
                            </section>

                            {/* 3. User Conduct */}
                            <section className="bg-neutral-900/40 border border-white/5 p-8 rounded-2xl">
                                <h2 className="text-2xl font-bold text-white mb-4">3. User Conduct</h2>
                                <p className="leading-relaxed mb-4">You agree not to use the service to:</p>
                                <ul className="space-y-2 list-disc list-inside ml-4">
                                    <li>Upload content that violates any third-party copyrights or intellectual property.</li>
                                    <li>Upload harmful, offensive, or illegal material.</li>
                                    <li>Attempt to reverse engineer or disrupt the service infrastructure.</li>
                                    <li>Use automated systems to crawl or scrape the platform without permission.</li>
                                </ul>
                            </section>

                            {/* 4. Intellectual Property */}
                            <section className="bg-neutral-900/40 border border-white/5 p-8 rounded-2xl">
                                <h2 className="text-2xl font-bold text-white mb-4">4. Intellectual Property</h2>
                                <p className="leading-relaxed">
                                    The "Quizyen" name, logo, and all original content and technology belong to its owners. Users retain ownership of the documents they upload, but grant us a temporary license to process them for the sole purpose of providing the quiz generation service.
                                </p>
                            </section>

                            {/* 5. Limitation of Liability */}
                            <section className="bg-neutral-900/40 border border-white/5 p-8 rounded-2xl">
                                <h2 className="text-2xl font-bold text-white mb-4">5. Limitation of Liability</h2>
                                <p className="leading-relaxed">
                                    Quizyen and its affiliates shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use or the inability to use the service. We do not guarantee the absolute accuracy of AI-generated content.
                                </p>
                            </section>

                            {/* 6. Governing Law */}
                            <section className="bg-neutral-900/40 border border-white/5 p-8 rounded-2xl">
                                <h2 className="text-2xl font-bold text-white mb-4">6. Governing Law</h2>
                                <p className="leading-relaxed">
                                    These terms and conditions are governed by and construed in accordance with the laws of Republic of Turkey and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
                                </p>
                            </section>

                            {/* 7. Contact Information */}
                            <section className="bg-gradient-to-br from-indigo-900/20 to-neutral-900 border border-indigo-500/20 p-8 rounded-2xl">
                                <h2 className="text-2xl font-bold text-white mb-4">7. Contact Information</h2>
                                <p className="leading-relaxed mb-4">
                                    For any questions regarding these Terms, please contact us via our social channels:
                                </p>
                                <div className="flex items-center justify-center gap-2 p-4 bg-neutral-900/50 rounded-xl">
                                    <span className="text-indigo-400 text-2xl">🐦</span>
                                    <a href="https://x.com/bilgegulko1" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 transition-colors text-lg font-medium">
                                        @bilgegulko1 on X (Twitter)
                                    </a>
                                </div>
                            </section>

                        </div>
                    </motion.div>

                </div>
            </main>

            {/* Footer */}
            <footer className="py-10 text-center text-neutral-600 text-sm border-t border-white/5">
                <div className="flex flex-col items-center gap-4">
                    <p>© 2026 Quizyen. All rights reserved.</p>
                    <div className="flex items-center gap-4">
                        <Link href="/privacy" className="text-neutral-500 hover:text-indigo-400 transition-colors">
                            Privacy Policy
                        </Link>
                        <span className="text-neutral-700">•</span>
                        <Link href="/terms" className="text-neutral-500 hover:text-indigo-400 transition-colors">
                            Terms of Service
                        </Link>
                        <span className="text-neutral-700">•</span>
                        <Link href="/" className="text-neutral-500 hover:text-indigo-400 transition-colors">
                            Home
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
