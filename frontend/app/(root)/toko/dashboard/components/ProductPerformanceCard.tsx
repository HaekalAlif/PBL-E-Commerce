import { motion } from "framer-motion";
import { ProductPerformanceData } from "../types";
import { Package, ShoppingCart, Target, Star } from "lucide-react";

interface ProductPerformanceCardProps {
  data: ProductPerformanceData;
}

export function ProductPerformanceCard({ data }: ProductPerformanceCardProps) {
  const metrics = [
    {
      label: "Total Produk",
      value: data.total_products,
      icon: Package,
      color: "bg-blue-50 text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      label: "Produk Terjual",
      value: data.sold_products,
      icon: ShoppingCart,
      color: "bg-green-50 text-green-600",
      bgColor: "bg-green-100",
    },
    {
      label: "Tingkat Konversi",
      value: `${data.conversion_rate}%`,
      icon: Target,
      color: "bg-purple-50 text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      label: "Rating Rata-rata",
      value: data.average_rating > 0 ? `${data.average_rating}/5` : "Belum ada",
      icon: Star,
      color: "bg-yellow-50 text-yellow-600",
      bgColor: "bg-yellow-100",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-white rounded-xl p-6 border border-orange-200 col-span-full"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-orange-50 text-[#F79E0E]">
          <Package className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Performa Produk
          </h3>
          <p className="text-sm text-gray-500">Metrik kinerja produk toko</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              className={`${metric.color} p-4 rounded-lg border-2 border-gray-100 hover:border-orange-200 transition-colors`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {metric.label}
                  </p>
                  <p className="text-xl font-bold text-gray-900">
                    {metric.value}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
