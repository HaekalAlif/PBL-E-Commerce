import React from "react";
import { Card } from "@/components/ui/card";
import { formatRupiah } from "@/lib/formatter";
import { OrderStats as OrderStatsType } from "../../types";
import {
  PackageCheck,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface OrderStatsProps {
  stats: OrderStatsType;
}

export default function OrderStats({ stats }: OrderStatsProps) {
  // Helper function to get total orders count (excluding Draft)
  const getTotalOrders = () => {
    return Object.entries(stats.order_statuses)
      .filter(([status]) => status !== "Draft") // Exclude Draft status
      .reduce((acc, [_, count]) => acc + count, 0);
  };

  // Process chart data for last 7 days
  const processChartData = () => {
    // Create an array of last 7 days
    const today = new Date();
    const lastWeek = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(today.getDate() - (6 - i));
      return {
        date: date.toISOString().split("T")[0],
        count: 0,
        formattedDate: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      };
    });

    // Map actual data to the prepared array
    stats.last_week_orders.forEach((item) => {
      const index = lastWeek.findIndex((day) => day.date === item.date);
      if (index !== -1) {
        lastWeek[index].count = item.count;
      }
    });

    return lastWeek;
  };

  // Prepare chart data
  const chartData = processChartData();
  const maxCount = Math.max(...chartData.map((item) => item.count), 1); 

  // Get appropriate icon for order status
  const getOrderStatusIcon = (status: string) => {
    switch (status) {
      case "Menunggu Pembayaran":
        return <Clock className="h-4 w-4 text-white" />;
      case "Dibayar":
        return <ShoppingBag className="h-4 w-4 text-white" />;
      case "Diproses":
        return <ShoppingBag className="h-4 w-4 text-white" />;
      case "Dikirim":
        return <Truck className="h-4 w-4text-white" />;
      case "Selesai":
        return <CheckCircle className="h-4 w-4 text-white" />;
      case "Dibatalkan":
        return <XCircle className="h-4 w-4 text-white" />;
      default:
        return <div className="h-4 w-4 rounded-full text-white" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Menunggu Pembayaran":
        return "bg-yellow-500";
      case "Dibayar":
        return "bg-blue-500";
      case "Diproses":
        return "bg-indigo-500";
      case "Dikirim":
        return "bg-purple-500";
      case "Selesai":
        return "bg-green-500";
      case "Dibatalkan":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="mb-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Orders - Updated for consistent styling */}
        <Card className="p-4">
          <div className="flex items-center h-full">
            <div className="p-2 bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center">
              <ShoppingBag className="h-5 w-5 text-blue-700" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <h3 className="text-xl font-bold">{getTotalOrders()}</h3>
            </div>
          </div>
        </Card>

        {/* Processing Orders - Updated for consistent styling */}
        <Card className="p-4">
          <div className="flex items-center h-full">
            <div className="p-2 bg-indigo-100 rounded-full w-10 h-10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-indigo-700" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-muted-foreground">Processing</p>
              <h3 className="text-xl font-bold">
                {stats.order_statuses["Diproses"] || 0}
              </h3>
            </div>
          </div>
        </Card>

        {/* Completed Orders - Updated for consistent styling */}
        <Card className="p-4">
          <div className="flex items-center h-full">
            <div className="p-2 bg-green-100 rounded-full w-10 h-10 flex items-center justify-center">
              <PackageCheck className="h-5 w-5 text-green-700" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-muted-foreground">Completed</p>
              <h3 className="text-xl font-bold">
                {stats.order_statuses["Selesai"] || 0}
              </h3>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
        {/* Weekly Orders Chart - Using Bar Chart */}
        <Card className="p-8 col-span-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-muted-foreground" />
              Orders Last 7 Days
            </h3>
          </div>

          <div className="h-44 relative">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-0 w-10 flex flex-col justify-between text-xs text-muted-foreground">
              <span className="transform -translate-y-1/2">{maxCount}</span>
              <span className="transform -translate-y-1/2">
                {Math.round(maxCount * 0.75)}
              </span>
              <span className="transform -translate-y-1/2">
                {Math.round(maxCount * 0.5)}
              </span>
              <span className="transform -translate-y-1/2">
                {Math.round(maxCount * 0.25)}
              </span>
              <span className="transform -translate-y-1/2">0</span>
            </div>

            {/* Chart area */}
            <div className="ml-10 h-full flex flex-col">
              {/* Chart grid lines */}
              <div className="h-full relative">
                <div className="absolute w-full h-px bg-gray-200 bottom-0"></div>

                {/* Bar chart implementation - adjusted vertical positioning */}
                <TooltipProvider>
                  <svg
                    className="w-full h-full"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                  >
                    {/* Apply a clipping path to ensure the chart stays within bounds */}
                    <defs>
                      <clipPath id="chart-area-orders">
                        <rect x="0" y="0" width="100" height="100" />
                      </clipPath>
                    </defs>

                    <g clipPath="url(#chart-area-orders)">
                      {/* Draw bars for each data point - adjusted to ensure bottom points are within chart area */}
                      {chartData.map((point, i) => {
                        const barHeight = (point.count / maxCount) * 100; // Use 90% of height to ensure visible inside chart area
                        const barWidth = (100 / chartData.length) * 0.6; // 60% of available width
                        const barX =
                          (i / chartData.length) * 100 +
                          (100 / chartData.length) * 0.2; // Centered in segment

                        return (
                          <g key={i}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <rect
                                  x={barX}
                                  y={95 - barHeight} // Position at 95 instead of 100 to keep bars within visible area
                                  width={barWidth}
                                  height={barHeight}
                                  fill="rgba(59, 130, 246, 0.8)"
                                  className="transition-opacity hover:opacity-100 opacity-90"
                                  rx="1"
                                />
                              </TooltipTrigger>
                              <TooltipContent side="top">
                                <div className="font-medium">
                                  {point.formattedDate}: {point.count} orders
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </g>
                        );
                      })}
                    </g>
                  </svg>
                </TooltipProvider>
              </div>

              {/* X-axis labels - Improved spacing with more bottom padding */}
              <div className="h-6 mx-12 flex justify-between text-xs text-muted-foreground pt-1 pb-1">
                {chartData.map((day, i) => (
                  <div key={i} className="text-center">
                    {day.formattedDate.split(" ")[1]}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Order Status Distribution - Made more compact */}
        <Card className="p-4 col-span-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">Order Status Distribution</h3>
          </div>
          <div className="space-y-2.5 pt-6">
            {/* Distribution circles grid */}
            <div className="flex justify-between mb-3 gap-2">
              {Object.entries(stats.order_statuses)
                .filter(([status]) => status !== "Draft") // Exclude Draft status
                .map(([status, count]) => {
                  const percentage = ((count / getTotalOrders()) * 100).toFixed(
                    1
                  );
                  return (
                    <TooltipProvider key={status}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex flex-col items-center text-center">
                            <div
                              className={`rounded-full h-10 w-10 flex items-center justify-center ${getStatusColor(
                                status
                              ).replace(
                                "bg-",
                                "bg-opacity-10 bg-"
                              )} border border-${getStatusColor(status).replace(
                                "bg-",
                                ""
                              )}`}
                            >
                              {getOrderStatusIcon(status)}
                            </div>
                            <span className="text-xs font-medium mt-1">
                              {count}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {percentage}%
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          <p>
                            {status}: {count} orders ({percentage}%)
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                })}
            </div>

            {/* Combined progress bar showing all statuses */}
            <div className="h-4 bg-muted rounded-full overflow-hidden flex">
              {Object.entries(stats.order_statuses)
                .filter(([status]) => status !== "Draft") // Exclude Draft status
                .sort((a, b) => {
                  // Sort by status priority for visual consistency
                  const order = [
                    "Menunggu Pembayaran",
                    "Dibayar",
                    "Diproses",
                    "Dikirim",
                    "Selesai",
                    "Dibatalkan",
                  ];
                  return order.indexOf(a[0]) - order.indexOf(b[0]);
                })
                .map(([status, count]) => {
                  const percentage = (count / getTotalOrders()) * 100;
                  return percentage > 0 ? (
                    <div
                      key={status}
                      className={`h-full ${getStatusColor(status)}`}
                      style={{ width: `${percentage}%` }}
                      title={`${status}: ${count} (${percentage.toFixed(1)}%)`}
                    ></div>
                  ) : null;
                })}
            </div>

            {/* Legend for the combined progress bar */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs pt-1 justify-center">
              {Object.entries(stats.order_statuses)
                .filter(([status]) => status !== "Draft") // Exclude Draft status
                .map(([status, count]) => (
                  <div key={status} className="flex items-center">
                    <div
                      className={`h-2 w-2 rounded-full ${getStatusColor(
                        status
                      )} mr-1`}
                    ></div>
                    <span>{status.split(" ")[0]}</span>
                  </div>
                ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
