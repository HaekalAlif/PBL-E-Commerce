import React from "react";
import { Card } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { OrderStatusDistribution } from "../types";
import { formatRupiah } from "@/lib/formatter";
import {
  ShoppingCart,
  TrendingUp,
  Package,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface OrderStatusChartProps {
  data: OrderStatusDistribution[];
  loading?: boolean;
}

const STATUS_COLORS = {
  "Menunggu Pembayaran": "#f59e0b",
  Menunggu: "#f59e0b",
  Dikonfirmasi: "#3b82f6",
  Dikirim: "#8b5cf6",
  Selesai: "#10b981",
  Dibatalkan: "#ef4444",
} as const;

const STATUS_ICONS = {
  "Menunggu Pembayaran": Clock,
  Menunggu: Clock,
  Dikonfirmasi: Package,
  Dikirim: TrendingUp,
  Selesai: CheckCircle,
  Dibatalkan: XCircle,
} as const;

export default function OrderStatusChart({
  data,
  loading,
}: OrderStatusChartProps) {
  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-gray-200 rounded"></div>
            <div className="w-32 h-6 bg-gray-200 rounded"></div>
          </div>
          <div className="h-80 bg-gray-200 rounded"></div>
        </div>
      </Card>
    );
  }

  const chartData = data.map((item) => ({
    ...item,
    fill:
      STATUS_COLORS[item.status_pembelian as keyof typeof STATUS_COLORS] ||
      "#6b7280",
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.count / totalOrders) * 100).toFixed(1);

      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: data.fill }}
            ></div>
            <p className="font-medium text-gray-800">{data.status_pembelian}</p>
          </div>
          <div className="space-y-1 text-sm">
            <p className="text-gray-600">
              Orders:{" "}
              <span className="font-medium text-gray-800">{data.count}</span>
              <span className="text-gray-500 ml-1">({percentage}%)</span>
            </p>
            <p className="text-gray-600">
              Value:{" "}
              <span className="font-medium text-green-600">
                {formatRupiah(data.total_value)}
              </span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const totalOrders = data.reduce((sum, item) => sum + item.count, 0);
  const totalValue = data.reduce((sum, item) => sum + item.total_value, 0);

  // Calculate completion rate (successful orders)
  const completedOrders =
    data.find((item) => item.status_pembelian === "Selesai")?.count || 0;
  const completionRate =
    totalOrders > 0 ? ((completedOrders / totalOrders) * 100).toFixed(1) : "0";

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <ShoppingCart className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Order Status Distribution
            </h3>
            <p className="text-sm text-gray-500">
              Current order status breakdown
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Completion Rate</p>
          <p className="text-xl font-bold text-green-600">{completionRate}%</p>
        </div>
      </div>

      {/* Chart Container */}
      <div className="h-64 relative mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={100}
              paddingAngle={2}
              dataKey="count"
              stroke="rgba(255,255,255,0.8)"
              strokeWidth={2}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.fill}
                  className="drop-shadow-sm hover:drop-shadow-md transition-all duration-200"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Info */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center rounded-full p-3 shadow-sm">
            <p className="text-xs text-gray-500">Total Orders</p>
            <p className="text-lg font-bold text-gray-800">{totalOrders}</p>
          </div>
        </div>
      </div>

      {/* Status Color Legend - Compact */}
      <div className="space-y-2 mt-7">
        <h4 className="font-medium text-gray-700 text-sm">Status Colors</h4>
        <div className="grid grid-cols-2 gap-1 text-xs">
          {Object.entries(STATUS_COLORS).map(([status, color]) => {
            const Icon = STATUS_ICONS[status as keyof typeof STATUS_ICONS];
            const count =
              data.find((item) => item.status_pembelian === status)?.count || 0;

            return (
              <div key={status} className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: color }}
                  ></div>
                  {Icon && <Icon className="w-3 h-3" style={{ color }} />}
                </div>
                <span className="text-gray-600 truncate">{status}</span>
                <span className="text-gray-500 ml-auto">({count})</span>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
