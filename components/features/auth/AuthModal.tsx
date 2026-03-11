'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, Loader2, Github } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/routing';
import { createClient } from '@/utils/supabase/client';
import { getURL } from '@/utils/env';
import { useLocale, useTranslations } from 'next-intl';

const supabase = createClient();

export default function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const t = useTranslations('Auth');
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const locale = useLocale();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;

                // Login successful
                router.push('/dashboard');
                router.refresh();
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${getURL()}/auth/callback`,
                    },
                });
                if (error) throw error;

                // Sign up successful - check if email confirmation is needed
                setError(t('signup_success'));
                setIsLogin(true);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback?next=/dashboard&locale=${locale}`,
                    queryParams: {
                        prompt: "select_account",
                    }
                },
            });
            if (error) throw error;
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Reset form when mode changes
    useEffect(() => {
        setError(null);
        setEmail('');
        setPassword('');
    }, [isLogin]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 flex items-center justify-center z-[70] p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden pointer-events-auto p-8 flex flex-col items-center text-center relative"
                        >
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <div className="mb-2">
                                <h2 className="text-3xl font-extrabold text-indigo-600 tracking-tight">{t('title')}</h2>
                            </div>

                            <p className="text-slate-500 font-medium mb-10">{t('subtitle')}</p>

                            {error && (
                                <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs rounded-lg w-full text-left">
                                    ⚠️ {error}
                                </div>
                            )}

                            <button
                                onClick={handleGoogleLogin}
                                disabled={loading}
                                className="w-full bg-white border-2 border-slate-100 hover:border-slate-200 text-slate-700 font-semibold py-3.5 rounded-full transition-all hover:bg-slate-50 active:scale-[0.98] flex items-center justify-center gap-3 mb-6"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin text-slate-400" size={20} />
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                                            <path
                                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                                fill="#4285F4"
                                            />
                                            <path
                                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                                fill="#34A853"
                                            />
                                            <path
                                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                                fill="#FBBC05"
                                            />
                                            <path
                                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                                fill="#EA4335"
                                            />
                                        </svg>
                                        <span>{t('google_login')}</span>
                                    </>
                                )}
                            </button>

                            <p className="text-[10px] text-slate-400 leading-tight px-4">
                                {t('terms_accept')}
                            </p>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
