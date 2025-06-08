import { FormData } from "../types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, Phone, MapPin } from "lucide-react";

interface PersonalInfoSectionProps {
  formData: FormData;
  onUpdateFormData: (field: keyof FormData, value: string | boolean) => void;
}

export function PersonalInfoSection({
  formData,
  onUpdateFormData,
}: PersonalInfoSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <User className="h-5 w-5 text-[#F79E0E]" />
        <h3 className="text-lg font-semibold text-gray-900">
          Informasi Pengirim
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nama_pengirim" className="text-gray-700 font-medium">
            Nama Pengirim <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="nama_pengirim"
              placeholder="Masukkan nama pengirim"
              value={formData.nama_pengirim}
              onChange={(e) =>
                onUpdateFormData("nama_pengirim", e.target.value)
              }
              required
              className="pl-10 border-orange-300 focus:border-[#F79E0E] focus:ring-[#F79E0E]"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="no_telepon" className="text-gray-700 font-medium">
            Nomor Telepon <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="no_telepon"
              placeholder="Masukkan nomor telepon"
              value={formData.no_telepon}
              onChange={(e) => onUpdateFormData("no_telepon", e.target.value)}
              required
              className="pl-10 border-orange-300 focus:border-[#F79E0E] focus:ring-[#F79E0E]"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="alamat_lengkap" className="text-gray-700 font-medium">
          Alamat Lengkap <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Textarea
            id="alamat_lengkap"
            placeholder="Masukkan alamat lengkap (nama jalan, nomor rumah, RT/RW, dll)"
            value={formData.alamat_lengkap}
            onChange={(e) => onUpdateFormData("alamat_lengkap", e.target.value)}
            required
            rows={3}
            className="pl-10 border-orange-300 focus:border-[#F79E0E] focus:ring-[#F79E0E] resize-none"
          />
        </div>
      </div>
    </div>
  );
}
