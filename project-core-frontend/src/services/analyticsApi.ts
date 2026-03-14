import axiosInstance from "@/lib/axios";
import { AnalyticsResponse, RevenueTrendsResponse } from "@/types/analytics";

export const getAdminAnalyticsOverview = async (): Promise<AnalyticsResponse> => {
  const res = await axiosInstance.get("/analytics/admin/overview");
  return res.data;
};

export const getRevenueTrends = async (filters: { year?: number; month?: number } = {}): Promise<RevenueTrendsResponse> => {
  const params = new URLSearchParams(filters as any).toString();
  const res = await axiosInstance.get(`/analytics/admin/revenue-trends?${params}`);
  return res.data;
};
