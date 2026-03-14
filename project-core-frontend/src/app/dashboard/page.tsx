"use client";

import { useAuth } from '../../context/AuthContext';
import { useUserOrders } from '@/hooks/useUserOrders';
import { 
  FiPackage, 
  FiShoppingCart, 
  FiClock, 
  FiCheckCircle, 
  FiUser, 
  FiSettings,
  FiArrowRight
} from 'react-icons/fi';
import Link from 'next/link';
import React from 'react';

const StatCard = ({ icon, title, value, colorClass }: { 
  icon: React.ReactNode, 
  title: string, 
  value: string | number,
  colorClass?: string 
}) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
                <div className={`${colorClass || 'bg-gray-100 text-gray-600'} p-3 rounded-lg`}>
                    {icon}
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <p className="text-xl font-bold text-gray-900 mt-1">{value}</p>
                </div>
            </div>
        </div>
    );
};

const UserDashboardPage = () => {
  const { user } = useAuth();
  const { orders, loading, meta } = useUserOrders({ limit: 5 });

  const activeOrders = orders.filter(o => o.status !== 'FULFILLED' && o.status !== 'CANCELLED').length;
  const completedOrders = orders.filter(o => o.status === 'FULFILLED').length;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold shadow-sm">
            {user?.email?.[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
            <p className="text-gray-500 font-medium">{user?.email}</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Link 
            href="/dashboard/settings"
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <FiSettings /> Account Settings
          </Link>
          <Link 
            href="/products"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            <FiShoppingCart /> Continue Shopping
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard 
          icon={<FiPackage className="h-6 w-6" />}
          title="Total Orders"
          value={meta.total}
          colorClass="bg-blue-50 text-blue-600"
        />
        <StatCard 
          icon={<FiClock className="h-6 w-6" />}
          title="Active Orders"
          value={activeOrders}
          colorClass="bg-yellow-50 text-yellow-600"
        />
        <StatCard 
          icon={<FiCheckCircle className="h-6 w-6" />}
          title="Completed"
          value={completedOrders}
          colorClass="bg-green-50 text-green-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
            <h3 className="font-bold text-gray-900">Recent Orders</h3>
            <Link href="/dashboard/orders" className="text-sm font-semibold text-blue-600 hover:underline flex items-center gap-1">
              View all <FiArrowRight />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400 text-xs font-semibold uppercase tracking-wider bg-gray-50/30 border-b">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {loading ? (
                   Array(3).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={4} className="px-6 py-6 bg-gray-50/20"></td>
                    </tr>
                  ))
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                      No orders found yet.
                    </td>
                  </tr>
                ) : (
                  orders.slice(0, 5).map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs font-medium">#{order.id.slice(0, 8)}</td>
                      <td className="px-6 py-4 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          order.status === 'FULFILLED' ? 'bg-green-50 text-green-600 border border-green-100' :
                          order.status === 'CANCELLED' ? 'bg-red-50 text-red-600 border border-red-100' :
                          'bg-yellow-50 text-yellow-600 border border-yellow-100'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-gray-900">
                        {order.currency} {Number(order.total).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Profile Info / Quick Links */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-6">Profile Summary</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FiUser className="text-gray-400" />
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Account Role</p>
                  <p className="text-sm font-semibold text-gray-700">Customer</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FiCheckCircle className="text-green-500" />
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Account Status</p>
                  <p className="text-sm font-semibold text-green-600">Verified</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-xl text-white shadow-lg shadow-blue-200">
            <h3 className="font-bold text-lg mb-2">Need Help?</h3>
            <p className="text-blue-100 text-sm mb-6 leading-relaxed">
              Having issues with an order? Our support team is here to help you 24/7.
            </p>
            <button className="w-full py-2.5 bg-white/20 backdrop-blur-md text-white font-bold rounded-lg hover:bg-white/30 transition-all text-sm">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardPage;
