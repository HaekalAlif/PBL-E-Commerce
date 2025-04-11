import React from "react";
import { Card } from "@/components/ui/card";
import { formatRupiah } from "@/lib/formatter";
import { PaymentStats as PaymentStatsType } from "../../types";
import {
  DollarSign,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PaymentStatsProps {
  stats: PaymentStatsType;
}

export default function PaymentStats({ stats }: PaymentStatsProps) {
  // Helper function to get total payments count
  const getTotalPayments = () => {
    return Object.values(stats.payment_statuses).reduce(
      (acc, count) => acc + count,
      0
    );
  };

  // Process chart data for last week payments
  const processChartData = () => {
    // Create an array of last 7 days
    const today = new Date();
    const lastWeek = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(today.getDate() - (6 - i));
      return {
        date: date.toISOString().split("T")[0],
        amount: 0,
        formattedDate: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      };
    });

    // Map actual data to the prepared array
    stats.last_week_payments.forEach((item) => {
      const index = lastWeek.findIndex((day) => day.date === item.date);
      if (index !== -1) {
        lastWeek[index].amount = item.amount;
      }
    });

    return lastWeek;
  };

  // Prepare chart data
  const chartData = processChartData();
  const maxAmount = Math.max(...chartData.map((item) => item.amount), 1); // Avoid division by zero

  // Get appropriate icon for payment status
  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case "Dibayar":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "Menunggu":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "Gagal":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "Expired":
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
      case "Refund":
        return <RefreshCw className="h-4 w-4 text-purple-600" />;
      default:
        return <div className="h-4 w-4 rounded-full bg-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Dibayar":
        return "bg-green-500";
      case "Menunggu":
        return "bg-yellow-500";
      case "Gagal":
        return "bg-red-500";
      case "Expired":
        return "bg-gray-500";
      case "Refund":
        return "bg-purple-500";
      default:
        return "bg-blue-500";
    }
  };

  // Format amount for display on chart
  const formatChartAmount = (amount: number): string => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)}K`;
    }
    return amount.toString();
  };

  return (
    <div className="mb-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Monthly Revenue - Updated for consistent styling */}
        <Card className="p-4">
          <div className="flex items-center h-full">
            <div className="p-2 bg-green-100 rounded-full w-10 h-10 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-green-700" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-muted-foreground">Monthly Revenue</p>
              <h3 className="text-xl font-bold">
                {formatRupiah(stats.monthly_revenue)}
              </h3>
            </div>
          </div>
        </Card>

        {/* Success Rate - Updated for consistent styling */}
        <Card className="p-4">
          <div className="flex items-center h-full">
            <div className="p-2 bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-blue-700" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-muted-foreground">Success Rate</p>
              <h3 className="text-xl font-bold">
                {stats.success_rate.toFixed(1)}%
              </h3>
            </div>
          </div>
        </Card>

        {/* Pending Payments - Updated for consistent styling */}
        <Card className="p-4">
          <div className="flex items-center h-full">
            <div className="p-2 bg-yellow-100 rounded-full w-10 h-10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-yellow-700" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-muted-foreground">Pending Payments</p>
              <h3 className="text-xl font-bold">
                {stats.payment_statuses.Menunggu || 0}
              </h3>
            </div>
          </div>
        </Card>

        {/* Completed Payments - Updated for consistent styling */}
        <Card className="p-4">
          <div className="flex items-center h-full">
            <div className="p-2 bg-green-100 rounded-full w-10 h-10 flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-green-700" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-muted-foreground">
                Completed Payments
              </p>
              <h3 className="text-xl font-bold">
                {stats.payment_statuses.Dibayar || 0}
              </h3>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
        {/* Weekly Revenue Chart - Using Bar Chart */}
        <Card className="p-4 col-span-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-muted-foreground" />
              Revenue Last 7 Days
            </h3>
          </div>

          <div className="h-48 relative">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-0 w-14 flex flex-col justify-between text-xs text-muted-foreground">
              <span className="transform -translate-y-1/2">
                {formatRupiah(maxAmount, false, true)}
              </span>
              <span className="transform -translate-y-1/2">
                {formatRupiah(maxAmount * 0.75, false, true)}
              </span>
              <span className="transform -translate-y-1/2">
                {formatRupiah(maxAmount * 0.5, false, true)}
              </span>
              <span className="transform -translate-y-1/2">
                {formatRupiah(maxAmount * 0.25, false, true)}
              </span>
              <span className="transform -translate-y-1/2">0</span>
            </div>
            {/* Chart area */}
            <div className="ml-14 h-full flex flex-col">
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
                      <clipPath id="chart-area-payment">
                        <rect x="0" y="0" width="100" height="100" />
                      </clipPath>
                    </defs>

                    <g clipPath="url(#chart-area-payment)">
                      {/* Draw bars for each data point - adjusted to ensure bottom points are within chart area */}
                      {chartData.map((point, i) => {
                        const barHeight = (point.amount / maxAmount) * 100; // Use 90% of height to ensure visible inside chart area
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
                                  fill="rgba(34, 197, 94, 0.8)"
                                  className="transition-opacity hover:opacity-100 opacity-90"
                                  rx="1"
                                />
                              </TooltipTrigger>
                              <TooltipContent side="top">
                                <div className="font-medium">
                                  {point.formattedDate}:{" "}
                                  {formatRupiah(point.amount)}
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

        {/* Payment Status & Method Distribution - Made more compact */}
        <Card className="p-4 col-span-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">Payment Status Distribution</h3>
          </div>
          <div className="space-y-2.5">
            {/* Distribution circles grid */}
            <div className="flex justify-between mb-3 gap-2">
              {Object.entries(stats.payment_statuses).map(([status, count]) => {
                const percentage = ((count / getTotalPayments()) * 100).toFixed(
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
                            ).replace("bg-", "bg-opacity-20 bg-")}`}
                          >
                            {getPaymentStatusIcon(status)}
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
                          {status}: {count} payments ({percentage}%)
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </div>

            {/* Combined progress bar showing all statuses */}
            <div className="h-4 bg-muted rounded-full overflow-hidden flex">
              {Object.entries(stats.payment_statuses)
                .sort((a, b) => {
                  // Sort by status priority for visual consistency
                  const order = [
                    "Menunggu",
                    "Dibayar",
                    "Expired",
                    "Gagal",
                    "Refund",
                  ];
                  return order.indexOf(a[0]) - order.indexOf(b[0]);
                })
                .map(([status, count]) => {
                  const percentage = (count / getTotalPayments()) * 100;
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
              {Object.entries(stats.payment_statuses).map(([status, count]) => (
                <div key={status} className="flex items-center">
                  <div
                    className={`h-2 w-2 rounded-full ${getStatusColor(
                      status
                    )} mr-1`}
                  ></div>
                  <span>{status}</span>
                </div>
              ))}
            </div>

            {/* Payment Methods distribution (compact) */}
            <div className="mt-4 pt-4 border-t">
              <h3 className="font-medium text-sm mb-3">
                Popular Payment Methods
              </h3>
              <div className="space-y-2">
                {Object.entries(stats.payment_methods || {})
                  .sort((a, b) => b[1] - a[1]) // Sort by count, descending
                  .slice(0, 3) // Take top 3
                  .map(([method, count]) => {
                    const percentage = (
                      (count / getTotalPayments()) *
                      100
                    ).toFixed(1);
                    return (
                      <div
                        key={method}
                        className="flex justify-between items-center"
                      >
                        <span className="text-xs truncate max-w-[150px]">
                          {method}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {percentage}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
