import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { StoreProfile, StoreAddress, StoreFormData } from "../types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Phone,
  Edit,
  Trash2,
  Link2,
  PlusCircle,
  MapPin,
  AlertCircle,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { EditStoreDialog } from "./EditStoreDialog";
import { DeleteStoreDialog } from "./DeleteStoreDialog";

interface StoreInfoCardProps {
  profile: StoreProfile;
  storeAddresses: StoreAddress[];
  loadingAddresses: boolean;
  addressError: string | null;
  isUpdating: boolean;
  onUpdate: (data: StoreFormData) => Promise<boolean>;
  onDelete: () => Promise<boolean>;
  onCopyLink: () => void;
}

export function StoreInfoCard({
  profile,
  storeAddresses,
  loadingAddresses,
  addressError,
  isUpdating,
  onUpdate,
  onDelete,
  onCopyLink,
}: StoreInfoCardProps) {
  const router = useRouter();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleUpdate = async (data: StoreFormData): Promise<boolean> => {
    const success = await onUpdate(data);
    if (success) {
      setShowEditDialog(false);
    }
    return success;
  };

  const handleDelete = async (): Promise<boolean> => {
    const success = await onDelete();
    if (success) {
      setShowDeleteDialog(false);
    }
    return success;
  };

  const renderAddressSection = () => {
    if (loadingAddresses) {
      return (
        <div className="space-y-2">
          <div className="h-4 bg-orange-100 rounded animate-pulse" />
          <div className="h-4 bg-orange-100/80 rounded animate-pulse w-3/4" />
        </div>
      );
    }

    if (addressError) {
      return (
        <Alert variant="destructive" className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{addressError}</AlertDescription>
        </Alert>
      );
    }

    if (storeAddresses.length === 0) {
      return (
        <Alert className="bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <AlertTitle className="text-amber-800">Perhatian</AlertTitle>
          <AlertDescription className="text-amber-700">
            Anda belum menambahkan alamat untuk toko ini. Tambahkan alamat untuk
            memulai berjualan.
          </AlertDescription>
        </Alert>
      );
    }

    const primaryAddress = storeAddresses.find((addr) => addr.is_primary);

    return (
      <div className="space-y-3">
        {primaryAddress ? (
          <div className="p-4 border border-orange-200 rounded-lg bg-orange-50/30">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="font-medium text-gray-900">
                  {primaryAddress.nama_pengirim}
                </div>
                <div className="text-gray-700 text-sm">
                  {primaryAddress.no_telepon}
                </div>
              </div>
              <Badge className="bg-[#F79E0E] text-white">Utama</Badge>
            </div>
            <div className="text-gray-700 text-sm">
              {primaryAddress.alamat_lengkap}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {primaryAddress.province?.name}, {primaryAddress.regency?.name},{" "}
              {primaryAddress.district?.name}, {primaryAddress.kode_pos}
            </div>
          </div>
        ) : (
          <Alert className="bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <AlertTitle className="text-amber-800">Perhatian</AlertTitle>
            <AlertDescription className="text-amber-700">
              Anda memiliki {storeAddresses.length} alamat, tetapi belum
              menetapkan alamat utama.
            </AlertDescription>
          </Alert>
        )}
      </div>
    );
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-orange-300 p-6 space-y-6"
      >
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">
              {profile.nama_toko}
            </h2>
            <div className="flex items-center gap-2">
              {profile.is_active ? (
                <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                  Aktif
                </Badge>
              ) : (
                <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
                  Tidak Aktif
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={onCopyLink}
                className="text-xs text-gray-500 hover:text-[#F79E0E] p-1"
              >
                <Link2 className="h-3 w-3 mr-1" /> Salin Link
              </Button>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowEditDialog(true)}
              className="border-[#F79E0E] text-[#F79E0E] hover:bg-orange-50"
            >
              <Edit className="h-4 w-4 mr-1" /> Edit
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowDeleteDialog(true)}
              className="border-red-300 text-red-500 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-1" /> Hapus
            </Button>
          </div>
        </div>

        <Separator className="bg-orange-100" />

        {/* Description */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-gray-900">Deskripsi</h3>
          <p className="text-gray-600 whitespace-pre-line leading-relaxed">
            {profile.deskripsi}
          </p>
        </div>

        {/* Contact */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-orange-50">
            <Phone className="h-4 w-4 text-[#F79E0E]" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900">Kontak</h3>
            <p className="text-gray-600">{profile.kontak}</p>
          </div>
        </div>

        {/* Address Section */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-[#F79E0E]" />
              <h3 className="text-lg font-medium text-gray-900">
                Alamat Pengiriman
              </h3>
            </div>
            <Button
              onClick={() => router.push("/toko/profile/alamat")}
              variant="outline"
              size="sm"
              className="border-[#F79E0E] text-[#F79E0E] hover:bg-orange-50"
            >
              Kelola Alamat
            </Button>
          </div>

          {renderAddressSection()}

          <div className="flex gap-2">
            <Button
              onClick={() => router.push("/toko/profile/alamat")}
              variant="outline"
              size="sm"
              className="text-gray-600 border-gray-300"
            >
              Lihat Semua ({storeAddresses.length})
            </Button>
            <Button
              onClick={() => router.push("/toko/profile/alamat/create")}
              variant="outline"
              size="sm"
              className="border-[#F79E0E] text-[#F79E0E] hover:bg-orange-50"
            >
              <PlusCircle className="h-3 w-3 mr-1" />
              Tambah Baru
            </Button>
          </div>
        </div>
      </motion.div>

      <EditStoreDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        profile={profile}
        onSave={handleUpdate}
        isLoading={isUpdating}
      />

      <DeleteStoreDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
      />
    </>
  );
}
