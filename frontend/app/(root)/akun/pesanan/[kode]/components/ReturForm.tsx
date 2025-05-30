import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, AlertTriangle, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { toast } from "sonner";
import axiosInstance, { getCsrfTokenFromCookie } from "@/lib/axios";

const PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ReturFormProps {
  isOpen: boolean;
  onClose: () => void;
  komplainId: number;
  pembelianId: number;
  detailPembelianId: number;
  onSuccess?: () => void;
}

const ALASAN_OPTIONS = [
  "Barang Rusak",
  "Tidak Sesuai Deskripsi",
  "Salah Kirim",
  "Lainnya",
];

export function ReturForm({
  isOpen,
  onClose,
  komplainId,
  pembelianId,
  detailPembelianId,
  onSuccess,
}: ReturFormProps) {
  const [alasanRetur, setAlasanRetur] = useState("");
  const [deskripsiRetur, setDeskripsiRetur] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCleanup = () => {
    setAlasanRetur("");
    setDeskripsiRetur("");
    setImage(null);
    setImagePreview(null);
  };

  const handleClose = () => {
    handleCleanup();
    onClose();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Early validation for required IDs
    if (!komplainId || !pembelianId || !detailPembelianId) {
      console.error("Missing required IDs:", {
        komplainId,
        pembelianId,
        detailPembelianId,
      });
      toast.error("Data pembelian tidak lengkap");
      return;
    }

    if (!alasanRetur) {
      toast.error("Mohon pilih alasan retur");
      return;
    }

    if (!deskripsiRetur) {
      toast.error("Mohon isi deskripsi retur");
      return;
    }

    if (!image) {
      toast.error("Mohon sertakan foto bukti");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("id_komplain", komplainId.toString());
      formData.append("id_pembelian", pembelianId.toString());
      formData.append("id_detail_pembelian", detailPembelianId.toString());
      formData.append("alasan_retur", alasanRetur);
      formData.append("deskripsi_retur", deskripsiRetur);
      formData.append("foto_bukti", image);

      const token = getCsrfTokenFromCookie();
      const response = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_URL}/retur`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-XSRF-TOKEN": token || "",
          },
          withCredentials: true,
        }
      );

      if (response.data.status === "success") {
        toast.success("Pengajuan retur berhasil dibuat");
        handleCleanup();
        onSuccess?.();
        onClose();
      }
    } catch (error: any) {
      console.error("Error submitting retur:", error);
      toast.error(
        error.response?.data?.message ||
          "Gagal mengajukan retur. Pastikan semua data telah diisi dengan benar."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] p-0 bg-white overflow-hidden">
        <div className="relative h-14 bg-gradient-to-r from-orange-50 to-amber-50 flex items-center justify-center">
          <DialogTitle className="text-lg font-medium text-[#F79E0E]">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Ajukan Retur Barang</span>
            </div>
          </DialogTitle>
          <div className="absolute inset-0 bg-[#F79E0E]/5"></div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Alasan Retur
            </label>
            <Select value={alasanRetur} onValueChange={setAlasanRetur} required>
              <SelectTrigger className="bg-gray-50/50 border-gray-200 focus:ring-[#F79E0E]/20">
                <SelectValue placeholder="Pilih alasan retur" />
              </SelectTrigger>
              <SelectContent>
                {ALASAN_OPTIONS.map((alasan) => (
                  <SelectItem key={alasan} value={alasan}>
                    {alasan}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Detail Retur
            </label>
            <Textarea
              value={deskripsiRetur}
              onChange={(e) => setDeskripsiRetur(e.target.value)}
              placeholder="Jelaskan detail kondisi barang yang ingin diretur..."
              className="min-h-[120px] bg-gray-50/50 border-gray-200 focus:ring-[#F79E0E]/20"
              required
            />
          </div>

          {/* Image upload section */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Foto Bukti (Wajib)
            </label>
            <div className="relative">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="foto-bukti"
                required={!imagePreview}
              />
              {!imagePreview ? (
                <label
                  htmlFor="foto-bukti"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 border-gray-300"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="h-6 w-6 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">
                      Klik untuk upload foto bukti
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      PNG, JPG, JPEG (max. 2MB)
                    </p>
                  </div>
                </label>
              ) : (
                <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-gray-200">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-contain"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={() => {
                      setImage(null);
                      setImagePreview(null);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#F79E0E] hover:bg-[#F79E0E]/90 text-white"
            >
              {isSubmitting ? "Mengirim..." : "Ajukan Retur"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
