import { Package, ChevronRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

interface BarangFormHeaderProps {
  productName?: string;
  isLoading?: boolean;
}

export const BarangFormHeader = ({
  productName,
  isLoading,
}: BarangFormHeaderProps) => (
  <div className="space-y-2">
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center py-2"
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-12 bg-amber-100/50" />
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <Skeleton className="h-4 w-16 bg-amber-100/50" />
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <Skeleton className="h-4 w-24 bg-amber-100/50" />
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <Skeleton className="h-4 w-32 bg-amber-100/50" />
        </div>
      ) : (
        <ol className="flex items-center space-x-2">
          <li>
            <Link href="/toko" className="text-gray-500 hover:text-[#F79E0E]">
              Toko
            </Link>
          </li>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <li>
            <Link
              href="/toko/produk"
              className="text-gray-500 hover:text-[#F79E0E]"
            >
              Produk
            </Link>
          </li>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <li>
            <span className="text-gray-500">Edit Produk</span>
          </li>
          {productName && (
            <>
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <li className="text-[#F79E0E] font-medium">{productName}</li>
            </>
          )}
        </ol>
      )}
    </motion.nav>

    <div className="bg-white p-6 rounded-xl border border-amber-100 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#F79E0E] to-[#FFB648] text-white shadow-lg shadow-orange-100">
          <Package className="w-6 h-6" />
        </div>
        <div>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-6 w-48 bg-amber-100" />
              <Skeleton className="h-4 w-64 bg-amber-100/50" />
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Edit Produk
              </h1>
              <p className="text-sm text-gray-500">
                Edit informasi produk yang sudah ada
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  </div>
);
