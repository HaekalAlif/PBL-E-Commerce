import { motion } from "framer-motion";
import { RecentActivityData } from "../types";
import { Activity, ShoppingBag } from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

interface RecentActivitiesCardProps {
  data: RecentActivityData[];
}

export function RecentActivitiesCard({ data }: RecentActivitiesCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Dibayar":
        return "bg-blue-100 text-blue-800";
      case "Diproses":
        return "bg-purple-100 text-purple-800";
      case "Dikirim":
        return "bg-orange-100 text-orange-800";
      case "Selesai":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="bg-white rounded-xl p-6 border border-orange-200 h-full flex flex-col"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-orange-50 text-[#F79E0E]">
          <Activity className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Aktivitas Terbaru
          </h3>
          <p className="text-sm text-gray-500">Aktivitas terbaru di toko</p>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
          <div className="bg-gray-50 p-4 rounded-full mb-4">
            <Activity className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 mb-2">Belum ada aktivitas</p>
          <p className="text-xs text-gray-400">
            Aktivitas akan muncul ketika ada pesanan masuk
          </p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          <div className="space-y-3 flex-1">
            {data.slice(0, 6).map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-orange-50/30 transition-colors border border-orange-100/30"
              >
                <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 mt-0.5 flex-shrink-0">
                  <ShoppingBag className="w-3 h-3" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 mb-1 line-clamp-1">
                    {activity.message}
                  </p>
                  <p className="text-xs text-gray-600 truncate mb-2">
                    {activity.product}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-full font-medium text-xs ${getStatusColor(
                          activity.status
                        )}`}
                      >
                        {activity.status}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(activity.created_at), {
                          addSuffix: true,
                          locale: id,
                        })}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-[#F79E0E]">
                      {formatRupiah(activity.amount)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Show more indicator if there are more activities */}
          {data.length > 6 && (
            <div className="mt-4 pt-3 border-t border-orange-100 text-center">
              <p className="text-xs text-gray-500">
                +{data.length - 6} aktivitas lainnya
              </p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
