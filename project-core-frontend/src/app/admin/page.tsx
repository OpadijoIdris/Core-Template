"use client";

import { useAuth } from '../../context/AuthContext';
import { useAdminAnalytics } from '@/hooks/useAdminAnalytics';
import { useRevenueTrends } from '@/hooks/useRevenueTrends';
import { 
  FiShoppingCart, 
  FiPackage, 
  FiMessageSquare, 
  FiAlertTriangle, 
  FiTrendingUp,
  FiRefreshCw,
  FiArrowUpRight,
  FiArrowDownRight,
  FiActivity,
  FiClock,
  FiPlus,
  FiLoader
} from 'react-icons/fi';
import React, { useState } from 'react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import Link from 'next/link';
import Guidance from '@/components/Guidance';

const MetricCard = ({ icon, title, value, subValue, trend, trendValue, colorClass, guidance }: { 
  icon: React.ReactNode, 
  title: string, 
  value: string | number,
  subValue?: string,
  trend?: 'up' | 'down',
  trendValue?: string,
  colorClass: string,
  guidance?: string
}) => {
    return (
        <div className="bg-white p-8 rounded-4xl shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 group overflow-hidden relative">
            <div className={`absolute top-0 right-0 w-32 h-32 ${colorClass} opacity-[0.03] rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500`}></div>
            
            <div className="flex items-start justify-between relative z-10">
                <div className="space-y-4">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{title}</span>
                          {guidance && <Guidance message={guidance} position="right" />}
                        </div>
                        <h3 className="text-3xl font-black text-gray-900 tracking-tight">{value}</h3>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        {trend && (
                            <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                                trend === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                            }`}>
                                {trend === 'up' ? <FiArrowUpRight /> : <FiArrowDownRight />}
                                {trendValue}
                            </div>
                        )}
                        <span className="text-xs font-bold text-gray-400">{subValue}</span>
                    </div>
                </div>
                
                <div className={`p-4 rounded-2xl ${colorClass} shadow-lg shadow-current/10 group-hover:scale-110 transition-all duration-300`}>
                    <div className="text-white">
                        {React.cloneElement(
                          icon as React.ReactElement<{ className?: string }>,
                          { className: "w-6 h-6" }
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const AdminDashboardPage = () => {
    const { user } = useAuth();
    const { analytics, loading: analyticsLoading, refresh: refreshAnalytics } = useAdminAnalytics();
    const { data: trendData, loading: trendLoading, updateFilters } = useRevenueTrends();

    const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
    const [selectedMonth, setSelectedMonth] = useState<string>("");

    const handleFilterChange = (year: string, month: string) => {
      setSelectedYear(year);
      setSelectedMonth(month);
      updateFilters({ 
        year: year ? parseInt(year) : undefined, 
        month: month ? parseInt(month) : undefined 
      });
    };

    if (analyticsLoading) {
        return (
            <div className="flex items-center justify-center min-h-150">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Hydrating Core Engine...</p>
                </div>
            </div>
        );
    }

    const currency = "NGN";
    const years = ["2024", "2025", "2026"];
    const months = [
      { label: "January", value: "1" }, { label: "February", value: "2" },
      { label: "March", value: "3" }, { label: "April", value: "4" },
      { label: "May", value: "5" }, { label: "June", value: "6" },
      { label: "July", value: "7" }, { label: "August", value: "8" },
      { label: "September", value: "9" }, { label: "October", value: "10" },
      { label: "November", value: "11" }, { label: "December", value: "12" }
    ];

    return (
        <div className="space-y-10">
            {/* Top Bar with Dynamic Welcome */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full">TemplateStore Core v1.0</div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mt-0.5">Live Operational Mode</span>
                        </div>
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Executive <span className="text-blue-600 italic">Overview</span></h1>
                    <p className="text-gray-500 font-bold mt-1">Analyzing real-time performance for {user?.email}</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                    <button 
                        onClick={() => refreshAnalytics()}
                        className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-black text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm active:scale-95"
                    >
                        <FiRefreshCw className={analyticsLoading ? 'animate-spin' : ''} /> Refresh Data
                    </button>
                    <Link 
                        href="/admin/products/create"
                        className="flex items-center gap-2 px-6 py-3 bg-[#0f172a] text-white rounded-2xl text-sm font-black hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/10 active:scale-95"
                    >
                        <FiPlus /> New Product
                    </Link>
                </div>
            </div>

            {/* Premium Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-6">
                <MetricCard 
                    icon={<FiActivity />}
                    title="Gross Revenue"
                    value={`${currency} ${Number(analytics?.revenue.total || 0).toLocaleString()}`}
                    subValue={`Today: +${Number(analytics?.revenue.today || 0).toLocaleString()}`}
                    trend="up"
                    trendValue="12.5%"
                    colorClass="bg-blue-600"
                    guidance="Total earnings from successfully completed and paid transactions."
                />
                <MetricCard 
                    icon={<FiClock />}
                    title="Projected POD"
                    value={`${currency} ${Number(analytics?.revenue.projected || 0).toLocaleString()}`}
                    subValue="Cash out for delivery"
                    colorClass="bg-emerald-600"
                    guidance="Estimated cash to be collected from Pay on Delivery orders currently in transit."
                />
                <MetricCard 
                    icon={<FiShoppingCart />}
                    title="Net Volume"
                    value={analytics?.orders.total || 0}
                    subValue={`${analytics?.orders.status.PAID || 0} Settlements`}
                    trend="up"
                    trendValue="+4"
                    colorClass="bg-indigo-600"
                    guidance="Total number of orders processed in the system, including paid and pending."
                />
                <MetricCard 
                    icon={<FiPackage />}
                    title="Stock Criticality"
                    value={analytics?.inventory.outOfStock || 0}
                    subValue={`${analytics?.inventory.lowStock || 0} Alert Items`}
                    trend="down"
                    trendValue="High"
                    colorClass="bg-orange-600"
                    guidance="Number of products that are currently out of stock or reaching low threshold."
                />
                <MetricCard 
                    icon={<FiMessageSquare />}
                    title="Inbound Support"
                    value={analytics?.chat.openConversations || 0}
                    subValue="Active Live Sessions"
                    colorClass="bg-purple-600"
                    guidance="Active customer support chat sessions waiting for response."
                />
            </div>

            {/* Main Visuals Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Growth - Full Width on tablet, 2/3 on desktop */}
                <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
                                <FiActivity className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-gray-900 tracking-tight">Revenue Dynamics</h3>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">Financial Growth Analytics</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-100 shadow-inner">
                            <select 
                                value={selectedYear}
                                onChange={(e) => handleFilterChange(e.target.value, selectedMonth)}
                                className="bg-transparent text-xs font-black text-gray-600 outline-none px-3 py-1.5 cursor-pointer appearance-none hover:text-blue-600 transition-colors"
                            >
                                {years.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                            <span className="text-gray-300 font-thin">|</span>
                            <select 
                                value={selectedMonth}
                                onChange={(e) => handleFilterChange(selectedYear, e.target.value)}
                                className="bg-transparent text-xs font-black text-gray-600 outline-none px-3 py-1.5 cursor-pointer appearance-none hover:text-blue-600 transition-colors"
                            >
                                <option value="">Entire Period</option>
                                {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="h-100 w-full mt-auto">
                        {trendLoading ? (
                            <div className="h-full w-full flex items-center justify-center bg-gray-50/50 rounded-4xl border border-dashed border-gray-200">
                                <div className="flex flex-col items-center gap-3">
                                    <FiLoader className="w-8 h-8 animate-spin text-blue-600" />
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Processing Dataset...</p>
                                </div>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorRevPremium" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15}/>
                                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="10 10" vertical={false} stroke="#f1f5f9" />
                                    <XAxis 
                                        dataKey="label" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800}}
                                        dy={15}
                                    />
                                    <YAxis 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800}}
                                        tickFormatter={(value) => `${currency} ${value >= 1000 ? value/1000 + 'k' : value}`}
                                    />
                                    <Tooltip 
                                        contentStyle={{ 
                                            borderRadius: '24px', 
                                            border: '1px solid #f1f5f9', 
                                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
                                            padding: '16px'
                                        }}
                                        itemStyle={{ fontSize: '12px', fontWeight: 900, color: '#1e293b' }}
                                        labelStyle={{ fontSize: '10px', fontWeight: 900, color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase' }}
                                        formatter={(value: any) => [`${currency} ${Number(value).toLocaleString()}`, 'NET REVENUE']}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="revenue" 
                                        stroke="#2563eb" 
                                        strokeWidth={4}
                                        fillOpacity={1} 
                                        fill="url(#colorRevPremium)" 
                                        animationDuration={1500}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Operations Queue / Secondary Data */}
                <div className="space-y-8">
                    {/* Status Breakdown */}
                    <div className="bg-[#0f172a] text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 text-white/5 group-hover:scale-110 transition-transform">
                            <FiActivity size={120} />
                        </div>
                        
                        <h3 className="text-lg font-black tracking-tight mb-8 relative z-10 flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            Transaction Pulse
                        </h3>
                        
                        <div className="space-y-5 relative z-10">
                            {[
                                { label: 'Pending', count: analytics?.orders.status.PENDING, color: 'bg-yellow-400', pct: '20%' },
                                { label: 'Settled', count: analytics?.orders.status.PAID, color: 'bg-blue-400', pct: '65%' },
                                { label: 'Fulfilled', count: analytics?.orders.status.FULFILLED, color: 'bg-green-400', pct: '10%' },
                                { label: 'Cancelled', count: analytics?.orders.status.CANCELLED, color: 'bg-red-400', pct: '5%' },
                            ].map((item) => (
                                <div key={item.label} className="space-y-2">
                                    <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest">
                                        <span className="text-white/50">{item.label}</span>
                                        <span>{item.count || 0}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className={`h-full ${item.color} rounded-full transition-all duration-1000`} style={{ width: item.count ? '100%' : '0%' }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Access Card */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative group overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform duration-500"></div>
                        <h3 className="text-lg font-black text-gray-900 tracking-tight mb-4 relative z-10">Operational Shortcuts</h3>
                        <div className="grid grid-cols-2 gap-3 relative z-10">
                            <Link href="/admin/orders" className="p-4 bg-gray-50 hover:bg-blue-50 rounded-2xl text-center group/btn transition-all border border-transparent hover:border-blue-100">
                                <FiShoppingCart className="mx-auto mb-2 text-gray-400 group-hover/btn:text-blue-600 transition-colors" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover/btn:text-blue-600">Ship Orders</span>
                            </Link>
                            <Link href="/admin/support" className="p-4 bg-gray-50 hover:bg-blue-50 rounded-2xl text-center group/btn transition-all border border-transparent hover:border-blue-100">
                                <FiMessageSquare className="mx-auto mb-2 text-gray-400 group-hover/btn:text-blue-600 transition-colors" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover/btn:text-blue-600">Reply Chat</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
