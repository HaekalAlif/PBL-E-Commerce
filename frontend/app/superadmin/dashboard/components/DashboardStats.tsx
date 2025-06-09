import React from "react";
import { Card } from "@/components/ui/card";
import {
  Users,
  Store,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Clock,
  FileX,
} from "lucide-react";
import { DashboardStats as DashboardStatsType } from "../types";
import { formatRupiah } from "@/lib/formatter";

interface DashboardStatsProps {
  stats: DashboardStatsType;
  loading?: boolean;
}

export default function DashboardStats({
  stats,
  loading,
}: DashboardStatsProps) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="p-6">
            <div className="animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  const formatGrowthPercentage = (percentage: number) => {
    const isPositive = percentage >= 0;
    const Icon = isPositive ? TrendingUp : TrendingDown;
    const colorClass = isPositive ? "text-green-600" : "text-red-600";

    return (
      <div className={`flex items-center gap-1 text-sm ${colorClass}`}>
        <Icon className="w-4 h-4" />
        <span>{Math.abs(percentage).toFixed(1)}%</span>
      </div>
    );
  };

  return (
    <div className="space-y-6 mb-6">
      {/* Main Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Users */}
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Total Users</p>
              <h3 className="text-2xl font-bold">
                {stats.overview.total_users.toLocaleString()}
              </h3>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              This month: +{stats.growth.new_users_this_month}
            </span>
            {formatGrowthPercentage(stats.growth.user_growth_percentage)}
          </div>
        </Card>

        {/* Total Stores */}
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Store className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Total Stores</p>
              <h3 className="text-2xl font-bold">
                {stats.overview.total_stores.toLocaleString()}
              </h3>
            </div>
          </div>
        </Card>

        {/* Total Products */}
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Total Products</p>
              <h3 className="text-2xl font-bold">
                {stats.overview.total_products.toLocaleString()}
              </h3>
            </div>
          </div>
        </Card>

        {/* Total Orders */}
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-orange-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <h3 className="text-2xl font-bold">
                {stats.overview.total_orders.toLocaleString()}
              </h3>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              This month: +{stats.growth.new_orders_this_month}
            </span>
            {formatGrowthPercentage(stats.growth.order_growth_percentage)}
          </div>
        </Card>
      </div>

      {/* Revenue Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Total Revenue */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <h3 className="text-3xl font-bold text-green-600">
                {formatRupiah(stats.overview.total_revenue)}
              </h3>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Monthly: {formatRupiah(stats.overview.monthly_revenue)}
          </div>
        </Card>

        {/* Pending Items Summary */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">
                Items Requiring Attention
              </p>
              <h3 className="text-3xl font-bold text-yellow-600">
                {stats.pending_items.pending_payments +
                  stats.pending_items.pending_withdrawals +
                  stats.pending_items.pending_complaints}
              </h3>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Pending Payments:
              </span>
              <span className="font-medium">
                {stats.pending_items.pending_payments}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                Pending Withdrawals:
              </span>
              <span className="font-medium">
                {stats.pending_items.pending_withdrawals}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1">
                <FileX className="w-4 h-4" />
                Pending Complaints:
              </span>
              <span className="font-medium">
                {stats.pending_items.pending_complaints}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
