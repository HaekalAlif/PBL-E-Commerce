import { motion } from "framer-motion";
import { BarChart3, RefreshCw, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DateRange } from "../types";

interface DashboardHeaderProps {
  onRefresh: () => void;
  loading: boolean;
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
}

export function DashboardHeader({
  onRefresh,
  loading,
  dateRange,
  onDateRangeChange,
}: DashboardHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
    >
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#F79E0E] to-[#FFB648] text-white shadow-lg shadow-orange-100">
          <BarChart3 className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Dashboard Analitik
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Pantau performa toko dan penjualan Anda
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>
            {new Date(dateRange.start_date!).toLocaleDateString("id-ID")} -{" "}
            {new Date(dateRange.end_date!).toLocaleDateString("id-ID")}
          </span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={loading}
          className="border-[#F79E0E] text-[#F79E0E] hover:bg-orange-50"
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>
    </motion.div>
  );
}
