import { useState, useEffect, useCallback } from "react";
import axiosInstance from "@/lib/axios";
import { Order, OrderMeta } from "@/types/order";

export interface UserOrdersResponse {
  success: boolean;
  data: {
    orders: Order[];
    totalOrders: number;
    page: number;
    limit: number;
  };
}

export function useUserOrders(initialFilters: any = {}) {
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
      const params = new URLSearchParams(filters as any).toString();
      const res = await axiosInstance.get(`/order/me?${params}`);
      
      if (res.data.success) {
        setOrders(res.data.data.orders);
        setMeta({
          page: res.data.data.page,
          limit: res.data.data.limit,
          total: res.data.data.totalOrders,
          totalPages: Math.ceil(res.data.data.totalOrders / res.data.data.limit)
        });
        setError(null);
      } else {
        setError("Failed to fetch your orders.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Error fetching orders. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const changePage = (page: number) => {
    setFilters((prev: any) => ({ ...prev, page }));
  };

  const updateFilters = (newFilters: any) => {
    setFilters((prev: any) => ({ ...prev, ...newFilters, page: 1 }));
  };

  return { 
    orders, 
    loading, 
    error, 
    meta, 
    filters, 
    changePage, 
    updateFilters, 
    refresh: fetchOrders 
  };
}
