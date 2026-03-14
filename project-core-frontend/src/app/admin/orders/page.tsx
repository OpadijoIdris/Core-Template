"use client";

import React, { useState } from "react";
import { useAdminOrders } from "@/hooks/useAdminOrders";
import { 
  FiSearch, 
  FiFilter, 
  FiEye, 
  FiChevronLeft, 
  FiChevronRight,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiTruck,
  FiRefreshCw,
  FiX,
  FiShoppingBag,
  FiInfo,
  FiUser,
  FiRotateCcw
} from "react-icons/fi";
import { Order, OrderStatus, OrderAuditAction } from "@/types/order";
import { getAdminOrderById, getOrderAudit } from "@/services/orderApi";
import { toast } from "react-toastify";
import clsx from "clsx";

const AdminOrdersPage = () => {
  const { 
    orders, 
    loading, 
    error, 
    meta, 
    changePage, 
    updateFilters, 
    updateStatus, 
    cancelOrder,
    refresh 
  } = useAdminOrders({ limit: 10 });

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderAudit, setOrderAudit] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleViewDetails = async (orderId: string) => {
    try {
      setModalLoading(true);
      setIsModalOpen(true);
      const [orderRes, auditRes] = await Promise.all([
        getAdminOrderById(orderId),
        getOrderAudit(orderId)
      ]);

      if (orderRes.success) {
        setSelectedOrder(orderRes.data);
      }
      
      if (auditRes.success) {
        setOrderAudit(auditRes.audits);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error fetching order details");
      setIsModalOpen(false);
    } finally {
      setModalLoading(false);
    }
  };

  const getStatusStyles = (status: OrderStatus) => {
    switch (status) {
      case "PENDING": return "bg-yellow-50 text-yellow-700 border-yellow-100";
      case "PAID": return "bg-blue-50 text-blue-700 border-blue-100";
      case "FULFILLED": return "bg-green-50 text-green-700 border-green-100";
      case "CANCELLED": return "bg-red-50 text-red-700 border-red-100";
      default: return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "PENDING": return <FiClock />;
      case "PAID": return <FiCheckCircle />;
      case "FULFILLED": return <FiTruck />;
      case "CANCELLED": return <FiXCircle />;
      default: return null;
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: searchTerm });
  };

  return (
    <div className="space-y-10 pb-12">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full">Operations Core</div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Order Stream</span>
            </div>
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Order <span className="text-blue-600 italic">Logistics</span></h1>
          <p className="text-gray-500 font-bold mt-1">Track fulfillment cycles and manage transaction lifecycles.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => refresh()}
            className="p-4 bg-white border border-gray-200 rounded-2xl text-gray-500 hover:bg-gray-50 transition-all shadow-sm active:scale-95"
          >
            <FiRefreshCw className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Mini Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                <FiShoppingBag size={20} />
            </div>
            <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Orders</p>
                <p className="text-xl font-black text-gray-900">{meta.total}</p>
            </div>
        </div>
        {/* Additional Operational Stats can be added here */}
      </div>

      {/* Control Bar */}
      <div className="bg-white p-6 rounded-4xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center gap-6">
        <form onSubmit={handleSearchSubmit} className="flex-1 relative group">
          <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
          <input
            type="text"
            placeholder="Search by ID or customer email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all text-sm font-bold"
          />
        </form>

        <div className="flex items-center gap-4">
          <div className="relative group min-w-50">
            <FiFilter className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-blue-600 transition-colors" />
            <select
              onChange={(e) => updateFilters({ status: e.target.value || undefined })}
              className="w-full pl-12 pr-10 py-4 bg-gray-50 border border-transparent rounded-2xl appearance-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none cursor-pointer text-sm font-black uppercase tracking-widest text-gray-600 transition-all"
            >
              <option value="">Full Status View</option>
              <option value="PENDING">Pending</option>
              <option value="PAID">Paid</option>
              <option value="FULFILLED">Fulfilled</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-gray-100">
                <th className="px-8 py-6">Transaction ID</th>
                <th className="px-8 py-6">Customer Context</th>
                <th className="px-8 py-6 text-center">Volume</th>
                <th className="px-8 py-6">Financials</th>
                <th className="px-8 py-6">Logistic Status</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-8 py-8 bg-gray-50/20 h-20"></td>
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center flex flex-col items-center">
                    <FiShoppingBag className="w-12 h-12 text-gray-200 mb-4" />
                    <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No matching transactions</p>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-gray-900 font-mono">
                          #{order.id.slice(0, 8)}
                        </span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-1">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-black">
                            {order.user?.email?.[0].toUpperCase() || "A"}
                        </div>
                        <span className="text-sm font-bold text-gray-700">{order.user?.email || "Anonymous"}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="text-xs font-black text-gray-900 bg-gray-100 px-2 py-1 rounded-md">
                        {order.itemsCount} Items
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-black text-gray-900">
                        {order.currency} {Number(order.total).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span className={clsx(
                        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm",
                        getStatusStyles(order.status)
                      )}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button 
                        onClick={() => handleViewDetails(order.id)}
                        className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all"
                      >
                        <FiEye size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        <div className="p-6 border-t border-gray-100 bg-gray-50/30 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Showing <span className="text-gray-900">{(meta.page - 1) * meta.limit + 1}</span> to <span className="text-gray-900">{Math.min(meta.page * meta.limit, meta.total)}</span> of <span className="text-gray-900">{meta.total}</span> Global Entries
          </p>
          <div className="flex gap-2">
            <button 
              disabled={meta.page <= 1}
              onClick={() => changePage(meta.page - 1)}
              className="p-3 border border-gray-200 rounded-xl disabled:opacity-30 hover:bg-white transition-colors"
            >
              <FiChevronLeft />
            </button>
            <button 
              disabled={meta.page >= meta.totalPages}
              onClick={() => changePage(meta.page + 1)}
              className="p-3 border border-gray-200 rounded-xl disabled:opacity-30 hover:bg-white transition-colors"
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
      </div>

      {/* Executive Order Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <FiShoppingBag size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Order Dossier</h2>
                    <p className="text-xs font-bold text-gray-400 font-mono">ID: {selectedOrder?.id}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-2xl transition-all"
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-10 scrollbar-hide">
              {modalLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Retrieving Logistics Data...</p>
                </div>
              ) : selectedOrder && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Customer Entity</h3>
                      <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex items-center gap-4 shadow-inner">
                        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-blue-600 border border-gray-100">
                            <FiUser size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-black text-gray-900">{selectedOrder.user?.email}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">Primary Account Context</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Logistic Protocol</h3>
                      <div className="flex flex-col gap-4">
                         <span className={clsx(
                             "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border self-start shadow-sm",
                             getStatusStyles(selectedOrder.status)
                         )}>
                          {getStatusIcon(selectedOrder.status)}
                          {selectedOrder.status}
                        </span>
                        
                        <div className="flex flex-wrap gap-2">
                          {selectedOrder.status !== 'FULFILLED' && selectedOrder.status !== 'CANCELLED' && (
                            <button 
                              onClick={() => {
                                updateStatus(selectedOrder.id, 'FULFILLED');
                                setIsModalOpen(false);
                              }}
                              className="px-6 py-2.5 bg-green-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-green-700 transition-all shadow-lg shadow-green-500/20"
                            >
                              Finalize Fulfillment
                            </button>
                          )}
                          {selectedOrder.status !== 'CANCELLED' && selectedOrder.status !== 'FULFILLED' && (
                            <button 
                              onClick={() => {
                                cancelOrder(selectedOrder.id);
                                setIsModalOpen(false);
                              }}
                              className="px-6 py-2.5 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-xl border border-red-100 hover:bg-red-100 transition-all"
                            >
                              Initialize Cancellation
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Portfolio Items */}
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Transaction Contents</h3>
                    <div className="border border-gray-100 rounded-4xl overflow-hidden shadow-sm">
                      <table className="w-full text-left">
                        <thead className="bg-gray-50/80 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          <tr>
                            <th className="px-6 py-4">Item Catalog</th>
                            <th className="px-6 py-4">Unit Price</th>
                            <th className="px-6 py-4 text-center">Volume</th>
                            <th className="px-8 py-4 text-right">Net Value</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                          {selectedOrder.items?.map((item, idx) => (
                            <tr key={idx} className="bg-white hover:bg-gray-50/30 transition-colors">
                              <td className="px-6 py-5 text-gray-900 font-black">
                                {item.productName || item.product?.name || "Inventory Item"}
                              </td>
                              <td className="px-6 py-5 text-gray-500 font-bold">
                                {selectedOrder.currency} {Number(item.price).toLocaleString()}
                              </td>
                              <td className="px-6 py-5 text-center">
                                <span className="px-2 py-1 bg-gray-100 rounded text-xs font-black">{item.quantity}</span>
                              </td>
                              <td className="px-8 py-5 text-right text-gray-900 font-black">
                                {selectedOrder.currency} {(Number(item.price) * item.quantity).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-gray-50/50">
                          <tr>
                            <td colSpan={3} className="px-6 py-6 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Aggregate Total</td>
                            <td className="px-8 py-6 text-right text-2xl font-black text-blue-600 tracking-tighter">
                              {selectedOrder.currency} {Number(selectedOrder.total).toLocaleString()}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>

                  {/* Operational Timeline */}
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Operational Timeline</h3>
                    <div className="bg-gray-50/50 p-8 rounded-[2.5rem] border border-gray-100">
                        {orderAudit.length === 0 ? (
                            <p className="text-xs font-bold text-gray-400 uppercase italic">No telemetry data available for this transaction.</p>
                        ) : (
                            <div className="space-y-8">
                                {orderAudit.map((audit, idx) => (
                                    <div key={audit.id} className="relative flex gap-6 group">
                                        {idx !== orderAudit.length - 1 && (
                                            <div className="absolute left-4.75 top-10 w-0.5 h-[calc(100%+16px)] bg-gray-200" />
                                        )}
                                        <div className="relative z-10 w-10 h-10 rounded-2xl bg-white border-2 border-gray-100 flex items-center justify-center shadow-sm group-hover:border-blue-500 transition-colors">
                                            <FiActivity className="text-blue-600" />
                                        </div>
                                        <div className="flex-1 pt-1">
                                            <div className="flex justify-between items-center">
                                                <p className="text-sm font-black text-gray-900 uppercase tracking-tight">
                                                    {audit.action.replace(/_/g, ' ')}
                                                </p>
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                    {new Date(audit.createdAt).toLocaleTimeString()}
                                                </span>
                                            </div>
                                            <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">
                                                {new Date(audit.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </p>
                                            {audit.reason && (
                                                <div className="mt-3 p-3 bg-white rounded-xl border border-gray-100 text-xs text-gray-500 font-bold italic">
                                                    &ldquo;{audit.reason}&rdquo;
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                  </div>

                  {/* Financial Context */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Financial Gateway</h3>
                      <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 text-sm space-y-4 shadow-inner">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Provider</span>
                          <span className="font-black text-gray-900">{selectedOrder.payment_provider}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Net Status</span>
                          <span className={clsx(
                              "font-black uppercase text-[10px] px-2 py-1 rounded",
                              selectedOrder.payment_status === 'SUCCESS' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          )}>
                            {selectedOrder.payment_status}
                          </span>
                        </div>
                        {selectedOrder.payment_reference && (
                          <div className="pt-2">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Gateway Reference</span>
                            <div className="mt-2 p-3 bg-white border border-gray-100 rounded-xl font-mono text-[10px] text-gray-500 break-all shadow-sm">
                                {selectedOrder.payment_reference}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {selectedOrder.status === 'CANCELLED' && (
                       <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-red-400 uppercase tracking-[0.2em]">Deficit Resolution</h3>
                        <div className="bg-red-50/50 p-6 rounded-3xl border border-red-100 text-sm space-y-4 shadow-inner">
                           <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">Refund Status</span>
                            <span className="font-black text-red-700">{selectedOrder.refundStatus}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">Deficit Value</span>
                            <span className="font-black text-red-700">{selectedOrder.currency} {Number(selectedOrder.refundAmount || selectedOrder.total).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="p-8 border-t border-gray-100 bg-gray-50 sticky bottom-0 z-10 flex justify-end">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-10 py-4 bg-white border border-gray-200 text-gray-900 font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-gray-100 transition-all shadow-sm shadow-black/2"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Internal Activity Component
const FiActivity = ({ className }: { className?: string }) => (
    <svg className={className} stroke="currentColor" fill="none" strokeWidth="3" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
);

export default AdminOrdersPage;
