import { useState, useEffect, useCallback } from "react";
import { getRevenueTrends } from "@/services/analyticsApi";
import { RevenueTrendPoint } from "@/types/analytics";

export function useRevenueTrends() {
  const [data, setData] = useState<RevenueTrendPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<{ year?: number; month?: number }>({});

  const fetchTrends = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getRevenueTrends(filters);
      if (response.success) {
        setData(response.data);
        setError(null);
      } else {
        setError("Failed to fetch revenue trends");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch revenue trends");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTrends();
  }, [fetchTrends]);

  const updateFilters = (newFilters: { year?: number; month?: number }) => {
    setFilters(newFilters);
  };

  return { data, loading, error, filters, updateFilters, refresh: fetchTrends };
}
