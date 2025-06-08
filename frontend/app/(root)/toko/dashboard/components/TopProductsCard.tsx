import { motion } from "framer-motion";
import { TopProduct } from "../types";
import { formatRupiah } from "@/lib/utils";
import Image from "next/image";
import { Package, TrendingUp, Crown } from "lucide-react";

interface TopProductsCardProps {
  data: TopProduct[];
}

export function TopProductsCard({ data }: TopProductsCardProps) {
  // Sort by highest price and take top 5
  const topExpensiveProducts = data
    .sort((a, b) => b.product.harga - a.product.harga)
    .slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-xl p-6 border border-orange-200 h-full flex flex-col"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-orange-50 text-[#F79E0E]">
          <Crown className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Produk Termahal Terjual
          </h3>
          <p className="text-sm text-gray-500">
            5 produk dengan harga tertinggi yang berhasil terjual
          </p>
        </div>
      </div>

      {topExpensiveProducts.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
          <div className="bg-gray-50 p-4 rounded-full mb-4">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 mb-2">Belum ada produk terjual</p>
          <p className="text-xs text-gray-400">
            Mulai jual produk untuk melihat performa
          </p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-between">
          <div className="space-y-8">
            {topExpensiveProducts.map((item, index) => (
              <motion.div
                key={item.product.id_barang}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-orange-50/50 transition-colors border border-orange-100/50 relative"
              >
                {/* Rank Badge */}
                <div className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 text-white text-xs font-bold flex items-center justify-center shadow-sm">
                  {index + 1}
                </div>

                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  {item.product.gambarBarang && item.product.gambarBarang[0] ? (
                    <Image
                      src={item.product.gambarBarang[0].url_gambar}
                      alt={item.product.nama_barang}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate text-sm mb-1">
                    {item.product.nama_barang}
                  </h4>
                  <div className="space-y-0.5">
                    <div className="text-base font-bold text-[#F79E0E]">
                      {formatRupiah(item.product.harga)}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-2.5 h-2.5 text-green-600" />
                        {item.total_sold} transaksi
                      </span>
                      <span>•</span>
                      <span className="font-medium text-gray-600">
                        {formatRupiah(item.total_revenue)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Premium badge for top product */}
                {index === 0 && (
                  <div className="flex-shrink-0">
                    <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 text-xs font-bold px-1.5 py-0.5 rounded-full">
                      ⭐ TOP
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Summary Footer */}
          <div className="pt-2 border-t border-orange-100">
            <div className="text-center">
              <p className="mt-2 text-sm font-semibold text-[#F79E0E]">
                Top {topExpensiveProducts.length} produk termahal
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
