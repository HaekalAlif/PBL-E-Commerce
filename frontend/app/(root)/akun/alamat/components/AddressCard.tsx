import { motion } from "framer-motion";
import { MapPin, Star, Pencil, Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AddressCardProps } from "../types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const AddressCard = ({
  address,
  onSetPrimary,
  onDelete,
  isSettingPrimary,
  isDeleting,
}: AddressCardProps) => {
  const router = useRouter();

  const getRegionName = (type: "province" | "regency" | "district") => {
    if (address[type]?.name) {
      return address[type].name;
    }
    return address[
      type === "province"
        ? "provinsi"
        : type === "regency"
        ? "kota"
        : "kecamatan"
    ];
  };

  const handleDelete = async (id: number) => {
    try {
      await onDelete(id);
      toast.success("Alamat berhasil dihapus", {
        description: "Alamat telah dihapus dari daftar Anda",
      });
    } catch (error) {
      toast.error("Gagal menghapus alamat", {
        description: "Terjadi kesalahan saat menghapus alamat",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 border ${
        address.is_primary ? "border-[#F79E0E]" : "border-gray-200"
      } rounded-xl hover:border-[#F79E0E] transition-colors bg-white`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-[#F79E0E] flex-shrink-0 mt-1" />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium">{address.nama_penerima}</h3>
              {address.is_primary && (
                <span className="flex items-center gap-1 text-xs text-[#F79E0E]">
                  <Star className="w-3 h-3 fill-current" />
                  Utama
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600">{address.no_telepon}</p>
            <p className="text-sm text-gray-600 mt-1">
              {address.alamat_lengkap}
              <br />
              {getRegionName("district")}, {getRegionName("regency")},{" "}
              {getRegionName("province")} {address.kode_pos}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() =>
              router.push(`/akun/alamat/edit/${address.id_alamat}`)
            }
            className="p-2 text-gray-600 hover:text-[#F79E0E] hover:bg-orange-50 rounded-lg transition-colors"
          >
            <Pencil className="w-5 h-5" />
          </button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="border-orange-100">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-gray-900">
                  Hapus Alamat
                </AlertDialogTitle>
                <AlertDialogDescription className="text-gray-500">
                  Apakah Anda yakin ingin menghapus alamat ini? Tindakan ini
                  tidak dapat dibatalkan.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-[#F79E0E] text-[#F79E0E] hover:bg-orange-50">
                  Batal
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDelete(address.id_alamat)}
                  disabled={isDeleting}
                  className="bg-[#F79E0E] hover:bg-[#E08D0D] text-white border-none"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Menghapus...
                    </>
                  ) : (
                    "Hapus"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {!address.is_primary && (
            <button
              onClick={() => onSetPrimary(address.id_alamat)}
              disabled={isSettingPrimary}
              className="p-2 text-[#F79E0E] hover:bg-orange-50 rounded-lg transition-colors"
            >
              {isSettingPrimary ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Star className="w-5 h-5" />
              )}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
