"use client";

import { useDashboardAnalytics } from "./hooks/useDashboardAnalytics";
import { DashboardHeader } from "./components/DashboardHeader";
import { OverviewCards } from "./components/OverviewCards";
import { SalesTrendChart } from "./components/SalesTrendChart";
import { TopProductsCard } from "./components/TopProductsCard";
import { OrderStatusChart } from "./components/OrderStatusChart";
import { ProductPerformanceCard } from "./components/ProductPerformanceCard";
import { RecentActivitiesCard } from "./components/RecentActivitiesCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-12 w-12 rounded-xl bg-orange-100" />
        <div>
          <Skeleton className="h-6 w-40 mb-2 bg-orange-100" />
          <Skeleton className="h-4 w-60 bg-orange-100/70" />
        </div>
      </div>

      {/* Overview Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-6 border border-orange-200"
            >
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-8 w-8 rounded-lg bg-orange-100" />
                <Skeleton className="h-6 w-12 bg-orange-100" />
              </div>
              <Skeleton className="h-8 w-20 mb-2 bg-orange-100" />
              <Skeleton className="h-4 w-24 bg-orange-100/70" />
            </div>
          ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl p-6 border border-orange-200">
            <Skeleton className="h-6 w-32 mb-6 bg-orange-100" />
            <Skeleton className="h-80 w-full bg-orange-100/50" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-orange-200">
          <Skeleton className="h-6 w-32 mb-6 bg-orange-100" />
          <Skeleton className="h-64 w-full bg-orange-100/50" />
        </div>
      </div>

      {/* Bottom Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-6 border border-orange-200"
            >
              <Skeleton className="h-6 w-32 mb-6 bg-orange-100" />
              <div className="space-y-4">
                {Array(3)
                  .fill(0)
                  .map((_, j) => (
                    <div key={j} className="flex items-center gap-4">
                      <Skeleton className="h-12 w-12 rounded-lg bg-orange-100" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-full mb-2 bg-orange-100/80" />
                        <Skeleton className="h-3 w-2/3 bg-orange-100/60" />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const {
    analytics,
    loading,
    error,
    dateRange,
    updateDateRange,
    refreshAnalytics,
  } = useDashboardAnalytics();

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <DashboardSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <Alert variant="destructive" className="max-w-2xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <Alert className="max-w-2xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Info</AlertTitle>
          <AlertDescription>
            Data analitik tidak tersedia. Pastikan Anda memiliki toko yang
            aktif.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 max-w-7xl space-y-8">
      <DashboardHeader
        onRefresh={refreshAnalytics}
        loading={loading}
        dateRange={dateRange}
        onDateRangeChange={updateDateRange}
      />

      {/* Overview Cards */}
      <OverviewCards data={analytics.overview} />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Trend Chart - Takes 2/3 width */}
        <div className="lg:col-span-2 flex">
          <div className="w-full">
            <SalesTrendChart data={analytics.sales_trend} />
          </div>
        </div>

        {/* Order Status Chart - Takes 1/3 width */}
        <div className="flex">
          <div className="w-full">
            <OrderStatusChart data={analytics.order_status_distribution} />
          </div>
        </div>
      </div>

      {/* Product Performance - Full Width */}
      <ProductPerformanceCard data={analytics.product_performance} />

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Products */}
        <TopProductsCard data={analytics.top_products} />

        {/* Recent Activities */}
        <RecentActivitiesCard data={analytics.recent_activities} />
      </div>
    </div>
  );
}
