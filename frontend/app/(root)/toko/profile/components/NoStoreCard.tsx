import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Store, AlertCircle, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function NoStoreCard() {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-orange-300 p-8 text-center"
    >
      <div className="flex flex-col items-center space-y-6">
        <div className="p-4 rounded-full bg-orange-50">
          <Store className="w-12 h-12 text-[#F79E0E]" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">
            Toko Belum Dibuat
          </h2>
          <p className="text-gray-600 max-w-md">
            Anda belum memiliki toko. Mulai berjualan dengan membuat toko Anda
            sekarang juga!
          </p>
        </div>

        <Alert className="bg-orange-50 border-orange-200 max-w-md">
          <AlertCircle className="h-4 w-4 text-[#F79E0E]" />
          <AlertTitle className="text-[#F79E0E]">Informasi</AlertTitle>
          <AlertDescription className="text-orange-700">
            Dengan membuat toko, Anda dapat mulai menjual produk dan menjangkau
            pelanggan di platform kami.
          </AlertDescription>
        </Alert>

        <Button
          onClick={() => router.push("/user/toko/create")}
          className="bg-gradient-to-r from-[#F79E0E] to-[#FFB648] hover:from-[#E8890B] hover:to-[#F0A537] text-white font-medium px-6 py-3 rounded-lg shadow-lg shadow-orange-200 transition-all duration-200"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Buat Toko Sekarang
        </Button>
      </div>
    </motion.div>
  );
}
