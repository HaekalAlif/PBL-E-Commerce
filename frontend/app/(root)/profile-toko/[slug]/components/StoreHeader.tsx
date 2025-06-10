import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Store,
  MapPin,
  Phone,
  Star,
  MessageCircle,
  CheckCircle,
  Award,
  TrendingUp,
  Clock,
  Package,
  Shield,
} from "lucide-react";
import { StoreData } from "../types";
import { useStoreChatActions } from "../hooks/useStoreChatActions";

interface StoreHeaderProps {
  storeData: StoreData;
}

export function StoreHeader({ storeData }: StoreHeaderProps) {
  const { store, statistics, rating } = storeData;
  const primaryAddress = store.alamat_toko?.[0];
  const { handleStartChat, creatingChat } = useStoreChatActions();

  const formatJoinDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-amber-50/30 to-orange-50/50 rounded-3xl" />

      <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-100/80 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-amber-100/40 to-orange-100/40 rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-100/30 to-purple-100/30 rounded-full translate-y-16 -translate-x-16" />

        <div className="relative p-8 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Store Information */}
            <div className="lg:col-span-8 space-y-6">
              {/* Store Title & Basic Info */}
              <div className="flex items-start gap-6">
                <motion.div
                  className="relative flex-shrink-0"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl shadow-lg flex items-center justify-center relative overflow-hidden">
                    <Store className="h-10 w-10 text-white z-10" />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                </motion.div>

                <div className="flex-1 min-w-0">
                  <motion.h1
                    className="text-3xl lg:text-4xl font-bold text-gray-800 mb-3 break-words leading-tight"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {store.nama_toko}
                  </motion.h1>

                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 px-3 py-1.5 text-sm font-medium shadow-sm">
                        <Shield className="w-3 h-3 mr-1.5" />
                        Toko Terverifikasi
                      </Badge>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 }}
                      className="flex items-center gap-2 text-gray-600"
                    >
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        Bergabung {formatJoinDate(statistics.store_join_date)}
                      </span>
                    </motion.div>
                  </div>

                  {/* Rating & Performance */}
                  <div className="flex flex-wrap items-center gap-6 mb-4">
                    <motion.div
                      className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-xl border border-amber-200"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Star className="h-5 w-5 text-amber-500 fill-current" />
                      <span className="font-bold text-amber-700 text-lg">
                        {rating.average_rating > 0
                          ? rating.average_rating.toFixed(1)
                          : "0.0"}
                      </span>
                      <span className="text-amber-600 text-sm font-medium">
                        ({rating.total_reviews} ulasan)
                      </span>
                    </motion.div>

                    <motion.div
                      className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-xl border border-green-200"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-green-700 text-sm font-semibold">
                        {statistics.success_rate}% Tingkat Sukses
                      </span>
                    </motion.div>
                  </div>

                  {/* Description */}
                  {store.deskripsi && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      className="bg-gray-50/80 backdrop-blur-sm rounded-xl p-4 border border-gray-100"
                    >
                      <p className="text-gray-700 leading-relaxed line-clamp-2">
                        {store.deskripsi}
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Contact Information Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                {primaryAddress && (
                  <div className="flex items-center gap-3 p-4 bg-blue-50/80 backdrop-blur-sm rounded-xl border border-blue-100">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-blue-900 mb-1">
                        Lokasi Toko
                      </p>
                      <p className="text-sm text-blue-700 font-semibold">
                        {primaryAddress.regency.name},{" "}
                        {primaryAddress.province.name}
                      </p>
                    </div>
                  </div>
                )}

                {store.kontak && (
                  <div className="flex items-center gap-3 p-4 bg-green-50/80 backdrop-blur-sm rounded-xl border border-green-100">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <Phone className="h-5 w-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-green-900 mb-1">
                        Kontak
                      </p>
                      <p className="text-sm text-green-700 font-semibold break-words">
                        {store.kontak}
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Statistics & Actions Panel */}
            <div className="lg:col-span-4 space-y-6">
              {/* Statistics Grid */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-2 gap-4"
              >
                <div className="bg-gradient-to-br from-amber-500 to-orange-500 p-4 rounded-xl text-white shadow-lg">
                  <Package className="h-6 w-6 mb-2 opacity-80" />
                  <div className="text-2xl font-bold mb-1">
                    {statistics.total_products}
                  </div>
                  <div className="text-xs font-medium opacity-90">
                    Total Produk
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-4 rounded-xl text-white shadow-lg">
                  <CheckCircle className="h-6 w-6 mb-2 opacity-80" />
                  <div className="text-2xl font-bold mb-1">
                    {statistics.total_orders_completed}
                  </div>
                  <div className="text-xs font-medium opacity-90">
                    Pesanan Selesai
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-4 rounded-xl text-white shadow-lg">
                  <Award className="h-6 w-6 mb-2 opacity-80" />
                  <div className="text-2xl font-bold mb-1">
                    {statistics.success_rate}%
                  </div>
                  <div className="text-xs font-medium opacity-90">
                    Tingkat Sukses
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-xl text-white shadow-lg">
                  <Clock className="h-6 w-6 mb-2 opacity-80" />
                  <div className="text-lg font-bold mb-1">
                    {statistics.avg_response_time}
                  </div>
                  <div className="text-xs font-medium opacity-90">
                    Waktu Respon
                  </div>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-4"
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={() => handleStartChat(store.user.id_user)}
                    disabled={creatingChat}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-4 rounded-xl font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 border-0"
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    {creatingChat ? "Menghubungkan..." : "Chat dengan Toko"}
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
