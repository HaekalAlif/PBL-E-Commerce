"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { formatRupiah } from "@/lib/utils";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Target,
} from "lucide-react";

interface RevenueInsightCardProps {
  totalRevenue: number;
  revenueGrowth: number;
  monthlyData: Array<{ period: string; revenue: number }>;
}

export function RevenueInsightCard({
  totalRevenue,
  revenueGrowth,
  monthlyData,
}: RevenueInsightCardProps) {
  const isPositiveGrowth = revenueGrowth >= 0;

  const renderTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-orange-200 shadow-lg rounded-lg p-3">
          <p className="text-sm font-medium text-gray-900">{label}</p>
          <p className="text-sm text-orange-600">
            Pendapatan: {formatRupiah(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  // Calculate average monthly revenue
  const avgMonthlyRevenue =
    monthlyData.length > 0
      ? monthlyData.reduce((sum, item) => sum + item.revenue, 0) /
        monthlyData.length
      : 0;

  // Find best performing month
  const bestMonth =
    monthlyData.length > 0
      ? monthlyData.reduce((best, current) =>
          current.revenue > best.revenue ? current : best
        )
      : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <Card className="border-orange-200 shadow-sm bg-gradient-to-br from-white to-orange-50/30 h-full">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-sm">
              <DollarSign className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-xl font-semibold text-gray-900">
                Analisis Pendapatan
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Ringkasan dan tren bulanan
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Revenue Summary */}
          <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-3xl font-bold text-orange-700">
                  {formatRupiah(totalRevenue)}
                </p>
                <p className="text-sm text-orange-600 mt-1">
                  Total pendapatan periode ini
                </p>
              </div>
              <Badge
                variant={isPositiveGrowth ? "default" : "destructive"}
                className={`flex items-center gap-1 ${
                  isPositiveGrowth
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "bg-red-100 text-red-700 hover:bg-red-200"
                }`}
              >
                {isPositiveGrowth ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {isPositiveGrowth ? "+" : ""}
                {revenueGrowth}%
              </Badge>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-white border border-orange-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-orange-600" />
                <span className="text-xs font-medium text-gray-600">
                  Rata-rata Bulanan
                </span>
              </div>
              <p className="text-lg font-bold text-gray-900">
                {formatRupiah(avgMonthlyRevenue)}
              </p>
            </div>

            {bestMonth && (
              <div className="p-3 bg-white border border-orange-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-orange-600" />
                  <span className="text-xs font-medium text-gray-600">
                    Bulan Terbaik
                  </span>
                </div>
                <p className="text-sm font-bold text-gray-900">
                  {bestMonth.period}
                </p>
                <p className="text-xs text-gray-600">
                  {formatRupiah(bestMonth.revenue)}
                </p>
              </div>
            )}
          </div>

          {/* Monthly Revenue Chart */}
          {monthlyData && monthlyData.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Tren Bulanan
              </h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyData}
                    margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                  >
                    <XAxis
                      dataKey="period"
                      tick={{ fontSize: 12, fill: "#9A3412" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: "#9A3412" }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => formatRupiah(value)}
                    />
                    <Tooltip content={renderTooltip} />
                    <Bar
                      dataKey="revenue"
                      fill="#F97316"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
