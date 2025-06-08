import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyAddressCard() {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-orange-300 p-8 text-center"
    >
      <div className="flex flex-col items-center space-y-6">
        <div className="p-4 rounded-full bg-orange-50">
          <MapPin className="w-12 h-12 text-[#F79E0E]" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-gray-900">
            Belum Ada Alamat
          </h3>
          <p className="text-gray-600 max-w-md">
            Anda belum menambahkan alamat untuk toko ini. Tambahkan alamat
            pengiriman untuk memulai berjualan.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => router.push("/toko/profile/alamat/create")}
            className="bg-gradient-to-r from-[#F79E0E] to-[#FFB648] hover:from-[#E8890B] hover:to-[#F0A537] text-white font-medium px-6 py-3 rounded-lg shadow-lg shadow-orange-200"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Tambah Alamat Baru
          </Button>
          <Button
            onClick={() => router.push("/toko/profile")}
            variant="outline"
            className="border-orange-300 text-[#F79E0E] hover:bg-orange-50"
          >
            Kembali ke Profil
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
