import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { FilterX, MapPin, Tag, DollarSign, Award, SortAsc } from "lucide-react";
import { Category, Province, Regency, FilterOptions } from "../types";

interface FilterSidebarProps {
  categories: Category[];
  provinces: Province[];
  regencies: Regency[];
  filters: FilterOptions;
  onFilterChange: (key: keyof FilterOptions, value: any) => void;
  onClearFilters: () => void;
}

const gradeOptions = [
  "Seperti Baru",
  "Bekas Layak Pakai",
  "Rusak Ringan",
  "Rusak Berat",
];
const sortOptions = [
  { value: "created_at", label: "Terbaru" },
  { value: "harga", label: "Harga" },
  { value: "nama_barang", label: "Nama" },
];

export function FilterSidebar({
  categories,
  provinces,
  regencies,
  filters,
  onFilterChange,
  onClearFilters,
}: FilterSidebarProps) {
  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === "sortBy" && value === "created_at") return false;
    if (key === "sortOrder" && value === "desc") return false;
    return value !== null && value !== "";
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-md rounded-2xl overflow-hidden sticky top-4">
        {/* Decorative header background */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-br from-amber-400/10 via-orange-400/5 to-amber-300/10" />

        <CardHeader className="pb-4 relative">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="p-2 bg-gradient-to-br from-amber-400 to-orange-400 rounded-xl shadow-lg"
              >
                <Tag className="h-5 w-5 text-white" />
              </motion.div>
              <span className="bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
                Filter Produk
              </span>
            </CardTitle>
            {hasActiveFilters && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearFilters}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl"
                >
                  <FilterX className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              </motion.div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-8 relative">
          {/* Location Filter with enhanced styling */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3 text-gray-700">
              <div className="p-2 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                <MapPin className="h-4 w-4 text-blue-500" />
              </div>
              <Label className="font-semibold text-gray-800">Lokasi Toko</Label>
            </div>

            <div className="space-y-4 pl-6 border-l-2 border-blue-100">
              <div>
                <Label className="text-sm text-gray-600 mb-2 block">
                  Provinsi
                </Label>
                <Select
                  value={filters.province || "all"}
                  onValueChange={(value) => {
                    onFilterChange("province", value === "all" ? null : value);
                  }}
                >
                  <SelectTrigger className="w-full border-gray-300 focus:border-blue-400 rounded-xl bg-white/70 backdrop-blur-sm">
                    <SelectValue placeholder="Pilih Provinsi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Provinsi</SelectItem>
                    {provinces.map((province) => (
                      <SelectItem key={province.id} value={province.id}>
                        {province.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {filters.province && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                >
                  <Label className="text-sm text-gray-600 mb-2 block">
                    Kota/Kabupaten
                  </Label>
                  <Select
                    value={filters.regency || "all"}
                    onValueChange={(value) =>
                      onFilterChange("regency", value === "all" ? null : value)
                    }
                  >
                    <SelectTrigger className="w-full border-gray-300 focus:border-blue-400 rounded-xl bg-white/70 backdrop-blur-sm">
                      <SelectValue placeholder="Pilih Kota/Kabupaten" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Kota/Kabupaten</SelectItem>
                      {regencies.map((regency) => (
                        <SelectItem key={regency.id} value={regency.id}>
                          {regency.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>
              )}
            </div>
          </motion.div>

          <Separator className="bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

          {/* Price Range with enhanced styling */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3 text-gray-700">
              <div className="p-2 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                <DollarSign className="h-4 w-4 text-green-500" />
              </div>
              <Label className="font-semibold text-gray-800">
                Rentang Harga
              </Label>
            </div>

            <div className="pl-6 border-l-2 border-green-100">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm text-gray-600 mb-2 block">
                    Min
                  </Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={filters.minPrice || ""}
                    onChange={(e) =>
                      onFilterChange(
                        "minPrice",
                        e.target.value ? parseInt(e.target.value) : null
                      )
                    }
                    className="border-gray-300 focus:border-green-400 rounded-xl bg-white/70 backdrop-blur-sm"
                  />
                </div>
                <div>
                  <Label className="text-sm text-gray-600 mb-2 block">
                    Max
                  </Label>
                  <Input
                    type="number"
                    placeholder="∞"
                    value={filters.maxPrice || ""}
                    onChange={(e) =>
                      onFilterChange(
                        "maxPrice",
                        e.target.value ? parseInt(e.target.value) : null
                      )
                    }
                    className="border-gray-300 focus:border-green-400 rounded-xl bg-white/70 backdrop-blur-sm"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          <Separator className="bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

          {/* Grade Filter with enhanced styling */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3 text-gray-700">
              <div className="p-2 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg">
                <Award className="h-4 w-4 text-amber-500" />
              </div>
              <Label className="font-semibold text-gray-800">
                Kondisi Barang
              </Label>
            </div>

            <div className="pl-6 border-l-2 border-amber-100">
              <div className="grid grid-cols-1 gap-2">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant={filters.grade === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => onFilterChange("grade", null)}
                    className={`w-full justify-start text-xs rounded-xl transition-all duration-200 ${
                      filters.grade === null
                        ? "bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-lg"
                        : "border-gray-300 text-gray-600 hover:border-amber-300 hover:text-amber-600 bg-white/70"
                    }`}
                  >
                    Semua Kondisi
                  </Button>
                </motion.div>
                {gradeOptions.map((grade) => (
                  <motion.div
                    key={grade}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant={filters.grade === grade ? "default" : "outline"}
                      size="sm"
                      onClick={() => onFilterChange("grade", grade)}
                      className={`w-full justify-start text-xs rounded-xl transition-all duration-200 ${
                        filters.grade === grade
                          ? "bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-lg"
                          : "border-gray-300 text-gray-600 hover:border-amber-300 hover:text-amber-600 bg-white/70"
                      }`}
                    >
                      {grade}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <Separator className="bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

          {/* Sort Filter with enhanced styling */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 text-gray-700">
              <SortAsc className="h-4 w-4 text-[#F79E0E]" />
              <Label className="font-medium">Urutkan</Label>
            </div>

            <div className="space-y-3">
              <Select
                value={filters.sortBy}
                onValueChange={(value) => onFilterChange("sortBy", value)}
              >
                <SelectTrigger className="w-full border-gray-300 focus:border-[#F79E0E] rounded-xl bg-white/70 backdrop-blur-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Button
                  variant={filters.sortOrder === "desc" ? "default" : "outline"}
                  size="sm"
                  onClick={() => onFilterChange("sortOrder", "desc")}
                  className={`flex-1 text-xs rounded-xl ${
                    filters.sortOrder === "desc"
                      ? "bg-[#F79E0E] hover:bg-[#E08D0D] text-white"
                      : "border-gray-300 text-gray-600 hover:border-[#F79E0E] hover:text-[#F79E0E] bg-white/70"
                  }`}
                >
                  Menurun
                </Button>
                <Button
                  variant={filters.sortOrder === "asc" ? "default" : "outline"}
                  size="sm"
                  onClick={() => onFilterChange("sortOrder", "asc")}
                  className={`flex-1 text-xs rounded-xl ${
                    filters.sortOrder === "asc"
                      ? "bg-[#F79E0E] hover:bg-[#E08D0D] text-white"
                      : "border-gray-300 text-gray-600 hover:border-[#F79E0E] hover:text-[#F79E0E] bg-white/70"
                  }`}
                >
                  Menaik
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <>
              <Separator className="bg-gray-200" />
              <div className="space-y-2">
                <Label className="font-medium text-gray-700">
                  Filter Aktif:
                </Label>
                <div className="flex flex-wrap gap-1">
                  {filters.category && (
                    <Badge variant="secondary" className="text-xs">
                      Kategori:{" "}
                      {
                        categories.find((c) => c.slug === filters.category)
                          ?.nama_kategori
                      }
                    </Badge>
                  )}
                  {filters.province && (
                    <Badge variant="secondary" className="text-xs">
                      Provinsi:{" "}
                      {provinces.find((p) => p.id === filters.province)?.name}
                    </Badge>
                  )}
                  {filters.regency && (
                    <Badge variant="secondary" className="text-xs">
                      Kota:{" "}
                      {regencies.find((r) => r.id === filters.regency)?.name}
                    </Badge>
                  )}
                  {filters.grade && (
                    <Badge variant="secondary" className="text-xs">
                      {filters.grade}
                    </Badge>
                  )}
                  {(filters.minPrice || filters.maxPrice) && (
                    <Badge variant="secondary" className="text-xs">
                      Harga: {filters.minPrice || 0} - {filters.maxPrice || "∞"}
                    </Badge>
                  )}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
