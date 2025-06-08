import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { StoreAddress } from "../types";
import { AddressCard } from "./AddressCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface AddressListProps {
  addresses: StoreAddress[];
  actionLoading: number | null;
  onSetAsPrimary: (id: number) => Promise<boolean>;
  onDelete: (id: number) => Promise<boolean>;
}

export function AddressList({
  addresses,
  actionLoading,
  onSetAsPrimary,
  onDelete,
}: AddressListProps) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="grid gap-4">
        {addresses.map((address, index) => (
          <motion.div
            key={address.id_alamat_toko}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <AddressCard
              address={address}
              actionLoading={actionLoading}
              onSetAsPrimary={onSetAsPrimary}
              onDelete={onDelete}
            />
          </motion.div>
        ))}
      </div>

      <div className="pt-4">
        <Button
          variant="outline"
          onClick={() => router.push("/toko/profile")}
          className="border-orange-300 text-[#F79E0E] hover:bg-orange-50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali ke Profil Toko
        </Button>
      </div>
    </motion.div>
  );
}
