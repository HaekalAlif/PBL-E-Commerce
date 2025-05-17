import { motion } from "framer-motion";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { ChevronRight, PackageCheck } from "lucide-react";
import { StatusBadge } from "../../components/StatusBadge";

interface OrderDetailHeaderProps {
  orderCode: string;
  orderDate: string;
  status: string;
}

export function OrderDetailHeader({
  orderCode,
  orderDate,
  status,
}: OrderDetailHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Breadcrumb dengan warna tema */}
      <nav className="text-sm">
        <ol className="flex items-center space-x-2">
          <li>
            <Link
              href="/toko/profile"
              className="text-gray-600 hover:text-[#F79E0E] transition-colors"
            >
              Toko
            </Link>
          </li>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <li>
            <Link
              href="/toko/pesanan"
              className="text-gray-600 hover:text-[#F79E0E] transition-colors"
            >
              Pesanan
            </Link>
          </li>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <li>
            <span className="text-gray-600">Detail Pesanan</span>
          </li>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <li className="text-[#F79E0E] font-medium">#{orderCode}</li>
        </ol>
      </nav>

      {/* Header Content dengan gradient dan shadow yang lebih halus */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center bg-white p-6 rounded-xl border border-orange-100/50 shadow-sm hover:shadow-md transition-shadow duration-200"
      >
        <div>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#F79E0E] to-[#FFB648] text-white shadow-lg shadow-orange-100/50">
              <PackageCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Pesanan #{orderCode}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Diterima pada {formatDate(orderDate, true)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <StatusBadge status={status} />
        </div>
      </motion.div>
    </div>
  );
}
