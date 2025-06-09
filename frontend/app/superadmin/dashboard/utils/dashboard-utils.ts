import { DashboardFilters } from "../types";

/**
 * Dashboard-specific utility functions
 */

/**
 * Generate chart colors for data visualization
 */
export const generateChartColors = (count: number): string[] => {
  const baseColors = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff7300",
    "#00ff00",
    "#0088fe",
    "#00c49f",
    "#ffbb28",
    "#ff8042",
    "#8dd1e1",
  ];

  const colors: string[] = [];
  for (let i = 0; i < count; i++) {
    colors.push(baseColors[i % baseColors.length]);
  }

  return colors;
};

/**
 * Calculate percentage change between two values
 */
export const calculatePercentageChange = (
  current: number,
  previous: number
): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

/**
 * Format time period for display
 */
export const formatTimePeriod = (
  period: DashboardFilters["period"]
): string => {
  switch (period) {
    case "7":
      return "Last 7 Days";
    case "30":
      return "Last 30 Days";
    case "90":
      return "Last 3 Months";
    case "365":
      return "Last Year";
    default:
      return "Last 30 Days";
  }
};

/**
 * Get trend direction based on percentage change
 */
export const getTrendDirection = (
  percentage: number
): "up" | "down" | "neutral" => {
  if (percentage > 0) return "up";
  if (percentage < 0) return "down";
  return "neutral";
};

/**
 * Generate date range based on period
 */
export const generateDateRange = (
  period: DashboardFilters["period"]
): { startDate: Date; endDate: Date } => {
  const endDate = new Date();
  const startDate = new Date();

  const days = parseInt(period);
  startDate.setDate(endDate.getDate() - days);

  return { startDate, endDate };
};

/**
 * Format chart tooltip data
 */
export const formatTooltipData = (
  data: any,
  formatters: Record<string, (value: any) => string> = {}
): Record<string, string> => {
  const formatted: Record<string, string> = {};

  Object.keys(data).forEach((key) => {
    if (formatters[key]) {
      formatted[key] = formatters[key](data[key]);
    } else if (typeof data[key] === "number") {
      formatted[key] = data[key].toLocaleString();
    } else {
      formatted[key] = String(data[key]);
    }
  });

  return formatted;
};

/**
 * Calculate moving average for trend analysis
 */
export const calculateMovingAverage = (
  data: number[],
  windowSize: number
): number[] => {
  const result: number[] = [];

  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - windowSize + 1);
    const window = data.slice(start, i + 1);
    const average = window.reduce((sum, val) => sum + val, 0) / window.length;
    result.push(average);
  }

  return result;
};

/**
 * Get status color mapping
 */
export const getStatusColorMap = (): Record<
  string,
  { bg: string; text: string; border: string }
> => {
  return {
    Menunggu: {
      bg: "bg-yellow-50",
      text: "text-yellow-700",
      border: "border-yellow-200",
    },
    "Menunggu Pembayaran": {
      bg: "bg-yellow-50",
      text: "text-yellow-700",
      border: "border-yellow-200",
    },
    Dibayar: {
      bg: "bg-green-50",
      text: "text-green-700",
      border: "border-green-200",
    },
    Dikonfirmasi: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
    },
    Diproses: {
      bg: "bg-purple-50",
      text: "text-purple-700",
      border: "border-purple-200",
    },
    Dikirim: {
      bg: "bg-orange-50",
      text: "text-orange-700",
      border: "border-orange-200",
    },
    Selesai: {
      bg: "bg-green-50",
      text: "text-green-700",
      border: "border-green-200",
    },
    Dibatalkan: {
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200",
    },
    Gagal: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
    Expired: {
      bg: "bg-gray-50",
      text: "text-gray-700",
      border: "border-gray-200",
    },
    Refund: {
      bg: "bg-purple-50",
      text: "text-purple-700",
      border: "border-purple-200",
    },
    Pending: {
      bg: "bg-yellow-50",
      text: "text-yellow-700",
      border: "border-yellow-200",
    },
    Ditolak: {
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200",
    },
  };
};

/**
 * Process chart data for better visualization
 */
export const processChartData = (
  rawData: any[],
  valueKey: string,
  labelKey: string
) => {
  return rawData.map((item, index) => ({
    ...item,
    fill: generateChartColors(rawData.length)[index],
    displayLabel: item[labelKey] || `Item ${index + 1}`,
    displayValue: item[valueKey] || 0,
  }));
};

/**
 * Calculate business metrics
 */
export const calculateBusinessMetrics = (data: any[]) => {
  const total = data.length;
  const totalValue = data.reduce((sum, item) => sum + (item.value || 0), 0);
  const average = total > 0 ? totalValue / total : 0;

  return {
    total,
    totalValue,
    average,
    min: Math.min(...data.map((item) => item.value || 0)),
    max: Math.max(...data.map((item) => item.value || 0)),
  };
};

/**
 * Export dashboard data to CSV
 */
export const exportDashboardDataToCSV = (data: any[], filename: string) => {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          return typeof value === "string" && value.includes(",")
            ? `"${value}"`
            : value;
        })
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}_${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
};

/**
 * Format API response for charts
 */
export const formatApiDataForChart = (
  apiData: any[],
  config: {
    xKey: string;
    yKey: string;
    labelKey?: string;
    colorKey?: string;
  }
) => {
  return apiData.map((item, index) => ({
    ...item,
    x: item[config.xKey],
    y: item[config.yKey],
    label: config.labelKey ? item[config.labelKey] : `Item ${index + 1}`,
    color: config.colorKey
      ? item[config.colorKey]
      : generateChartColors(apiData.length)[index],
  }));
};
