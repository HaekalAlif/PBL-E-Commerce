"use client";

import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import {
  DashboardStats,
  RevenueChartData,
  UserGrowthData,
  RecentActivity,
  OrderStatusDistribution,
  RegionalData,
  DashboardFilters,
} from "../types";

interface UseDashboardReturn {
  // Data states
  stats: DashboardStats | null;
  revenueChart: RevenueChartData[];
  userGrowth: UserGrowthData[];
  recentActivities: RecentActivity[];
  orderStatusDistribution: OrderStatusDistribution[];
  regionalData: RegionalData[];

  // Loading states
  loading: boolean;
  statsLoading: boolean;
  chartsLoading: boolean;

  // Error state
  error: string | null;

  // Filters
  filters: DashboardFilters;
  setFilters: (filters: DashboardFilters) => void;

  // Actions
  fetchStats: () => Promise<void>;
  fetchRevenueChart: () => Promise<void>;
  fetchUserGrowth: () => Promise<void>;
  fetchRecentActivities: () => Promise<void>;
  fetchOrderStatusDistribution: () => Promise<void>;
  fetchRegionalData: () => Promise<void>;
  refreshAll: () => Promise<void>;
}

export const useDashboard = (): UseDashboardReturn => {
  // Data states
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [revenueChart, setRevenueChart] = useState<RevenueChartData[]>([]);
  const [userGrowth, setUserGrowth] = useState<UserGrowthData[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>(
    []
  );
  const [orderStatusDistribution, setOrderStatusDistribution] = useState<
    OrderStatusDistribution[]
  >([]);
  const [regionalData, setRegionalData] = useState<RegionalData[]>([]);

  // Loading states
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [chartsLoading, setChartsLoading] = useState(false);

  // Error state
  const [error, setError] = useState<string | null>(null);

  // Filters state
  const [filters, setFilters] = useState<DashboardFilters>({
    period: "30",
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

  // API call helper
  const apiCall = async (endpoint: string, params?: Record<string, any>) => {
    try {
      const response = await axios.get(`${apiUrl}/admin/${endpoint}`, {
        params,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        withCredentials: true,
      });

      if (response.data.status === "success") {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "API call failed");
      }
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Unknown error occurred"
      );
    }
  };

  // Fetch dashboard stats
  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      setError(null);

      const data = await apiCall("dashboard/stats", { period: filters.period });
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch stats");
      console.error("Failed to fetch dashboard stats:", err);
    } finally {
      setStatsLoading(false);
    }
  }, [filters.period]);

  // Fetch revenue chart
  const fetchRevenueChart = useCallback(async () => {
    try {
      setChartsLoading(true);
      setError(null);

      const data = await apiCall("dashboard/revenue-chart", {
        period: filters.period,
      });
      setRevenueChart(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch revenue chart"
      );
      console.error("Failed to fetch revenue chart:", err);
    } finally {
      setChartsLoading(false);
    }
  }, [filters.period]);

  // Fetch user growth
  const fetchUserGrowth = useCallback(async () => {
    try {
      const data = await apiCall("dashboard/user-growth", {
        period:
          filters.period === "7" ? "6" : filters.period === "30" ? "12" : "24",
      });
      setUserGrowth(data);
    } catch (err) {
      console.error("Failed to fetch user growth:", err);
    }
  }, [filters.period]);

  // Fetch recent activities
  const fetchRecentActivities = useCallback(async () => {
    try {
      const data = await apiCall("dashboard/recent-activities", { limit: 10 });
      setRecentActivities(data);
    } catch (err) {
      console.error("Failed to fetch recent activities:", err);
    }
  }, []);

  // Fetch order status distribution
  const fetchOrderStatusDistribution = useCallback(async () => {
    try {
      const data = await apiCall("dashboard/order-status-distribution");
      setOrderStatusDistribution(data);
    } catch (err) {
      console.error("Failed to fetch order status distribution:", err);
    }
  }, []);

  // Fetch regional data
  const fetchRegionalData = useCallback(async () => {
    try {
      const data = await apiCall("dashboard/regional-data");
      setRegionalData(data);
    } catch (err) {
      console.error("Failed to fetch regional data:", err);
    }
  }, []);

  // Fetch all data
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await Promise.all([
        fetchStats(),
        fetchRevenueChart(),
        fetchUserGrowth(),
        fetchRecentActivities(),
        fetchOrderStatusDistribution(),
        fetchRegionalData(),
      ]);
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [
    fetchStats,
    fetchRevenueChart,
    fetchUserGrowth,
    fetchRecentActivities,
    fetchOrderStatusDistribution,
    fetchRegionalData,
  ]);

  // Refresh all data
  const refreshAll = useCallback(async () => {
    await fetchAllData();
  }, [fetchAllData]);

  // Initial load and when filters change
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData, filters]);

  return {
    // Data
    stats,
    revenueChart,
    userGrowth,
    recentActivities,
    orderStatusDistribution,
    regionalData,

    // Loading states
    loading,
    statsLoading,
    chartsLoading,

    // Error
    error,

    // Filters
    filters,
    setFilters,

    // Actions
    refreshAll,
  };
};
