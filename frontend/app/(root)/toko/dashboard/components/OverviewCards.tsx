import { motion } from "framer-motion";
import { OverviewData } from "../types";
import {
  DollarSign,
  ShoppingBag,
  Package,
  Wallet,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { formatRupiah } from "@/lib/utils";

interface OverviewCardsProps {
  data: OverviewData;
}

export function OverviewCards({ data }: OverviewCardsProps) {
  const cards = [
    {
      title: "Total Pendapatan",
      value: formatRupiah(data.total_revenue),
      growth: data.revenue_growth,
      icon: DollarSign,
      color: "bg-green-50 text-green-600",
      bgGradient: "from-green-500 to-emerald-600",
    },
    {
      title: "Total Pesanan",
      value: data.total_orders.toString(),
      growth: data.orders_growth,
      icon: ShoppingBag,
      color: "bg-blue-50 text-blue-600",
      bgGradient: "from-blue-500 to-cyan-600",
    },
    {
      title: "Total Produk",
      value: data.total_products.toString(),
      growth: null,
      icon: Package,
      color: "bg-purple-50 text-purple-600",
      bgGradient: "from-purple-500 to-violet-600",
    },
    {
      title: "Saldo Tersedia",
      value: formatRupiah(data.available_balance),
      growth: null,
      icon: Wallet,
      color: "bg-orange-50 text-orange-600",
      bgGradient: "from-orange-500 to-amber-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const isPositiveGrowth = card.growth && card.growth > 0;
        const isNegativeGrowth = card.growth && card.growth < 0;

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 border border-orange-200 hover:border-orange-300 hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${card.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              {card.growth !== null && (
                <div
                  className={`flex items-center text-sm font-medium ${
                    isPositiveGrowth
                      ? "text-green-600"
                      : isNegativeGrowth
                      ? "text-red-600"
                      : "text-gray-500"
                  }`}
                >
                  {isPositiveGrowth && <TrendingUp className="w-4 h-4 mr-1" />}
                  {isNegativeGrowth && (
                    <TrendingDown className="w-4 h-4 mr-1" />
                  )}
                  {Math.abs(card.growth)}%
                </div>
              )}
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {card.value}
              </h3>
              <p className="text-sm text-gray-600">{card.title}</p>
              {card.growth !== null && (
                <p className="text-xs text-gray-500 mt-1">
                  vs periode sebelumnya
                </p>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
