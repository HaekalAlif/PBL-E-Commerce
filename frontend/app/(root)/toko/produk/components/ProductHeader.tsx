import { Package, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export const ProductHeader = () => {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between"
    >
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#F79E0E] to-[#FFB648] text-white shadow-lg shadow-orange-100">
          <Package className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Daftar Produk</h1>
          <p className="text-sm text-gray-500">
            Kelola produk yang Anda jual di toko
          </p>
        </div>
      </div>

      <Button
        onClick={() => router.push("/toko/produk/create")}
        className="bg-[#F79E0E] hover:bg-[#E08D0D]"
      >
        <Plus className="w-4 h-4 mr-2" />
        Tambah Produk
      </Button>
    </motion.div>
  );
};
