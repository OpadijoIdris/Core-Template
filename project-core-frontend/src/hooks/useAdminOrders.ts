import { useEffect, useState, useCallback } from "react";
import { getAdminOrders, updateOrderStatus as updateOrderStatusApi, cancelOrder as cancelOrderApi } from "@/services/orderApi";
import { Order, OrderMeta } from "@/types/order";
import { toast } from "react-toastify";

export function useAdminOrders(initialFilters: any = {}) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({ page: 1, limit: 10, ...initialFilters });
  const [meta, setMeta] = useState<OrderMeta>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAdminOrders(filters);
      if (response.success) {
        setOrders(response.data.orders);
        setMeta(response.data.meta);
      } else {
        setError("Failed to fetch orders.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch orders. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateFilters = (newFilters: any) => {
    setFilters((prev: any) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const changePage = (page: number) => {
    setFilters((prev: any) => ({ ...prev, page }));
  };

  const updateStatus = async (orderId: string, status: any) => {
    try {
      const response = await updateOrderStatusApi(orderId, status);
      if (response.success) {
        toast.success("Order status updated successfully");
        fetchOrders();
      } else {
        toast.error(response.message || "Failed to update status");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error updating status");
    }
  };

  const cancelOrder = async (orderId: string) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    
    try {
      const response = await cancelOrderApi(orderId);
      if (response.success) {
        toast.success("Order cancelled successfully");
        fetchOrders();
      } else {
        toast.error(response.message || "Failed to cancel order");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error cancelling order");
    }
  };

  return { 
    orders, 
    loading, 
    error, 
    filters, 
    updateFilters, 
    meta, 
    changePage,
    refresh: fetchOrders,
    updateStatus,
    cancelOrder
  };
}
