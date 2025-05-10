import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle, Check, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { EditAddressFormProps } from "../types";

export const EditAddressForm = ({
  formData,
  loading,
  error,
  provinces,
  regencies,
  districts,
  loadingProvinces,
  loadingRegencies,
  loadingDistricts,
  handleInputChange,
  handleSelectChange,
  handleCheckboxChange,
  handleSubmit,
  onCancel,
}: EditAddressFormProps) => {
  return (
    <Card className="border-orange-100 shadow-sm">
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 p-6">
          {error && (
            <Alert variant="destructive" className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-red-600">Error</AlertTitle>
              <AlertDescription className="text-red-600">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="space-y-2">
              <Label htmlFor="nama_penerima">Nama Penerima*</Label>
              <Input
                id="nama_penerima"
                name="nama_penerima"
                placeholder="Masukkan nama penerima"
                value={formData.nama_penerima}
                onChange={handleInputChange}
                className="border-gray-200 focus:border-[#F79E0E] focus:ring-[#F79E0E]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="no_telepon">Nomor Telepon*</Label>
              <Input
                id="no_telepon"
                name="no_telepon"
                placeholder="Masukkan nomor telepon"
                value={formData.no_telepon}
                onChange={handleInputChange}
                className="border-gray-200 focus:border-[#F79E0E] focus:ring-[#F79E0E]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="alamat_lengkap">Alamat Lengkap*</Label>
              <Textarea
                id="alamat_lengkap"
                name="alamat_lengkap"
                placeholder="Masukkan alamat lengkap"
                value={formData.alamat_lengkap}
                onChange={handleInputChange}
                className="border-gray-200 focus:border-[#F79E0E] focus:ring-[#F79E0E]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="provinsi">Provinsi*</Label>
              <Select
                value={formData.provinsi}
                onValueChange={(value) => handleSelectChange("provinsi", value)}
                disabled={loadingProvinces}
              >
                <SelectTrigger
                  id="provinsi"
                  className="border-gray-200 focus:border-[#F79E0E] focus:ring-[#F79E0E]"
                >
                  <SelectValue
                    placeholder={
                      loadingProvinces ? "Memuat provinsi..." : "Pilih provinsi"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Provinsi</SelectLabel>
                    {provinces?.map((province: any) => (
                      <SelectItem key={province.id} value={province.id}>
                        {province.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="kota">Kota/Kabupaten*</Label>
              <Select
                value={formData.kota}
                onValueChange={(value) => handleSelectChange("kota", value)}
                disabled={!formData.provinsi || loadingRegencies}
              >
                <SelectTrigger
                  id="kota"
                  className="border-gray-200 focus:border-[#F79E0E] focus:ring-[#F79E0E]"
                >
                  <SelectValue
                    placeholder={
                      !formData.provinsi
                        ? "Pilih provinsi terlebih dahulu"
                        : loadingRegencies
                        ? "Memuat kota..."
                        : "Pilih kota"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Kota/Kabupaten</SelectLabel>
                    {regencies?.map((regency: any) => (
                      <SelectItem key={regency.id} value={regency.id}>
                        {regency.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="kecamatan">Kecamatan*</Label>
              <Select
                value={formData.kecamatan}
                onValueChange={(value) =>
                  handleSelectChange("kecamatan", value)
                }
                disabled={!formData.kota || loadingDistricts}
              >
                <SelectTrigger
                  id="kecamatan"
                  className="border-gray-200 focus:border-[#F79E0E] focus:ring-[#F79E0E]"
                >
                  <SelectValue
                    placeholder={
                      !formData.kota
                        ? "Pilih kota terlebih dahulu"
                        : loadingDistricts
                        ? "Memuat kecamatan..."
                        : "Pilih kecamatan"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Kecamatan</SelectLabel>
                    {districts?.map((district: any) => (
                      <SelectItem key={district.id} value={district.id}>
                        {district.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="kode_pos">Kode Pos*</Label>
              <Input
                id="kode_pos"
                name="kode_pos"
                placeholder="Masukkan kode pos"
                value={formData.kode_pos}
                onChange={handleInputChange}
                className="border-gray-200 focus:border-[#F79E0E] focus:ring-[#F79E0E]"
                required
              />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="is_primary"
                checked={formData.is_primary}
                onCheckedChange={handleCheckboxChange}
                className="border-gray-200 data-[state=checked]:bg-[#F79E0E] data-[state=checked]:border-[#F79E0E]"
              />
              <Label htmlFor="is_primary" className="text-sm text-gray-600">
                Jadikan sebagai alamat utama
              </Label>
            </div>
          </motion.div>
        </CardContent>

        <CardFooter className="flex justify-between gap-4 px-6 py-4 border-t border-orange-100">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="border-[#F79E0E] text-[#F79E0E] hover:bg-orange-50"
          >
            Batal
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-[#F79E0E] hover:bg-[#E08D0D]"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              "Perbarui Alamat"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
