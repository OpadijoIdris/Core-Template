"use client";

import React, { useState } from "react";
import { useUserOrders } from "@/hooks/useUserOrders";
import { 
  FiPackage, 
  FiClock, 
  FiCheckCircle, 
  FiXCircle, 
  FiTruck, 
  FiEye,
  FiChevronLeft,
  FiChevronRight,
  FiRefreshCw,
  FiX,
  FiInfo,
  FiDollarSign,
  FiRotateCcw,
  FiMessageSquare
} from "react-icons/fi";
import { Order, OrderStatus, OrderAudit, OrderAuditAction } from "@/types/order";
import axiosInstance from "@/lib/axios";
import { toast } from "react-toastify";
import Link from 'next/link';

const UserOrdersPage = () => {
  const { orders, loading, error, meta, changePage, refresh } = useUserOrders();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderAudit, setOrderAudit] = useState<OrderAudit[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const handleViewDetails = async (orderId: string) => {
    try {
      setModalLoading(true);
      setIsModalOpen(true);
      const [orderRes, auditRes] = await Promise.all([
        axiosInstance.get(`/order/me/${orderId}`),
        axiosInstance.get(`/order/me/${orderId}/audit`)
      ]);

      if (orderRes.data.success) {
        setSelectedOrder(orderRes.data.data);
      }
      
      if (auditRes.data.success) {
        setOrderAudit(auditRes.data.audits);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error fetching order details");
      setIsModalOpen(false);
    } finally {
      setModalLoading(false);
    }
  };

  const getAuditIcon = (action: OrderAuditAction) => {
    switch (action) {
      case 'ORDER_CREATED': return <FiPackage className="text-blue-500" />;
      case 'PAYMENT_CONFIRMED': return <FiCheckCircle className="text-green-500" />;
      case 'ORDER_FULFILLED': return <FiTruck className="text-purple-500" />;
      case 'ORDER_CANCELLED': return <FiXCircle className="text-red-500" />;
      case 'REFUND_SUCCESS': return <FiRotateCcw className="text-green-600" />;
      default: return <FiInfo className="text-gray-400" />;
    }
  };

  const formatAuditAction = (action: string) => {
    return action.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const getStatusColor = (status: OrderStatus) => {
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
      case "PENDING": return <FiClock className="w-3.5 h-3.5" />;
      case "PAID": return <FiCheckCircle className="w-3.5 h-3.5" />;
      case "FULFILLED": return <FiTruck className="w-3.5 h-3.5" />;
      case "CANCELLED": return <FiXCircle className="w-3.5 h-3.5" />;
      default: return null;
    }
  };

  if (error) {
    return (
      <div className="p-8 text-center bg-red-50 border border-red-100 rounded-xl">
        <FiXCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-700 font-medium">{error}</p>
        <button onClick={() => refresh()} className="mt-4 text-blue-600 hover:underline flex items-center justify-center gap-2 mx-auto">
          <FiRefreshCw /> Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-500 text-sm mt-1">Track and manage your order history.</p>
        </div>
        <button 
          onClick={() => refresh()} 
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
        >
          <FiRefreshCw className={loading ? 'animate-spin' : ''} /> Refresh Orders
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/80 text-gray-500 text-xs font-semibold uppercase tracking-wider">
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Total</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading && orders.length === 0 ? (
                Array(4).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-6 py-8 h-20 bg-gray-50/20"></td>
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <FiPackage className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                    <p>You haven&apos;t placed any orders yet.</p>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-gray-900 font-medium">
                      #{order.id.slice(0, 8)}...
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-bold text-gray-900">
                        {order.currency} {Number(order.total).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleViewDetails(order.id)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <FiEye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
            <p className="text-sm text-gray-500">
              Showing page <span className="font-medium">{meta.page}</span> of <span className="font-medium">{meta.totalPages}</span>
            </p>
            <div className="flex gap-2">
              <button 
                disabled={meta.page <= 1}
                onClick={() => changePage(meta.page - 1)}
                className="p-2 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-white transition-colors"
              >
                <FiChevronLeft />
              </button>
              <button 
                disabled={meta.page >= meta.totalPages}
                onClick={() => changePage(meta.page + 1)}
                className="p-2 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-white transition-colors"
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order Details Modal (Reuse structure from admin) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Order Information</h2>
                <p className="text-sm text-gray-500">Track and view order items</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {modalLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : selectedOrder && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">Current Status</p>
                      <span className={`inline-flex items-center gap-2 px-3 py-1 mt-2 rounded-full text-sm font-bold border ${getStatusColor(selectedOrder.status)}`}>
                        {getStatusIcon(selectedOrder.status)}
                        {selectedOrder.status}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 uppercase font-semibold">Order Total</p>
                      <p className="text-xl font-bold text-blue-600 mt-1">
                        {selectedOrder.currency} {Number(selectedOrder.total).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Link 
                      href={`/dashboard/support?orderId=${selectedOrder.id}`}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-50 text-blue-600 rounded-xl font-bold hover:bg-blue-100 transition-all border border-blue-100"
                    >
                      <FiMessageSquare /> Chat about this order
                    </Link>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-bold text-gray-900">Purchased Items</h3>
                    <div className="border border-gray-100 rounded-xl overflow-hidden">
                      <table className="w-full text-left">
                        <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                          <tr>
                            <th className="px-4 py-3">Product</th>
                            <th className="px-4 py-3 text-center">Qty</th>
                            <th className="px-4 py-3 text-right">Price</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                          {selectedOrder.items?.map((item, idx) => (
                            <tr key={idx}>
                              <td className="px-4 py-4 text-gray-900 font-medium">
                                {item.productName || item.product?.name || "Product"}
                              </td>
                              <td className="px-4 py-4 text-center text-gray-500">{item.quantity}</td>
                              <td className="px-4 py-4 text-right text-gray-900 font-semibold">
                                {selectedOrder.currency} {Number(item.price).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-xs text-gray-500 uppercase font-bold mb-1">Payment Method</p>
                      <p className="text-sm text-gray-900">{selectedOrder.payment_provider}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-xs text-gray-500 uppercase font-bold mb-1">Order Placed On</p>
                      <p className="text-sm text-gray-900">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Order Tracking Timeline */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                      <FiClock className="text-blue-600" /> Order Tracking History
                    </h3>
                    <div className="bg-gray-50/50 rounded-2xl border border-gray-100 p-6">
                      {orderAudit.length === 0 ? (
                        <p className="text-sm text-gray-500 italic">No tracking information available.</p>
                      ) : (
                        <div className="space-y-6">
                          {orderAudit.map((audit, index) => (
                            <div key={audit.id} className="relative flex gap-4">
                              {/* Connector line */}
                              {index !== orderAudit.length - 1 && (
                                <div className="absolute left-3.75 top-8 min-w-0.5 h-[calc(100%+8px)] bg-gray-200" />
                              )}
                              
                              <div className="relative z-10 w-8 h-8 rounded-full bg-white border-2 border-gray-100 flex items-center justify-center shadow-sm">
                                {getAuditIcon(audit.action)}
                              </div>
                              
                              <div className="flex-1 pb-2">
                                <div className="flex justify-between items-start">
                                  <p className="text-sm font-bold text-gray-900">
                                    {formatAuditAction(audit.action)}
                                  </p>
                                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                    {new Date(audit.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-0.5">
                                  {new Date(audit.createdAt).toLocaleDateString(undefined, { 
                                    month: 'short', 
                                    day: 'numeric', 
                                    year: 'numeric' 
                                  })}
                                </p>
                                {audit.reason && (
                                  <p className="text-xs text-gray-400 italic mt-1 bg-white p-2 rounded border border-gray-50">
                                    &ldquo;{audit.reason}&rdquo;
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 bg-white border border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserOrdersPage;
