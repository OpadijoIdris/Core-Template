"use client";

import withAuth from '../../components/auth/withAuth';
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { usePathname } from 'next/navigation';
import { 
  FiGrid, 
  FiPackage, 
  FiShoppingCart, 
  FiUsers, 
  FiSettings, 
  FiMenu, 
  FiX, 
  FiChevronDown, 
  FiArchive, 
  FiMessageSquare,
  FiPieChart,
  FiLayers,
  FiSearch,
  FiBell,
  FiLayout
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import Image from 'next/image';
import clsx from 'clsx';

function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const { user, logout } = useAuth();
    const pathname = usePathname();

    const navSections = [
        {
            title: "Insights",
            links: [
                { href: "/admin", icon: <FiPieChart />, label: "Overview" },
            ]
        },
        {
            title: "Catalog",
            links: [
                { href: "/admin/products", icon: <FiPackage />, label: "Products" },
                { href: "/admin/products/archived", icon: <FiArchive />, label: "Archived" },
                { href: "/admin/categories", icon: <FiLayers />, label: "Categories" },
            ]
        },
        {
            title: "Operations",
            links: [
                { href: "/admin/orders", icon: <FiShoppingCart />, label: "Orders" },
                { href: "/admin/support", icon: <FiMessageSquare />, label: "Support Chat" },
            ]
        },
        {
            title: "System",
            links: [
                { href: "/admin/users", icon: <FiUsers />, label: "User Management" },
                { href: "/admin/settings", icon: <FiSettings />, label: "Settings" },
            ]
        }
    ];

    useEffect(() => {
        setIsSidebarOpen(false);
    }, [pathname]);

    const isActive = (path: string) => pathname === path;

    return (
        <div className="flex min-h-screen bg-gray-50 text-gray-900 font-sans">
            {/* Mobile Sidebar Overlay */}
            <div
                className={clsx(
                    "fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-40 transition-opacity md:hidden",
                    isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
                )}
                onClick={() => setIsSidebarOpen(false)}
            />

            {/* Sidebar */}
            <aside className={clsx(
                "bg-[#0f172a] text-white w-72 fixed inset-y-0 left-0 transform transition-all duration-300 ease-in-out z-50 md:relative md:translate-x-0 flex flex-col shadow-2xl",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Sidebar Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#1e293b]/50">
                    <Link href="/admin" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-white/5 overflow-hidden">
                            <Image src="/logo.png" alt="logo" width={32} height={32} className="object-contain" />
                        </div>
                        <span className="text-xl font-black tracking-tight">TEMPLATESTORE <span className="text-blue-500">PRO</span></span>
                    </Link>
                    <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-white/50 hover:text-white p-1">
                        <FiX size={24} />
                    </button>
                </div>

                {/* Sidebar Navigation */}
                <nav className="flex-1 overflow-y-auto p-4 space-y-8 scrollbar-hide">
                    {navSections.map((section, idx) => (
                        <div key={idx} className="space-y-2">
                            <h3 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
                                {section.title}
                            </h3>
                            <div className="space-y-1">
                                {section.links.map(link => (
                                    <Link 
                                        key={link.href} 
                                        href={link.href} 
                                        className={clsx(
                                            "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 group",
                                            isActive(link.href) 
                                                ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20" 
                                                : "text-white/60 hover:bg-white/5 hover:text-white"
                                        )}
                                    >
                                        <span className={clsx(
                                            "text-lg",
                                            isActive(link.href) ? "text-white" : "text-white/40 group-hover:text-blue-400"
                                        )}>
                                            {link.icon}
                                        </span>
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-white/5 bg-[#1e293b]/20">
                    <div className="bg-[#1e293b] rounded-2xl p-4 border border-white/5">
                        <p className="text-[10px] text-white/30 font-black uppercase mb-3 tracking-widest">System Status</p>
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                            <span className="text-xs font-bold text-white/80">API CORE ONLINE</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* Professional Header */}
                <header className="bg-white border-b border-gray-100 px-4 md:px-8 py-4 flex justify-between items-center z-30 shadow-sm shadow-black/[0.02]">
                    <div className="flex items-center gap-4 flex-1">
                        <button 
                            onClick={() => setIsSidebarOpen(true)} 
                            className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            <FiMenu size={24} />
                        </button>
                        
                        {/* Internal Search Bar */}
                        <div className="hidden md:flex items-center bg-gray-100 rounded-xl px-4 py-2 w-full max-w-md group focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/10 border border-transparent focus-within:border-blue-500/20 transition-all">
                            <FiSearch className="text-gray-400 group-focus-within:text-blue-500" />
                            <input 
                                type="text" 
                                placeholder="Quick search..." 
                                className="bg-transparent border-none outline-none ml-3 text-sm w-full font-medium"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 md:gap-6">
                        {/* Notifications */}
                        <button className="relative p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                            <FiBell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button 
                                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} 
                                className="flex items-center gap-3 p-1.5 hover:bg-gray-50 rounded-2xl transition-all border border-transparent hover:border-gray-100"
                            >
                                <div className="w-9 h-9 rounded-xl overflow-hidden bg-blue-100 flex items-center justify-center text-blue-600 font-black text-xs shadow-inner">
                                    {user?.avatarUrl ? (
                                        <Image src={user.avatarUrl} alt="avatar" width={36} height={36} className="object-cover" />
                                    ) : user?.email?.[0].toUpperCase()}
                                </div>
                                <div className="hidden md:block text-left mr-2">
                                    <p className="text-xs font-black text-gray-900 leading-none">{user?.email?.split('@')[0]}</p>
                                    <p className="text-[10px] font-bold text-blue-600 uppercase mt-1 tracking-tighter">{user?.role}</p>
                                </div>
                                <FiChevronDown className={clsx("text-gray-400 transition-transform duration-200", isProfileMenuOpen && "rotate-180")} />
                            </button>

                            {isProfileMenuOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setIsProfileMenuOpen(false)} />
                                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="px-4 py-3 border-b border-gray-50 mb-1">
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Account</p>
                                            <p className="text-sm font-bold text-gray-900 truncate mt-1">{user?.email}</p>
                                        </div>
                                        <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-2 text-sm font-bold text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                                            <FiSettings /> Settings
                                        </Link>
                                        <button 
                                            onClick={logout} 
                                            className="w-full flex items-center gap-3 px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors mt-1"
                                        >
                                            <FiX /> Logout System
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Dynamic Content Area */}
                <main className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
                    <div className="p-4 md:p-8 max-w-[1920px] mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default withAuth(AdminLayout, ['ADMIN', 'SUPER_ADMIN']);
