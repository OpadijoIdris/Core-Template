"use client";

import withAuth from '../../components/auth/withAuth';
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React from "react";
import { 
  FiGrid, 
  FiPackage, 
  FiSettings, 
  FiLogOut,
  FiHome,
  FiShoppingCart,
  FiMessageSquare
} from "react-icons/fi";
import { useAuth } from '@/context/AuthContext';

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout } = useAuth();

  const navItems = [
    { href: "/dashboard", label: "Overview", icon: <FiGrid /> },
    { href: "/dashboard/orders", label: "My Orders", icon: <FiPackage /> },
    { href: "/dashboard/support", label: "Support Chat", icon: <FiMessageSquare /> },
    { href: "/dashboard/settings", label: "Settings", icon: <FiSettings /> },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-100 flex flex-col sticky top-0 h-auto md:h-screen">
        <div className="p-8">
          <Link href="/" className="flex items-center gap-2 group">
            <Image 
              src="/logo.png" 
              alt="logo" 
              width={32} 
              height={32} 
              className="object-contain group-hover:scale-110 transition-all" 
            />
            <span className="text-xl font-black text-[#0f172a] tracking-tighter">TEMPLATESTORE</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive(item.href)
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          ))}
          
          <div className="pt-8 border-t border-gray-100 mt-8">
            <Link
              href="/products"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
            >
              <span className="text-lg"><FiShoppingCart /></span>
              Return to Shop
            </Link>
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-all duration-200 mt-2"
            >
              <span className="text-lg"><FiLogOut /></span>
              Logout
            </button>
          </div>
        </nav>

        <div className="p-6">
          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-semibold text-gray-700 uppercase">Online</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-y-auto bg-gray-50/50">
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

export default withAuth(DashboardLayout, ['USER', 'ADMIN', 'SUPER_ADMIN', 'SUB_ADMIN']);
