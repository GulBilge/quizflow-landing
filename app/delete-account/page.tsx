'use client';

import { motion } from 'framer-motion';
import { Trash2, ArrowLeft, AlertTriangle, Smartphone, Mail } from 'lucide-react';
import Link from 'next/link';

export default function DeleteAccount() {
    return (
        <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-indigo-500 selection:text-white overflow-hidden">

            {/* Background Gradients */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-red-600/10 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-orange-600/10 rounded-full blur-[100px]"></div>
            </div>

            {/* Navbar */}
            <nav className="fixed w-full z-50 bg-neutral-950/80 backdrop-blur-md border-b border-white/5">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tighter hover:opacity-80 transition-opacity">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg" style={{ backgroundColor: 'rgb(44 63 113)', boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)' }}>
                            <img src="/webicon.jpg" alt="QuizFlow Logo" className="w-7 h-7" />
                        </div>
                        QuizFlow
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
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600/10 border border-red-500/20 rounded-2xl mb-6">
                            <Trash2 className="text-red-400" size={32} />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                            <span className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">Delete Your Account</span>
                        </h1>
                        <p className="text-neutral-400 max-w-2xl mx-auto">
                            We're sorry to see you go. Follow the instructions below to permanently delete your QuizFlow account and all associated data.
                        </p>
                    </motion.div>

                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="space-y-8"
                    >

                        {/* Warning Notice */}
                        <section className="bg-gradient-to-br from-red-900/20 to-orange-900/20 border border-red-500/30 p-8 rounded-2xl">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0">
                                    <AlertTriangle className="text-red-400" size={28} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white mb-2">⚠️ Important Notice</h2>
                                    <p className="text-neutral-300 leading-relaxed mb-3">
                                        Deleting your account is <strong className="text-white">permanent and irreversible</strong>. Once deleted, you will lose access to:
                                    </p>
                                    <ul className="space-y-2 list-disc list-inside ml-4 text-neutral-300">
                                        <li>All your generated quizzes and quiz history</li>
                                        <li>Your saved PDFs and uploaded documents</li>
                                        <li>Your account settings and preferences</li>
                                        <li>Any remaining subscription benefits (if applicable)</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* How to Delete - Mobile App */}
                        <section className="bg-neutral-900/40 border border-white/5 p-8 rounded-2xl">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-neutral-800 rounded-xl flex items-center justify-center">
                                    <Smartphone className="text-indigo-400" size={24} />
                                </div>
                                <h2 className="text-2xl font-bold text-white">Delete Account via Mobile App</h2>
                            </div>

                            <p className="text-neutral-300 leading-relaxed mb-6">
                                To delete your account directly from the QuizFlow mobile application:
                            </p>

                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 bg-indigo-600/20 border border-indigo-500/30 rounded-full flex items-center justify-center text-indigo-400 font-bold text-sm">
                                        1
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-white mb-1">Open the QuizFlow App</h3>
                                        <p className="text-neutral-400 text-sm">Launch the QuizFlow application on your mobile device</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 bg-indigo-600/20 border border-indigo-500/30 rounded-full flex items-center justify-center text-indigo-400 font-bold text-sm">
                                        2
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-white mb-1">Tap the Menu Icon</h3>
                                        <p className="text-neutral-400 text-sm">Tap the menu icon (☰) in the top right corner of the screen</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 bg-indigo-600/20 border border-indigo-500/30 rounded-full flex items-center justify-center text-indigo-400 font-bold text-sm">
                                        3
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-white mb-1">Select "My Profile"</h3>
                                        <p className="text-neutral-400 text-sm">From the menu, tap on "My Profile" (Profilim) to access your profile settings</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 bg-indigo-600/20 border border-indigo-500/30 rounded-full flex items-center justify-center text-indigo-400 font-bold text-sm">
                                        4
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-white mb-1">Tap "Delete My Account"</h3>
                                        <p className="text-neutral-400 text-sm">Scroll down and tap on "Delete My Account" (Hesabımı Sil) button (displayed in red)</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 bg-indigo-600/20 border border-indigo-500/30 rounded-full flex items-center justify-center text-indigo-400 font-bold text-sm">
                                        5
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-white mb-1">Confirm Deletion</h3>
                                        <p className="text-neutral-400 text-sm">Read the warning message and confirm your decision to permanently delete your account</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 bg-green-600/20 border border-green-500/30 rounded-full flex items-center justify-center text-green-400 font-bold text-sm">
                                        ✓
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-white mb-1">Account Deleted</h3>
                                        <p className="text-neutral-400 text-sm">Your account and all associated data will be permanently deleted within 24-48 hours</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Alternative: Contact Support */}
                        <section className="bg-neutral-900/40 border border-white/5 p-8 rounded-2xl">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-neutral-800 rounded-xl flex items-center justify-center">
                                    <Mail className="text-indigo-400" size={24} />
                                </div>
                                <h2 className="text-2xl font-bold text-white">Alternative: Contact Support</h2>
                            </div>

                            <p className="text-neutral-300 leading-relaxed mb-6">
                                If you're unable to delete your account through the app, or if you need assistance, please reach out to us:
                            </p>

                            <div className="space-y-4">
                                <div className="bg-neutral-800/50 border border-white/5 p-6 rounded-xl text-center">
                                    <p className="text-sm text-neutral-400 mb-3">Reach out on X (Twitter):</p>
                                    <a href="https://x.com/bilgegulko1" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium text-xl">
                                        @bilgegulko1
                                    </a>
                                </div>

                                <div className="mt-6 p-4 bg-indigo-900/20 border border-indigo-500/20 rounded-xl">
                                    <p className="text-sm text-neutral-300">
                                        <strong className="text-white">Please include:</strong> Your registered email address and a brief reason for deletion (optional).
                                        We'll process your request within 48 hours.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* What Happens After Deletion */}
                        <section className="bg-neutral-900/40 border border-white/5 p-8 rounded-2xl">
                            <h2 className="text-2xl font-bold text-white mb-4">What Happens After Deletion?</h2>
                            <div className="space-y-3 text-neutral-300">
                                <p className="leading-relaxed">
                                    Once you confirm account deletion:
                                </p>
                                <ul className="space-y-2 list-disc list-inside ml-4">
                                    <li>Your account will be immediately deactivated</li>
                                    <li>All personal data will be permanently deleted from our servers within 48 hours</li>
                                    <li>Your email will be removed from our waitlist and mailing lists</li>
                                    <li>Any uploaded PDFs and generated quizzes will be permanently erased</li>
                                    <li>You will receive a confirmation email once the deletion is complete</li>
                                </ul>
                                <p className="leading-relaxed mt-4">
                                    <strong className="text-white">Note:</strong> Some anonymized usage data may be retained for analytics purposes,
                                    but it will not be linked to your identity in any way.
                                </p>
                            </div>
                        </section>

                        {/* Changed Your Mind? */}
                        <section className="bg-gradient-to-br from-indigo-900/20 to-neutral-900 border border-indigo-500/20 p-8 rounded-2xl text-center">
                            <h2 className="text-2xl font-bold text-white mb-4">Changed Your Mind?</h2>
                            <p className="text-neutral-300 leading-relaxed mb-6">
                                We'd love to keep you as part of the QuizFlow community! If you're experiencing issues or have feedback,
                                please reach out to us before deleting your account. We're here to help!
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href="/"
                                    className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20"
                                >
                                    <ArrowLeft size={18} />
                                    Back to Home
                                </Link>
                                <a
                                    href="https://x.com/bilgegulko1"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white px-6 py-3 rounded-xl font-bold transition-all border border-white/10"
                                >
                                    <Mail size={18} />
                                    Contact on X
                                </a>
                            </div>
                        </section>

                    </motion.div>

                </div>
            </main>

            {/* Footer */}
            <footer className="py-10 text-center text-neutral-600 text-sm border-t border-white/5">
                <div className="flex flex-col items-center gap-4">
                    <p>© 2026 QuizFlow. All rights reserved.</p>
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
