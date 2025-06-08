import { useState, useEffect } from "react";
import { AnalyticsData, DateRange } from "../types";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";

export const useDashboardAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>({
    start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    end_date: new Date().toISOString().split("T")[0],
  });

  const fetchAnalytics = async (customDateRange?: DateRange) => {
    try {
      setLoading(true);
      setError(null);

      const params = customDateRange || dateRange;
      const response = await axiosInstance.get("/api/seller/analytics", {
        params,
        withCredentials: true,
      });

      if (response.data.status === "success") {
        setAnalytics(response.data.data);
      } else {
        throw new Error(response.data.message || "Failed to fetch analytics");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to load analytics data";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateDateRange = (newDateRange: DateRange) => {
    setDateRange(newDateRange);
    fetchAnalytics(newDateRange);
  };

  const refreshAnalytics = () => {
    fetchAnalytics();
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return {
    analytics,
    loading,
    error,
    dateRange,
    updateDateRange,
    refreshAnalytics,
  };
};
