"use client";

import { cn } from "@/utils/cn";
import { Brain, ChevronRight, Home, Library, LogOut, User, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { createClient } from "@/utils/supabase/client";

interface MobileSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    user: any;
}

export default function MobileSidebar({ isOpen, onClose, user }: MobileSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();

    const links = [
        { href: "/dashboard", label: "Ana Sayfa", icon: Home },
        { href: "/dashboard/library", label: "Kütüphane", icon: Library },
        { href: "/dashboard/profile", label: "Profil", icon: User },
    ];

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/");
        router.refresh();
        onClose();
    };

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        },
        exit: {
            opacity: 0,
            transition: {
                staggerChildren: 0.05,
                staggerDirection: -1
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 20, stiffness: 100 } as any },
        exit: { opacity: 0, scale: 0.95 }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 lg:hidden"
                >
                    {/* Background with heavy blur */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/90 backdrop-blur-xl"
                    />

                    {/* Gradient decorations */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 z-10" />
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

                    <div className="relative h-full flex flex-col p-6 overflow-y-auto">
                        {/* Header */}
                        <div className="flex items-center justify-between pb-8 pt-4">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-3"
                            >
                                <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-600/30">
                                    <Brain size={24} />
                                </div>
                                <span className="font-black text-2xl tracking-tighter text-white">Quizyen</span>
                            </motion.div>
                            <motion.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={onClose}
                                className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
                            >
                                <X size={24} />
                            </motion.button>
                        </div>

                        {/* Navigation Links */}
                        <motion.nav
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="flex-1 flex flex-col justify-center space-y-4"
                        >
                            {links.map((link) => {
                                const Icon = link.icon;
                                const isActive = pathname === link.href;
                                return (
                                    <motion.div key={link.href} variants={itemVariants}>
                                        <Link
                                            href={link.href}
                                            onClick={onClose}
                                            className={cn(
                                                "flex items-center gap-5 px-6 py-5 rounded-[2rem] transition-all group relative overflow-hidden",
                                                isActive
                                                    ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/30"
                                                    : "text-slate-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10"
                                            )}
                                        >
                                            <Icon size={28} className={cn("transition-transform group-hover:scale-110 duration-300", isActive ? "text-white" : "text-slate-500 group-hover:text-indigo-400")} />
                                            <span className="text-xl font-bold tracking-tight">{link.label}</span>
                                            {!isActive && (
                                                <div className="absolute right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                                        <ChevronRight size={18} />
                                                    </div>
                                                </div>
                                            )}
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </motion.nav>

                        {/* Footer Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, type: "spring", damping: 25 }}
                            className="mt-auto space-y-6"
                        >
                            <div className="p-6 rounded-[2.5rem] bg-indigo-500/5 border border-white/5 backdrop-blur-sm">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5">
                                        <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-white font-black text-xl">
                                            {user.email?.charAt(0).toUpperCase()}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-lg font-black text-white truncate tracking-tight">
                                            {user.user_metadata?.full_name || "Kullanıcı"}
                                        </p>
                                        <p className="text-sm text-slate-400 truncate">{user.email}</p>
                                    </div>
                                </div>

                                <button
                                    onClick={handleSignOut}
                                    className="flex w-full items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-all font-bold text-base border border-rose-500/20"
                                >
                                    <LogOut size={20} />
                                    Çıkış yap
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

