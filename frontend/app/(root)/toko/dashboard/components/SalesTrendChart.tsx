"use client";

import { motion } from "framer-motion";
import { SalesTrendData } from "../types";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { formatRupiah } from "@/lib/utils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface SalesTrendChartProps {
  data: SalesTrendData[];
}

export function SalesTrendChart({ data }: SalesTrendChartProps) {
  const chartData = {
    labels: data.map((item) =>
      new Date(item.date).toLocaleDateString("id-ID", {
        month: "short",
        day: "numeric",
      })
    ),
    datasets: [
      {
        label: "Pendapatan",
        data: data.map((item) => item.revenue),
        borderColor: "#F79E0E",
        backgroundColor: "rgba(247, 158, 14, 0.1)",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#F79E0E",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 6,
      },
      {
        label: "Jumlah Pesanan",
        data: data.map((item) => item.orders),
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#3B82F6",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 6,
        yAxisID: "y1",
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: 500,
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "#F79E0E",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function (context) {
            if (context.datasetIndex === 0) {
              return `Pendapatan: ${formatRupiah(context.parsed.y)}`;
            } else {
              return `Pesanan: ${context.parsed.y} order`;
            }
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
          },
          color: "#6B7280",
        },
      },
      y: {
        type: "linear",
        display: true,
        position: "left",
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        border: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
          },
          color: "#6B7280",
          callback: function (value) {
            return formatRupiah(Number(value));
          },
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        grid: {
          drawOnChartArea: false,
        },
        border: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
          },
          color: "#6B7280",
          callback: function (value) {
            return `${value} order`;
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "index",
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-xl p-6 border border-orange-200 shadow-sm h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Tren Penjualan</h3>
        <div className="text-sm text-gray-500 bg-orange-50 px-3 py-1 rounded-full">
          30 hari terakhir
        </div>
      </div>

      <div className="flex-1 min-h-[320px]">
        <Line data={chartData} options={options} />
      </div>
    </motion.div>
  );
}
