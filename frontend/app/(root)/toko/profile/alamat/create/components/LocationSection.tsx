import { FormData, RegionData, LoadingStates } from "../types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Loader2 } from "lucide-react";

interface LocationSectionProps {
  formData: FormData;
  regionData: RegionData;
  loading: LoadingStates;
  onUpdateFormData: (field: keyof FormData, value: string | boolean) => void;
}

export function LocationSection({
  formData,
  regionData,
  loading,
  onUpdateFormData,
}: LocationSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="h-5 w-5 text-[#F79E0E]" />
        <h3 className="text-lg font-semibold text-gray-900">
          Informasi Lokasi
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="provinsi" className="text-gray-700 font-medium">
            Provinsi <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.provinsi}
            onValueChange={(value) => onUpdateFormData("provinsi", value)}
            disabled={loading.provinces}
          >
            <SelectTrigger className="border-orange-300 focus:border-[#F79E0E] focus:ring-[#F79E0E]">
              <SelectValue
                placeholder={
                  loading.provinces ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Memuat provinsi...
                    </div>
                  ) : (
                    "Pilih provinsi"
                  )
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Provinsi</SelectLabel>
                {regionData.provinces.map((province) => (
                  <SelectItem key={province.id} value={province.id}>
                    {province.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="kota" className="text-gray-700 font-medium">
            Kota/Kabupaten <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.kota}
            onValueChange={(value) => onUpdateFormData("kota", value)}
            disabled={!formData.provinsi || loading.regencies}
          >
            <SelectTrigger className="border-orange-300 focus:border-[#F79E0E] focus:ring-[#F79E0E]">
              <SelectValue
                placeholder={
                  !formData.provinsi ? (
                    "Pilih provinsi dulu"
                  ) : loading.regencies ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Memuat kota...
                    </div>
                  ) : (
                    "Pilih kota/kabupaten"
                  )
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Kota/Kabupaten</SelectLabel>
                {regionData.regencies.map((regency) => (
                  <SelectItem key={regency.id} value={regency.id}>
                    {regency.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="kecamatan" className="text-gray-700 font-medium">
            Kecamatan <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.kecamatan}
            onValueChange={(value) => onUpdateFormData("kecamatan", value)}
            disabled={!formData.kota || loading.districts}
          >
            <SelectTrigger className="border-orange-300 focus:border-[#F79E0E] focus:ring-[#F79E0E]">
              <SelectValue
                placeholder={
                  !formData.kota ? (
                    "Pilih kota dulu"
                  ) : loading.districts ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Memuat kecamatan...
                    </div>
                  ) : (
                    "Pilih kecamatan"
                  )
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Kecamatan</SelectLabel>
                {regionData.districts.map((district) => (
                  <SelectItem key={district.id} value={district.id}>
                    {district.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="kode_pos" className="text-gray-700 font-medium">
            Kode Pos <span className="text-red-500">*</span>
          </Label>
          <Input
            id="kode_pos"
            placeholder="Masukkan kode pos"
            value={formData.kode_pos}
            onChange={(e) => onUpdateFormData("kode_pos", e.target.value)}
            required
            className="border-orange-300 focus:border-[#F79E0E] focus:ring-[#F79E0E]"
          />
        </div>
      </div>
      
    </div>
  );
}
