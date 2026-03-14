import { useState, useEffect, useCallback } from "react";
import { getAdminAnalyticsOverview } from "@/services/analyticsApi";
import { AnalyticsData } from "@/types/analytics";

export function useAdminAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAdminAnalyticsOverview();
      if (response.success) {
        setAnalytics(response.data);
        setError(null);
      } else {
        setError("Failed to fetch analytics");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch analytics");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return { analytics, loading, error, refresh: fetchAnalytics };
}
