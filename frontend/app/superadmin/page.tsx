"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

// Import dashboard components
import DashboardStats from "./dashboard/components/DashboardStats";
import DashboardFilters from "./dashboard/components/DashboardFilters";
import RevenueChart from "./dashboard/components/RevenueChart";
import UserGrowthChart from "./dashboard/components/UserGrowthChart";
import RecentActivitiesCard from "./dashboard/components/RecentActivitiesCard";
import OrderStatusChart from "./dashboard/components/OrderStatusChart";
import RegionalDataCard from "./dashboard/components/RegionalDataCard";

// Import hooks
import { useDashboard } from "./dashboard/hooks/useDashboard";

export default function DashboardPage() {
  const {
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
  } = useDashboard();

  return (
    <div className="container mx-auto px-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor and analyze your e-commerce platform performance
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Dashboard Filters */}
      <DashboardFilters
        filters={filters}
        onFiltersChange={setFilters}
        onRefresh={refreshAll}
        loading={loading}
      />

      {/* Dashboard Stats Overview */}
      {stats && <DashboardStats stats={stats} loading={statsLoading} />}

      {/* Charts Row - Main Analytics */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueChart data={revenueChart} loading={chartsLoading} />
        <UserGrowthChart data={userGrowth} loading={chartsLoading} />
      </div>

      {/* Content Grid - Balanced 3-column layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Order Status Chart */}
        <OrderStatusChart data={orderStatusDistribution} loading={loading} />

        {/* Recent Activities */}
        <RecentActivitiesCard activities={recentActivities} loading={loading} />

        {/* Regional Data */}
        <RegionalDataCard data={regionalData} loading={loading} />
      </div>
    </div>
  );
}
