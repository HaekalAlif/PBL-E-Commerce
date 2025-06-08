import { StoreFormData } from "../types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Store } from "lucide-react";

interface StoreInfoSectionProps {
  formData: StoreFormData;
  onUpdateFormData: (field: keyof StoreFormData, value: string) => void;
}

export function StoreInfoSection({
  formData,
  onUpdateFormData,
}: StoreInfoSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-orange-50 text-[#F79E0E]">
          <Store className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Informasi Toko
          </h3>
          <p className="text-sm text-gray-500">
            Isi informasi dasar tentang toko Anda
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="nama_toko" className="text-gray-700 font-medium">
            Nama Toko <span className="text-red-500">*</span>
          </Label>
          <Input
            id="nama_toko"
            type="text"
            placeholder="Masukkan nama toko"
            value={formData.nama_toko}
            onChange={(e) => onUpdateFormData("nama_toko", e.target.value)}
            className="border-orange-300 focus:border-[#F79E0E] focus:ring-[#F79E0E]"
            required
          />
          <p className="text-xs text-gray-500">
            Nama ini akan ditampilkan kepada pelanggan Anda (minimal 3 karakter)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="deskripsi" className="text-gray-700 font-medium">
            Deskripsi Toko <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="deskripsi"
            placeholder="Ceritakan tentang toko Anda dan produk yang dijual..."
            value={formData.deskripsi}
            onChange={(e) => onUpdateFormData("deskripsi", e.target.value)}
            className="min-h-[120px] border-orange-300 focus:border-[#F79E0E] focus:ring-[#F79E0E] resize-none"
            required
          />
          <p className="text-xs text-gray-500">
            Jelaskan tentang toko dan produk Anda (minimal 20 karakter)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="kontak" className="text-gray-700 font-medium">
            Kontak <span className="text-red-500">*</span>
          </Label>
          <Input
            id="kontak"
            type="text"
            placeholder="Nomor telepon / WhatsApp"
            value={formData.kontak}
            onChange={(e) => onUpdateFormData("kontak", e.target.value)}
            className="border-orange-300 focus:border-[#F79E0E] focus:ring-[#F79E0E]"
            required
          />
          <p className="text-xs text-gray-500">
            Kontak yang bisa dihubungi pelanggan (minimal 8 karakter)
          </p>
        </div>
      </div>
    </div>
  );
}
