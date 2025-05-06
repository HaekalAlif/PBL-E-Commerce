import { motion } from "framer-motion";
import { InfoFieldProps } from "../types";

export const InfoField = ({
  label,
  value,
  icon: Icon,
  verified,
}: InfoFieldProps) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-gray-50/50 rounded-lg p-4 border border-gray-100"
  >
    <label className="text-sm font-medium text-gray-600 mb-1 block">
      {label}
    </label>
    <div className="flex items-center gap-2 mt-1">
      <Icon className="w-4 h-4 text-[#F79E0E]" />
      <span className="text-gray-900 font-medium">
        {value || "Tidak tersedia"}
      </span>
      {verified && (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
          Terverifikasi
        </span>
      )}
    </div>
  </motion.div>
);
