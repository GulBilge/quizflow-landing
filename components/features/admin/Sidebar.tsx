"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    FileText,
    Settings,
    LogOut,
    ChevronLeft,
    Menu
} from "lucide-react";
import BrandLogo from "@/components/layout/BrandLogo";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const navItems = [
    {
        title: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
    },
    {
        title: "Blog Yönetimi",
        href: "/admin/blog",
        icon: FileText,
    },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <>
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-100 fixed top-0 left-0 right-0 z-50">
                <div className="flex items-center gap-2">
                    <BrandLogo size={28} showText={true} textColor="text-slate-900" />
                    <span className="font-bold text-lg text-slate-900 font-sans ml-[-8px]">Admin</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(!isMobileOpen)}>
                    <Menu size={24} />
                </Button>
            </div>

            {/* Backdrop for mobile */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-[60] md:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar Sidebar */}
            <aside className={`
                fixed top-0 left-0 bottom-0 bg-white border-r border-gray-100 z-[70] transition-all duration-300
                ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                ${isCollapsed ? 'w-20' : 'w-64'}
            `}>
                <div className="flex flex-col h-full p-4">
                    {/* Logo Area */}
                    <div className={`flex items-center gap-3 mb-10 ${isCollapsed ? 'justify-center' : 'px-2'}`}>
                        <BrandLogo size={isCollapsed ? 28 : 32} showText={!isCollapsed} textColor="text-slate-900" />
                    </div>

                    {/* Nav Links */}
                    <nav className="flex-1 space-y-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMobileOpen(false)}
                                    className={`
                                        flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all
                                        ${isActive
                                            ? 'bg-indigo-50 text-indigo-600 font-semibold shadow-sm'
                                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}
                                        ${isCollapsed ? 'justify-center px-0' : ''}
                                    `}
                                >
                                    <Icon size={20} className={isActive ? 'text-indigo-600' : 'text-gray-400'} />
                                    {!isCollapsed && <span>{item.title}</span>}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Bottom Area */}
                    <div className="mt-auto space-y-2">
                        <Link
                            href="/"
                            className={`
                                flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all
                                ${isCollapsed ? 'justify-center px-0' : ''}
                            `}
                        >
                            <LogOut size={20} />
                            {!isCollapsed && <span>Çıkış Yap</span>}
                        </Link>

                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="hidden md:flex items-center justify-center w-full p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                        >
                            <ChevronLeft className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} size={20} />
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}
