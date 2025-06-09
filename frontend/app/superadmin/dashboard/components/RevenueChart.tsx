import React from "react";
import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { formatRupiah } from "@/lib/formatter";
import { RevenueChartData } from "../types";
import { TrendingUp } from "lucide-react";

interface RevenueChartProps {
  data: RevenueChartData[];
  loading?: boolean;
}

export default function RevenueChart({ data, loading }: RevenueChartProps) {
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

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg">
          <p className="font-medium">{data.formatted_date}</p>
          <div className="space-y-1 mt-2">
            <p className="text-green-600">
              Revenue: {formatRupiah(data.revenue)}
            </p>
            <p className="text-blue-600">
              Successful: {data.successful_payments} payments
            </p>
            <p className="text-gray-600">
              Total: {data.total_payments} payments
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const totalPayments = data.reduce(
    (sum, item) => sum + item.total_payments,
    0
  );
  const successfulPayments = data.reduce(
    (sum, item) => sum + item.successful_payments,
    0
  );
  const successRate =
    totalPayments > 0 ? (successfulPayments / totalPayments) * 100 : 0;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-green-600" />
          <h3 className="text-lg font-semibold">Revenue Overview</h3>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Total Revenue</p>
          <p className="text-xl font-bold text-green-600">
            {formatRupiah(totalRevenue)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Success Rate</p>
          <p className="text-lg font-semibold text-green-600">
            {successRate.toFixed(1)}%
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Successful</p>
          <p className="text-lg font-semibold">{successfulPayments}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Total Payments</p>
          <p className="text-lg font-semibold">{totalPayments}</p>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="formatted_date" stroke="#6b7280" fontSize={12} />
            <YAxis
              stroke="#6b7280"
              fontSize={12}
              tickFormatter={(value) => formatRupiah(value, false, true)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#10b981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
