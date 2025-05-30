import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { AlertTriangle, Upload, X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import axiosInstance, { getCsrfTokenFromCookie } from "@/lib/axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface KomplainFormProps {
  isOpen: boolean;
  onClose: () => void;
  purchaseId: number;
  onSuccess?: () => void;
}

export function KomplainForm({
  isOpen,
  onClose,
  purchaseId,
  onSuccess,
}: KomplainFormProps) {
  const [alasanKomplain, setAlasanKomplain] = useState("");
  const [isiKomplain, setIsiKomplain] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const alasanOptions = [
    "Barang Tidak Sesuai",
    "Barang Rusak",
    "Barang Tidak Sampai",
    "Lainnya",
  ];

  const handleCleanup = () => {
    setAlasanKomplain("");
    setIsiKomplain("");
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
    if (!alasanKomplain) {
      toast.error("Mohon pilih alasan komplain");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("alasan_komplain", alasanKomplain);
    formData.append("isi_komplain", isiKomplain);
    if (image) {
      formData.append("bukti_komplain", image);
    }

    try {
      console.log("Debug formData:", {
        alasan: alasanKomplain,
        isi: isiKomplain,
        hasImage: !!image,
      });

      const token = await getCsrfTokenFromCookie();
      const response = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_URL}/komplain/${purchaseId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
            "X-XSRF-TOKEN": token ?? "",
          },
          withCredentials: true,
        }
      );

      if (response.data.status === "success") {
        toast.success("Komplain berhasil diajukan");
        handleCleanup();
        onSuccess?.();
        onClose();
      } else {
        throw new Error(response.data.message || "Gagal mengajukan komplain");
      }
    } catch (error: any) {
      console.error("Validation Errors:", error.response?.data?.errors);

      if (error.response?.data?.errors) {
        Object.values(error.response.data.errors).forEach((errorMsg: any) => {
          toast.error(Array.isArray(errorMsg) ? errorMsg[0] : errorMsg);
        });
      } else {
        toast.error(error.response?.data?.message || "Gagal mengajukan komplain");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 bg-white overflow-hidden">
        <div className="relative h-14 bg-gradient-to-r from-orange-50 to-amber-50 flex items-center justify-center">
          <DialogTitle className="text-lg font-medium text-[#F79E0E]">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Ajukan Komplain</span>
            </div>
          </DialogTitle>
          <div className="absolute inset-0 bg-[#F79E0E]/5"></div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Alasan Komplain
            </label>
            <Select
              value={alasanKomplain}
              onValueChange={setAlasanKomplain}
              required
            >
              <SelectTrigger className="bg-gray-50/50 border-gray-200 focus:ring-[#F79E0E]/20">
                <SelectValue placeholder="Pilih alasan komplain" />
              </SelectTrigger>
              <SelectContent>
                {alasanOptions.map((alasan) => (
                  <SelectItem key={alasan} value={alasan}>
                    {alasan}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Detail Komplain
            </label>
            <Textarea
              value={isiKomplain}
              onChange={(e) => setIsiKomplain(e.target.value)}
              placeholder="Jelaskan detail masalah yang Anda alami..."
              className="min-h-[120px] bg-gray-50/50 border-gray-200 focus:ring-[#F79E0E]/20"
              required
            />
          </div>

          {/* Image upload section with consistent styling */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Bukti Foto (Wajib)
            </label>
            {imagePreview ? (
              <div className="relative w-full aspect-video bg-gray-50 rounded-lg overflow-hidden border-2 border-dashed border-gray-200">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-contain"
                />
                <button
                  type="button"
                  onClick={handleCleanup}
                  className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            ) : (
              <div className="relative">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                  className="hidden"
                  id="komplain-image"
                />
                <label
                  htmlFor="komplain-image"
                  className="w-full h-36 rounded-lg border-2 border-dashed border-gray-200 hover:border-[#F79E0E] hover:bg-orange-50/50 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
                    <Upload className="h-5 w-5 text-[#F79E0E]" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700">
                      Upload Foto Bukti
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      JPG, PNG (max. 2MB)
                    </p>
                  </div>
                </label>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="text-gray-600 hover:bg-gray-50/50"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#F79E0E] hover:bg-[#F79E0E]/90 text-white"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Mengirim...</span>
                </div>
              ) : (
                "Kirim Komplain"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
