'use client';

import { motion } from 'framer-motion';
import { Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicy() {
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
                            <Shield className="text-indigo-400" size={32} />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                            <span className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">Privacy Policy</span>
                        </h1>
                        <p className="text-neutral-400">Last updated: January 22, 2026</p>
                    </motion.div>

                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="prose prose-invert prose-neutral max-w-none"
                    >
                        <div className="space-y-8 text-neutral-300">

                            {/* Introduction */}
                            <section className="bg-neutral-900/40 border border-white/5 p-8 rounded-2xl">
                                <h2 className="text-2xl font-bold text-white mb-4">Introduction</h2>
                                <p className="leading-relaxed">
                                    Welcome to Quizyen. We respect your privacy and are committed to protecting your personal data.
                                    This privacy policy will inform you about how we look after your personal data when you visit our
                                    website or use our mobile application and tell you about your privacy rights and how the law protects you.
                                </p>
                            </section>

                            {/* Information We Collect */}
                            <section className="bg-neutral-900/40 border border-white/5 p-8 rounded-2xl">
                                <h2 className="text-2xl font-bold text-white mb-4">Information We Collect</h2>
                                <p className="leading-relaxed mb-4">We may collect, use, store and transfer different kinds of personal data about you:</p>
                                <ul className="space-y-2 list-disc list-inside ml-4">
                                    <li><strong className="text-white">Identity Data:</strong> Email address and name (if provided)</li>
                                    <li><strong className="text-white">Technical Data:</strong> IP address, browser type and version, device information</li>
                                    <li><strong className="text-white">Usage Data:</strong> Information about how you use our website and app</li>
                                    <li><strong className="text-white">Content Data:</strong> PDF files you upload for quiz generation (processed and not permanently stored)</li>
                                </ul>
                            </section>

                            {/* How We Use Your Information */}
                            <section className="bg-neutral-900/40 border border-white/5 p-8 rounded-2xl">
                                <h2 className="text-2xl font-bold text-white mb-4">How We Use Your Information</h2>
                                <p className="leading-relaxed mb-4">We use your personal data for the following purposes:</p>
                                <ul className="space-y-2 list-disc list-inside ml-4">
                                    <li>To provide and maintain our service</li>
                                    <li>To notify you about changes to our service</li>
                                    <li>To provide customer support</li>
                                    <li>To gather analysis or valuable information to improve our service</li>
                                    <li>To detect, prevent and address technical issues</li>
                                    <li>To send you updates about Quizyen (only if you joined our waitlist)</li>
                                </ul>
                            </section>

                            {/* Data Storage and Security */}
                            <section className="bg-neutral-900/40 border border-white/5 p-8 rounded-2xl">
                                <h2 className="text-2xl font-bold text-white mb-4">Data Storage and Security</h2>
                                <p className="leading-relaxed mb-4">
                                    We use Supabase for secure data storage and Google Gemini AI for quiz generation. Your uploaded PDF files are:
                                </p>
                                <ul className="space-y-2 list-disc list-inside ml-4">
                                    <li>Processed temporarily to generate quizzes</li>
                                    <li>Sent to Google Gemini AI for analysis</li>
                                    <li>Automatically deleted after processing</li>
                                    <li>Never shared with third parties for marketing purposes</li>
                                </ul>
                                <p className="leading-relaxed mt-4">
                                    We implement appropriate technical and organizational security measures to protect your personal data.
                                </p>
                            </section>

                            {/* Your Rights */}
                            <section className="bg-neutral-900/40 border border-white/5 p-8 rounded-2xl">
                                <h2 className="text-2xl font-bold text-white mb-4">Your Rights</h2>
                                <p className="leading-relaxed mb-4">Under data protection laws, you have rights including:</p>
                                <ul className="space-y-2 list-disc list-inside ml-4">
                                    <li><strong className="text-white">Right to Access:</strong> Request copies of your personal data</li>
                                    <li><strong className="text-white">Right to Rectification:</strong> Request correction of inaccurate data</li>
                                    <li><strong className="text-white">Right to Erasure:</strong> Request deletion of your personal data</li>
                                    <li><strong className="text-white">Right to Restrict Processing:</strong> Request restriction of processing your data</li>
                                    <li><strong className="text-white">Right to Data Portability:</strong> Request transfer of your data</li>
                                    <li><strong className="text-white">Right to Object:</strong> Object to processing of your personal data</li>
                                </ul>
                            </section>

                            {/* Cookies */}
                            <section className="bg-neutral-900/40 border border-white/5 p-8 rounded-2xl">
                                <h2 className="text-2xl font-bold text-white mb-4">Cookies</h2>
                                <p className="leading-relaxed">
                                    We use cookies and similar tracking technologies to track activity on our service and store certain information.
                                    You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However,
                                    if you do not accept cookies, you may not be able to use some portions of our service.
                                </p>
                            </section>

                            {/* Third-Party Services */}
                            <section className="bg-neutral-900/40 border border-white/5 p-8 rounded-2xl">
                                <h2 className="text-2xl font-bold text-white mb-4">Third-Party Services</h2>
                                <p className="leading-relaxed mb-4">We use the following third-party services:</p>
                                <ul className="space-y-2 list-disc list-inside ml-4">
                                    <li><strong className="text-white">Supabase:</strong> For database and authentication services</li>
                                    <li><strong className="text-white">Google Gemini AI:</strong> For AI-powered quiz generation</li>
                                    <li><strong className="text-white">Netlify:</strong> For hosting our website</li>
                                </ul>
                                <p className="leading-relaxed mt-4">
                                    These services have their own privacy policies addressing how they use your information.
                                </p>
                            </section>

                            {/* Children's Privacy */}
                            <section className="bg-neutral-900/40 border border-white/5 p-8 rounded-2xl">
                                <h2 className="text-2xl font-bold text-white mb-4">Children's Privacy</h2>
                                <p className="leading-relaxed">
                                    Our service is not intended for children under 13 years of age. We do not knowingly collect
                                    personally identifiable information from children under 13. If you are a parent or guardian and
                                    you are aware that your child has provided us with personal data, please contact us.
                                </p>
                            </section>

                            {/* Changes to This Policy */}
                            <section className="bg-neutral-900/40 border border-white/5 p-8 rounded-2xl">
                                <h2 className="text-2xl font-bold text-white mb-4">Changes to This Privacy Policy</h2>
                                <p className="leading-relaxed">
                                    We may update our Privacy Policy from time to time. We will notify you of any changes by posting
                                    the new Privacy Policy on this page and updating the "Last updated" date at the top of this policy.
                                    You are advised to review this Privacy Policy periodically for any changes.
                                </p>
                            </section>

                            {/* Contact Us */}
                            <section className="bg-gradient-to-br from-indigo-900/20 to-neutral-900 border border-indigo-500/20 p-8 rounded-2xl">
                                <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
                                <p className="leading-relaxed mb-4">
                                    If you have any questions about this Privacy Policy or our data practices, please contact us:
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
                        <Link href="/delete-account" className="text-neutral-500 hover:text-red-400 transition-colors">
                            Delete Account
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
