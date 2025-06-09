import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RecentActivity } from "../types";
import { formatRupiah } from "@/lib/formatter";
import { Activity, ShoppingCart, CreditCard, Clock } from "lucide-react";
import { format } from "date-fns";

interface RecentActivitiesCardProps {
  activities: RecentActivity[];
  loading?: boolean;
}

export default function RecentActivitiesCard({
  activities,
  loading,
}: RecentActivitiesCardProps) {
  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-gray-200 rounded"></div>
            <div className="w-32 h-6 bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "order":
        return <ShoppingCart className="w-4 h-4" />;
      case "payment":
        return <CreditCard className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "order":
        return "bg-blue-100 text-blue-600";
      case "payment":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Menunggu":
      case "Menunggu Pembayaran":
        return "bg-yellow-100 text-yellow-800";
      case "Dibayar":
      case "Dikonfirmasi":
        return "bg-green-100 text-green-800";
      case "Dikirim":
        return "bg-blue-100 text-blue-800";
      case "Selesai":
        return "bg-green-100 text-green-800";
      case "Dibatalkan":
      case "Gagal":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatActivityTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMinutes = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60)
      );

      if (diffInMinutes < 1) return "Just now";
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
      return format(date, "MMM dd, HH:mm");
    } catch {
      return "Unknown time";
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2">
        <Activity className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-semibold">Recent Activities</h3>
      </div>

      <div className="space-y-4 max-h-124 overflow-y-auto">
        {activities.length > 0 ? (
          activities.map((activity, index) => (
            <div
              key={`${activity.kode_pembelian}-${index}`}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div
                className={`p-2 rounded-full ${getActivityColor(
                  activity.activity_type
                )}`}
              >
                {getActivityIcon(activity.activity_type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm truncate">
                    {activity.activity_type === "order"
                      ? "New Order"
                      : "Payment"}{" "}
                    #{activity.kode_pembelian}
                  </h4>
                  <Badge
                    className={`text-xs ${getStatusColor(
                      activity.status_pembelian
                    )}`}
                  >
                    {activity.status_pembelian}
                  </Badge>
                </div>

                <p className="text-xs text-gray-600 mb-1">
                  Customer: {activity.customer_name}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-600">
                    {formatRupiah(activity.total_harga)}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{formatActivityTime(activity.created_at)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Activity className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No recent activities</p>
          </div>
        )}
      </div>
    </Card>
  );
}
