import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AddressHeader() {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between mb-6"
    >
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#F79E0E] to-[#FFB648] text-white shadow-lg shadow-orange-100">
          <MapPin className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Alamat Toko
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola alamat pengiriman toko Anda
          </p>
        </div>
      </div>
      <Button
        onClick={() => router.push("/toko/profile/alamat/create")}
        className="bg-gradient-to-r from-[#F79E0E] to-[#FFB648] hover:from-[#E8890B] hover:to-[#F0A537] text-white font-medium px-4 py-2 rounded-lg shadow-lg shadow-orange-200"
      >
        <PlusCircle className="h-4 w-4 mr-2" />
        Tambah Alamat
      </Button>
    </motion.div>
  );
}
