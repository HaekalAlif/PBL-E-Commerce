import { motion } from "framer-motion";
import { formatDate } from "@/lib/formatter";
import Link from "next/link";
import { AlertCircle, ChevronRight, TimerIcon } from "lucide-react";

interface OrderDetailHeaderProps {
  orderCode: string;
  orderDate: string;
  statusIcon: React.ReactNode;
  statusBadge: React.ReactNode;
}

export const OrderDetailHeader = ({
  orderCode,
  orderDate,
  statusIcon,
  statusBadge,
}: OrderDetailHeaderProps) => {
  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="text-sm">
        <ol className="flex items-center space-x-2">
          <li>
            <Link
              href="/akun/profile"
              className="text-gray-500 hover:text-[#F79E0E]"
            >
              Akun
            </Link>
          </li>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <li>
            <Link
              href="/akun/pesanan"
              className="text-gray-500 hover:text-[#F79E0E]"
            >
              Pesanan Saya
            </Link>
          </li>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <li>
            <span className="text-gray-500">Detail Pesanan</span>
          </li>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <li className="text-[#F79E0E] font-medium">#{orderCode}</li>
        </ol>
      </nav>

      {/* Header Content */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-orange-100"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#F79E0E] to-[#FFB648] text-white shadow-lg shadow-orange-100">
              <TimerIcon className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">
              Pesanan #{orderCode}
            </h1>
          </div>
          <p className="text-sm text-gray-500">
            Dibuat pada {formatDate(orderDate)}
          </p>
        </div>

        {/* Status Badge - Now vertically centered */}
        <div className="flex items-center">{statusBadge}</div>
      </motion.div>
    </div>
  );
};
