"use client";

import { motion } from "framer-motion";
import { OrderStatusData } from "../types";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { ShoppingBag } from "lucide-react";

ChartJS.register(ArcElement, Tooltip, Legend);

interface OrderStatusChartProps {
  data: OrderStatusData[];
}

export function OrderStatusChart({ data }: OrderStatusChartProps) {
  const statusColors = {
    Dibayar: "#3B82F6",
    Diproses: "#8B5CF6",
    Dikirim: "#F59E0B",
    Selesai: "#10B981",
    Dibatalkan: "#EF4444",
  };

  const chartData = {
    labels: data.map((item) => item.status),
    datasets: [
      {
        data: data.map((item) => item.count),
        backgroundColor: data.map(
          (item) =>
            statusColors[item.status as keyof typeof statusColors] || "#6B7280"
        ),
        borderColor: "#ffffff",
        borderWidth: 2,
        hoverBorderWidth: 3,
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          usePointStyle: true,
          padding: 15,
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
        callbacks: {
          label: function (context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          },
        },
      },
    },
    cutout: "60%",
  };

  const totalOrders = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded-xl p-6 border border-orange-200 shadow-sm h-full flex flex-col"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-orange-50 text-[#F79E0E]">
          <ShoppingBag className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Status Pesanan
          </h3>
          <p className="text-sm text-gray-500">Distribusi status pesanan</p>
        </div>
      </div>

      {totalOrders === 0 ? (
        <div className="text-center py-12 flex-1 flex flex-col justify-center">
          <div className="bg-gray-50 p-6 rounded-full mx-auto w-20 h-20 flex items-center justify-center mb-4">
            <ShoppingBag className="w-10 h-10 text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium">Belum ada data pesanan</p>
          <p className="text-sm text-gray-400 mt-1">
            Data akan muncul setelah ada pesanan masuk
          </p>
        </div>
      ) : (
        <div className="relative flex-1">
          <div className="h-72">
            <Doughnut data={chartData} options={options} />
          </div>
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ marginTop: "-40px" }}
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {totalOrders}
              </div>
              <div className="text-sm text-gray-500">Total Pesanan</div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
