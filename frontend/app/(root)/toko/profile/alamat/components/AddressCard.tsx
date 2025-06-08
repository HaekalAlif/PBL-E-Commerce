import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { StoreAddress } from "../types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle2,
  Edit,
  Trash2,
  Loader2,
  MapPin,
  Phone,
} from "lucide-react";
import { DeleteAddressDialog } from "./DeleteAddressDialog";

interface AddressCardProps {
  address: StoreAddress;
  actionLoading: number | null;
  onSetAsPrimary: (id: number) => Promise<boolean>;
  onDelete: (id: number) => Promise<boolean>;
}

export function AddressCard({
  address,
  actionLoading,
  onSetAsPrimary,
  onDelete,
}: AddressCardProps) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleSetAsPrimary = async () => {
    await onSetAsPrimary(address.id_alamat_toko);
  };

  const handleDelete = async () => {
    const success = await onDelete(address.id_alamat_toko);
    if (success) {
      setShowDeleteDialog(false);
    }
    return success;
  };

  const isActionLoading = actionLoading === address.id_alamat_toko;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-white rounded-xl border p-6 transition-all duration-200 hover:shadow-md ${
          address.is_primary
            ? "border-[#F79E0E] ring-1 ring-[#F79E0E]/20 bg-orange-50/30"
            : "border-orange-300 hover:border-[#F79E0E]/50"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#F79E0E]" />
                <h3 className="text-lg font-semibold text-gray-900">
                  {address.nama_pengirim}
                </h3>
              </div>
              {address.is_primary && (
                <Badge className="bg-[#F79E0E] text-white">Alamat Utama</Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Phone className="h-4 w-4" />
              <span>{address.no_telepon}</span>
            </div>
          </div>

          <div className="flex gap-2 mt-3 sm:mt-0">
            {!address.is_primary && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleSetAsPrimary}
                disabled={isActionLoading}
                className="border-[#F79E0E] text-[#F79E0E] hover:bg-orange-50"
              >
                {isActionLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                )}
                Jadikan Utama
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                router.push(
                  `/toko/profile/alamat/edit/${address.id_alamat_toko}`
                )
              }
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowDeleteDialog(true)}
              disabled={isActionLoading}
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              {isActionLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : (
                <Trash2 className="h-4 w-4 mr-1" />
              )}
              Hapus
            </Button>
          </div>
        </div>

        <Separator className="my-4 bg-orange-100" />

        <div className="space-y-2">
          <p className="text-gray-800 leading-relaxed">
            {address.alamat_lengkap}
          </p>
          <p className="text-sm text-gray-500">
            {address.province?.name && `${address.province.name}, `}
            {address.regency?.name && `${address.regency.name}, `}
            {address.district?.name && `${address.district.name}, `}
            {address.kode_pos}
          </p>
        </div>
      </motion.div>

      <DeleteAddressDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        addressName={address.nama_pengirim}
      />
    </>
  );
}
