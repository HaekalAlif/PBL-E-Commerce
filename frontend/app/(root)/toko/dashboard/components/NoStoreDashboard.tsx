import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  BarChart3,
  Store,
  AlertCircle,
  PlusCircle,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function NoStoreDashboard() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 max-w-4xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-8"
      >
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#F79E0E] to-[#FFB648] text-white shadow-lg shadow-orange-200">
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
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl border border-orange-200 shadow-sm p-8 text-center"
      >
        <div className="flex flex-col items-center space-y-8">
          <div className="p-8 rounded-full bg-gradient-to-br from-orange-50 to-orange-100 shadow-inner">
            <Store className="w-20 h-20 text-[#F79E0E]" />
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">
              Toko Belum Dibuat
            </h2>
            <p className="text-gray-600 max-w-lg leading-relaxed">
              Anda belum memiliki toko untuk melihat dashboard analitik. Buat
              toko terlebih dahulu untuk mulai berjualan dan melihat performa
              bisnis Anda.
            </p>
          </div>

          <Alert className="bg-orange-50 border-orange-200 max-w-lg">
            <AlertCircle className="h-4 w-4 text-[#F79E0E]" />
            <AlertTitle className="text-[#F79E0E] font-semibold">
              Informasi Dashboard
            </AlertTitle>
            <AlertDescription className="text-orange-700 mt-2">
              Setelah membuat toko, Anda dapat melihat:
              <ul className="list-disc list-inside mt-3 space-y-1 text-sm text-left">
                <li>Total pendapatan dan pertumbuhan</li>
                <li>Statistik pesanan dan produk</li>
                <li>Tren penjualan harian</li>
                <li>Performa produk terbaik</li>
                <li>Aktivitas terbaru toko</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div className="flex flex-col sm:flex-row gap-4 ">
            <Button
              onClick={() => router.push("/toko/create")}
              className="bg-gradient-to-r from-[#F79E0E] to-[#FFB648] hover:from-[#E8890B] hover:to-[#F0A537] text-white font-medium px-8 py-3 rounded-lg shadow-lg shadow-orange-200 transition-all duration-200"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Buat Toko Sekarang
            </Button>

            <Button
              onClick={() => router.push("/toko/profile")}
              variant="outline"
              className="border-[#F79E0E] text-[#F79E0E] hover:bg-orange-50 px-8 py-3"
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              Lihat Profil Toko
            </Button>
          </div>

          {/* Feature Preview */}
          <div className=" pt-8 border-t border-orange-100 w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Fitur Dashboard yang Tersedia
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-sm">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-semibold text-blue-900 mb-2">
                  Analitik Penjualan
                </h4>
                <p className="text-blue-700 leading-relaxed">
                  Grafik pendapatan dan tren penjualan real-time
                </p>
              </div>

              <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 shadow-sm">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-semibold text-green-900 mb-2">
                  Laporan Performa
                </h4>
                <p className="text-green-700 leading-relaxed">
                  Monitor produk terlaris dan konversi penjualan
                </p>
              </div>

              <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-sm">
                  <Store className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-semibold text-purple-900 mb-2">
                  Manajemen Toko
                </h4>
                <p className="text-purple-700 leading-relaxed">
                  Kelola pesanan, stok, dan aktivitas toko
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
