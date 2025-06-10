import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Search, RefreshCw, Filter } from "lucide-react";

export function EmptyProducts() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center py-16"
    >
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-md rounded-2xl p-12 max-w-lg mx-auto overflow-hidden relative">
        {/* Decorative background elements */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-amber-200/20 to-orange-200/20 rounded-full blur-2xl" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-tr from-yellow-200/20 to-amber-200/20 rounded-full blur-2xl" />

        <div className="relative flex flex-col items-center">
          {/* Animated Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.2,
              type: "spring",
              stiffness: 200,
              damping: 15,
            }}
            className="relative mb-6"
          >
            {/* Outer glow */}
            <div className="absolute inset-0 w-20 h-20 bg-gradient-to-br from-amber-400/30 to-orange-400/30 rounded-full blur-xl" />

            {/* Main icon container */}
            <div className="relative w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center shadow-lg">
              <Package className="h-10 w-10 text-amber-500" />

              {/* Floating search icon */}
              <motion.div
                animate={{
                  y: [0, -5, 0],
                  rotate: [0, 10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center"
              >
                <Search className="h-4 w-4 text-amber-400" />
              </motion.div>
            </div>
          </motion.div>

          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="space-y-4 mb-8"
          >
            <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
              Produk Tidak Ditemukan
            </h3>
            <p className="text-gray-600 max-w-sm leading-relaxed">
              Maaf, tidak ada produk yang sesuai dengan pencarian atau filter
              yang Anda gunakan. Coba gunakan kata kunci yang berbeda atau ubah
              filter pencarian.
            </p>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-3 w-full"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1"
            >
              <Button
                variant="default"
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Muat Ulang
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1"
            >
              <Button
                variant="outline"
                className="w-full border-2 border-amber-200 text-amber-600 hover:border-amber-300 hover:bg-amber-50 transition-all duration-200"
                onClick={() => {
                  // Reset all filters - this would need to be passed as a prop
                  window.location.href = window.location.pathname;
                }}
              >
                <Filter className="h-4 w-4 mr-2" />
                Reset Filter
              </Button>
            </motion.div>
          </motion.div>

          {/* Helpful suggestions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.8 }}
            className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100/50"
          >
            <p className="text-sm text-amber-700 font-medium mb-2">
              Saran pencarian:
            </p>
            <ul className="text-sm text-amber-600 space-y-1">
              <li>• Gunakan kata kunci yang lebih umum</li>
              <li>• Periksa ejaan kata kunci</li>
              <li>• Coba kategori atau filter lain</li>
            </ul>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
}
