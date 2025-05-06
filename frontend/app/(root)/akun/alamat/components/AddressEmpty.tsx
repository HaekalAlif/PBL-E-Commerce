import { MapPin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export const AddressEmpty = () => {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-[60vh] flex flex-col items-center justify-center text-center p-6 bg-gray-50/50 rounded-xl border border-dashed border-gray-200"
    >
      <MapPin className="h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Belum ada alamat
      </h3>
      <p className="text-gray-500 mb-6 max-w-sm">
        Mulai dengan menambahkan alamat pengiriman untuk memudahkan proses
        belanja Anda
      </p>
      <Button
        onClick={() => router.push("/user/alamat/create")}
        className="bg-[#F79E0E] hover:bg-[#E08D0D]"
      >
        <Plus className="w-5 h-5 mr-2" />
        Tambah Alamat
      </Button>
    </motion.div>
  );
};
