import { motion } from "framer-motion";
import { MapPin, Edit } from "lucide-react";

export function EditAddressHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 mb-6"
    >
      <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#F79E0E] to-[#FFB648] text-white shadow-lg shadow-orange-100">
        <MapPin className="w-6 h-6" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Edit Alamat Toko
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Perbarui informasi alamat pengiriman toko Anda
        </p>
      </div>
    </motion.div>
  );
}
