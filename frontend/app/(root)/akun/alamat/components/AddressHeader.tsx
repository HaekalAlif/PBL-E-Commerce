import { MapPin, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface AddressHeaderProps {
  title: string;
  description: string;
}

export const AddressHeader = ({ title, description }: AddressHeaderProps) => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between mb-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#F79E0E] to-[#FFB648] text-white shadow-lg shadow-orange-100">
          <MapPin className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            {title}
          </h1>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Button
          onClick={() => router.push("/akun/alamat/create")}
          className="bg-[#F79E0E] hover:bg-[#E08D0D]"
        >
          <Plus className="w-5 h-5 mr-2" />
          Tambah Alamat
        </Button>
      </motion.div>
    </div>
  );
};
