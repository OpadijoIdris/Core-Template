import axiosInstance from "@/lib/axios";
import { AdminOrdersResponse, AdminSingleOrderResponse, OrderStatus } from "@/types/order";

export const getAdminOrders = async (filters: any = {}): Promise<AdminOrdersResponse> => {
  const params = new URLSearchParams(filters).toString();
  const res = await axiosInstance.get(`/order/admin/all?${params}`);
  return res.data;
};

export const getAdminOrderById = async (orderId: string): Promise<AdminSingleOrderResponse> => {
  const res = await axiosInstance.get(`/order/admin/${orderId}`);
  return res.data;
};

export const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
  const res = await axiosInstance.patch(`/order/admin/${orderId}`, { status });
  return res.data;
};

export const cancelOrder = async (orderId: string) => {
  const res = await axiosInstance.patch(`/order/admin/cancel/${orderId}`);
  return res.data;
};

export const getOrderAudit = async (orderId: string) => {
  const res = await axiosInstance.get(`/order/admin/${orderId}/audit`);
  return res.data;
};
