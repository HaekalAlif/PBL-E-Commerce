import React from "react";
import { Loader2, X } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Fix import
import { Button } from "@/components/ui/button"; // Fix import
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Fix import
import { Kategori, ImagePreview } from "../types"; // Fix import path
import { Skeleton } from "@/components/ui/skeleton";

interface BarangFormProps {
  formData: any;
  imageFiles: ImagePreview[];
  kategoriList: Kategori[];
  isSubmitting: boolean;
  errors: Record<string, string>;
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: (index: number) => void;
  setPrimaryImage: (index: number) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  isEdit?: boolean;
  isLoading?: boolean;
}

const BarangForm: React.FC<BarangFormProps> = ({
  formData,
  imageFiles,
  kategoriList,
  isSubmitting,
  errors,
  handleInputChange,
  handleSelectChange,
  handleImageChange,
  handleRemoveImage,
  setPrimaryImage,
  handleSubmit,
  isEdit,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="space-y-6 py-6">
          {/* Name Field Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 bg-amber-100" />
            <Skeleton className="h-10 w-full bg-amber-100/50" />
          </div>

          {/* Category Field Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-20 bg-amber-100" />
            <Skeleton className="h-10 w-full bg-amber-100/50" />
          </div>

          {/* Description Field Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-32 bg-amber-100" />
            <Skeleton className="h-32 w-full bg-amber-100/50" />
          </div>

          {/* Price and Grade Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16 bg-amber-100" />
              <Skeleton className="h-10 w-full bg-amber-100/50" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16 bg-amber-100" />
              <Skeleton className="h-10 w-full bg-amber-100/50" />
            </div>
          </div>

          {/* Status and Stock Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24 bg-amber-100" />
              <Skeleton className="h-10 w-full bg-amber-100/50" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16 bg-amber-100" />
              <Skeleton className="h-10 w-full bg-amber-100/50" />
            </div>
          </div>

          {/* Condition Details Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-28 bg-amber-100" />
            <Skeleton className="h-32 w-full bg-amber-100/50" />
          </div>

          {/* Weight and Dimensions Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24 bg-amber-100" />
              <Skeleton className="h-10 w-full bg-amber-100/50" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24 bg-amber-100" />
              <Skeleton className="h-10 w-full bg-amber-100/50" />
            </div>
          </div>

          {/* Images Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-28 bg-amber-100" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-40 w-full rounded-md bg-amber-100/50" />
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between px-6 py-4 border-t">
          <Skeleton className="h-10 w-24 bg-amber-100/50" />
          <Skeleton className="h-10 w-32 bg-amber-100/50" />
        </CardFooter>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="space-y-4">
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Nama Barang */}
            <div className="space-y-2">
              <Label htmlFor="nama_barang">Nama Barang*</Label>
              <Input
                id="nama_barang"
                name="nama_barang"
                value={formData.nama_barang}
                onChange={handleInputChange}
                placeholder="Masukkan nama barang"
                className={`border-gray-200 focus:border-[#F79E0E] focus:ring-[#F79E0E] ${
                  errors.nama_barang ? "border-red-500" : ""
                }`}
              />
              {errors.nama_barang && (
                <p className="text-sm text-red-500">{errors.nama_barang}</p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="id_kategori">
                Kategori <span className="text-red-500">*</span>
              </Label>
              <Select
                onValueChange={(value) =>
                  handleSelectChange("id_kategori", value)
                }
                value={formData.id_kategori}
              >
                <SelectTrigger
                  className={errors.id_kategori ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {kategoriList.map((kategori) => (
                    <SelectItem
                      key={kategori.id_kategori}
                      value={kategori.id_kategori.toString()}
                    >
                      {kategori.nama_kategori}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.id_kategori && (
                <p className="text-sm text-red-500">{errors.id_kategori}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="deskripsi_barang">
                Deskripsi Barang <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="deskripsi_barang"
                name="deskripsi_barang"
                value={formData.deskripsi_barang}
                onChange={handleInputChange}
                placeholder="Masukkan deskripsi barang"
                rows={5}
                className={errors.deskripsi_barang ? "border-red-500" : ""}
              />
              {errors.deskripsi_barang && (
                <p className="text-sm text-red-500">
                  {errors.deskripsi_barang}
                </p>
              )}
            </div>

            {/* Price and Grade */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="harga">
                  Harga (Rp) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="harga"
                  name="harga"
                  type="number"
                  value={formData.harga}
                  onChange={handleInputChange}
                  placeholder="Contoh: 100000"
                  className={errors.harga ? "border-red-500" : ""}
                />
                {errors.harga && (
                  <p className="text-sm text-red-500">{errors.harga}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="grade">
                  Grade <span className="text-red-500">*</span>
                </Label>
                <Select
                  onValueChange={(value) => handleSelectChange("grade", value)}
                  value={formData.grade}
                >
                  <SelectTrigger
                    className={errors.grade ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Pilih grade barang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Seperti Baru">Seperti Baru</SelectItem>
                    <SelectItem value="Bekas Layak Pakai">
                      Bekas Layak Pakai
                    </SelectItem>
                    <SelectItem value="Rusak Ringan">Rusak Ringan</SelectItem>
                    <SelectItem value="Rusak Berat">Rusak Berat</SelectItem>
                  </SelectContent>
                </Select>
                {errors.grade && (
                  <p className="text-sm text-red-500">{errors.grade}</p>
                )}
              </div>
            </div>

            {/* Status and Stock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status_barang">Status Barang</Label>
                <Select
                  onValueChange={(value) =>
                    handleSelectChange("status_barang", value)
                  }
                  value={formData.status_barang}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tersedia">Tersedia</SelectItem>
                    <SelectItem value="Terjual">Terjual</SelectItem>
                    <SelectItem value="Habis">Habis</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stok">
                  Stok <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="stok"
                  name="stok"
                  type="number"
                  value={formData.stok}
                  onChange={handleInputChange}
                  placeholder="Jumlah stok"
                  min={0}
                  className={errors.stok ? "border-red-500" : ""}
                />
                {errors.stok && (
                  <p className="text-sm text-red-500">{errors.stok}</p>
                )}
              </div>
            </div>

            {/* Condition Details */}
            <div className="space-y-2">
              <Label htmlFor="kondisi_detail">
                Detail Kondisi <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="kondisi_detail"
                name="kondisi_detail"
                value={formData.kondisi_detail}
                onChange={handleInputChange}
                placeholder="Jelaskan detail kondisi barang"
                rows={3}
                className={errors.kondisi_detail ? "border-red-500" : ""}
              />
              {errors.kondisi_detail && (
                <p className="text-sm text-red-500">{errors.kondisi_detail}</p>
              )}
            </div>

            {/* Weight and Dimensions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="berat_barang">
                  Berat (gram) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="berat_barang"
                  name="berat_barang"
                  type="number"
                  value={formData.berat_barang}
                  onChange={handleInputChange}
                  placeholder="Berat dalam gram"
                  min={0}
                  step="0.01"
                  className={errors.berat_barang ? "border-red-500" : ""}
                />
                {errors.berat_barang && (
                  <p className="text-sm text-red-500">{errors.berat_barang}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dimensi">
                  Dimensi (pxlxt) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="dimensi"
                  name="dimensi"
                  value={formData.dimensi}
                  onChange={handleInputChange}
                  placeholder="Contoh: 10x5x2 cm"
                  className={errors.dimensi ? "border-red-500" : ""}
                />
                {errors.dimensi && (
                  <p className="text-sm text-red-500">{errors.dimensi}</p>
                )}
              </div>
            </div>

            {/* Images Upload Section */}
            <div className="space-y-2">
              <Label>Gambar Produk*</Label>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-[#F79E0E] transition-colors">
                <input
                  type="file"
                  id="images"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
                <Label htmlFor="images" className="cursor-pointer block">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="p-4 bg-gray-100 rounded-full">
                      <svg
                        className="h-8 w-8 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      Klik untuk upload gambar
                    </span>
                    <span className="text-xs text-gray-500">
                      (Gambar pertama otomatis dijadikan gambar utama)
                    </span>
                  </div>
                </Label>
              </div>

              {errors.images && (
                <p className="text-sm text-red-500">{errors.images}</p>
              )}

              {/* Image Preview */}
              {imageFiles.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                  {imageFiles.map((img, index) => (
                    <div
                      key={index}
                      className="relative border rounded-md overflow-hidden group"
                    >
                      <img
                        src={img.preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-40 object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder-product.png"; // Fallback image
                        }}
                      />
                      <div className="absolute top-0 right-0 p-1">
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
                        <label className="flex items-center space-x-2 text-sm cursor-pointer">
                          <input
                            type="radio"
                            name="primaryImage"
                            checked={img.isPrimary}
                            onChange={() => setPrimaryImage(index)}
                          />
                          <span>Gambar Utama</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#F79E0E] hover:bg-[#E08D0D]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : isEdit ? (
              "Perbarui Produk"
            ) : (
              "Simpan Produk"
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default BarangForm;
