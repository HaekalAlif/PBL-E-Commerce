import React from "react";
import { Card } from "@/components/ui/card";
import { RegionalData } from "../types";
import { formatRupiah } from "@/lib/formatter";
import { MapPin, TrendingUp } from "lucide-react";

interface RegionalDataCardProps {
  data: RegionalData[];
  loading?: boolean;
}

export default function RegionalDataCard({
  data,
  loading,
}: RegionalDataCardProps) {
  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-200 rounded"></div>
            <div className="w-32 h-6 bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  const maxOrders = Math.max(...data.map((item) => item.order_count), 1);

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2">
        <MapPin className="w-6 h-6 text-green-600" />
        <h3 className="text-lg font-semibold">Top Regions by Orders</h3>
      </div>

      <div className="space-y-4">
        {data.length > 0 ? (
          data.map((region, index) => {
            const percentage = (region.order_count / maxOrders) * 100;

            return (
              <div key={region.province_name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs">
                      {index + 1}
                    </span>
                    <span className="font-medium">{region.province_name}</span>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm font-medium">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span>{region.order_count}</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {formatRupiah(region.total_revenue)}
                    </p>
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-gray-500">
            <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No regional data available</p>
          </div>
        )}
      </div>
    </Card>
  );
}
