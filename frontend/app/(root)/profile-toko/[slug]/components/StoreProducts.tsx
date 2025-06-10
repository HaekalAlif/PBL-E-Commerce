import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  ShoppingCart,
  Package,
  RefreshCw,
  SlidersHorizontal,
} from "lucide-react";
import { useStoreProducts } from "../hooks/useStoreProducts";
import { useStoreCategories } from "../hooks/useStoreCategories";
import { useAddToCart } from "../../../keranjang/hooks/useAddToCart";
import { formatRupiah } from "@/lib/utils";
import Link from "next/link";

interface StoreProductsProps {
  storeSlug: string;
}

const ProductSkeleton = () => (
  <Card className="group overflow-hidden border-0 bg-white shadow-sm hover:shadow-md transition-all duration-300">
    <div className="aspect-square bg-gradient-to-br from-amber-50 to-orange-50 animate-pulse" />
    <CardContent className="p-4 space-y-3">
      <div className="h-4 bg-gradient-to-r from-amber-100 to-orange-100 rounded animate-pulse" />
      <div className="h-4 w-2/3 bg-gradient-to-r from-amber-100 to-orange-100 rounded animate-pulse" />
      <div className="h-6 w-1/2 bg-gradient-to-r from-amber-200 to-orange-200 rounded animate-pulse" />
      <div className="flex gap-2 pt-2">
        <div className="flex-1 h-8 bg-gradient-to-r from-amber-100 to-orange-100 rounded animate-pulse" />
        <div className="w-8 h-8 bg-gradient-to-r from-amber-100 to-orange-100 rounded animate-pulse" />
      </div>
    </CardContent>
  </Card>
);

export function StoreProducts({ storeSlug }: StoreProductsProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [grade, setGrade] = useState<string>("all");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const { addingToCart, handleAddToCart } = useAddToCart();
  const { categories } = useStoreCategories(storeSlug);

  const { products, loading, error, totalPages } = useStoreProducts({
    slug: storeSlug,
    category: selectedCategory === "all" ? undefined : selectedCategory,
    search: search || undefined,
    minPrice,
    maxPrice,
    grade: grade === "all" ? undefined : grade,
    sortBy,
    sortOrder,
    page: currentPage,
  });

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
    { value: "stok", label: "Stok" },
  ];

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("all");
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setGrade("all");
    setSortBy("created_at");
    setSortOrder("desc");
    setCurrentPage(1);
  };

  const hasActiveFilters = useMemo(() => {
    return (
      search ||
      selectedCategory !== "all" ||
      minPrice ||
      maxPrice ||
      grade !== "all" ||
      sortBy !== "created_at" ||
      sortOrder !== "desc"
    );
  }, [search, selectedCategory, minPrice, maxPrice, grade, sortBy, sortOrder]);

  const ProductCard = ({ product }: { product: any }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Card className="overflow-hidden border-0 bg-white shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col">
        <Link href={`/detail/${product.slug}`}>
          <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
            {product.gambarBarang && product.gambarBarang.length > 0 ? (
              <motion.img
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                src={product.gambarBarang[0].url_gambar} // URL sudah lengkap dari backend
                alt={product.nama_barang}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "/placeholder-product.png";
                }}
              />
            ) : product.gambar_barang && product.gambar_barang.length > 0 ? (
              <motion.img
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                src={product.gambar_barang[0].url_gambar} // URL sudah lengkap dari backend
                alt={product.nama_barang}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "/placeholder-product.png";
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <Package className="h-16 w-16 text-gray-400" />
              </div>
            )}

            <div className="absolute top-3 left-3">
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs px-2 py-1 shadow-sm">
                {product.grade}
              </Badge>
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </Link>

        <CardContent className="p-4 flex-1 flex flex-col">
          <Link href={`/detail/${product.slug}`}>
            <h3 className="font-semibold text-gray-800 line-clamp-2 hover:text-amber-600 transition-colors mb-2 min-h-[3rem]">
              {product.nama_barang}
            </h3>
          </Link>

          <div className="mb-3">
            <p className="text-xl font-bold text-amber-600">
              {formatRupiah(product.harga)}
            </p>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge
                variant="outline"
                className="border-gray-200 text-gray-600 text-xs"
              >
                {product.kategori.nama_kategori}
              </Badge>
              {product.stok > 0 && (
                <Badge
                  variant="secondary"
                  className="bg-green-50 text-green-600 text-xs"
                >
                  Stok: {product.stok}
                </Badge>
              )}
            </div>
          </div>

          <div className="mt-auto flex gap-2">
            <motion.div
              className="flex-1"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link href={`/detail/${product.slug}`}>
                <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-sm font-medium shadow-sm">
                  Lihat Detail
                </Button>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  handleAddToCart(product.id_barang, product.nama_barang);
                }}
                variant="outline"
                disabled={
                  product.stok === 0 || addingToCart === product.id_barang
                }
                className="px-3 border-gray-200 text-gray-600 hover:border-amber-500 hover:text-amber-500 hover:bg-amber-50"
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      {/* Header & Controls */}
      <div className="space-y-6">
        {/* Search & Filter Controls */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Cari produk di toko ini..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-12 border-gray-200 focus:border-amber-500 focus:ring-amber-500/20 rounded-xl h-12"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className={`border-gray-200 ${
                  showFilters ? "bg-amber-50 border-amber-200" : ""
                }`}
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t border-gray-100"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Kategori
                  </label>
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger className="border-gray-200 focus:border-amber-500">
                      <SelectValue placeholder="Semua Kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Kategori</SelectItem>
                      {categories.map((category) => (
                        <SelectItem
                          key={category.id_kategori}
                          value={category.slug}
                        >
                          {category.nama_kategori} ({category.product_count})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Harga Min
                  </label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={minPrice || ""}
                    onChange={(e) =>
                      setMinPrice(
                        e.target.value ? parseInt(e.target.value) : undefined
                      )
                    }
                    className="border-gray-200 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Harga Max
                  </label>
                  <Input
                    type="number"
                    placeholder="∞"
                    value={maxPrice || ""}
                    onChange={(e) =>
                      setMaxPrice(
                        e.target.value ? parseInt(e.target.value) : undefined
                      )
                    }
                    className="border-gray-200 focus:border-amber-500"
                  />
                </div>

                {/* Grade Filter */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Kondisi
                  </label>
                  <Select value={grade} onValueChange={setGrade}>
                    <SelectTrigger className="border-gray-200 focus:border-amber-500">
                      <SelectValue placeholder="Semua Kondisi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Kondisi</SelectItem>
                      {gradeOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Urutkan
                  </label>
                  <div className="flex gap-2">
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="border-gray-200 focus:border-amber-500">
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
                    <Button
                      variant={sortOrder === "asc" ? "default" : "outline"}
                      size="sm"
                      onClick={() =>
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                      }
                      className={
                        sortOrder === "asc"
                          ? "bg-amber-500 hover:bg-amber-600"
                          : "border-gray-200"
                      }
                    >
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <div className="mt-4 flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
                    className="text-red-500 border-red-200 hover:bg-red-50"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset Filter
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id_barang} product={product} />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 max-w-md mx-auto">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Tidak ada produk ditemukan
            </h3>
            <p className="text-gray-500 mb-6">
              Coba ubah filter pencarian atau kata kunci Anda
            </p>
            <Button
              onClick={clearFilters}
              variant="outline"
              className="border-gray-200"
            >
              Reset Filter
            </Button>
          </div>
        </motion.div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center pt-8">
          <div className="flex gap-2 bg-white rounded-lg shadow-sm border border-gray-100 p-2">
            {[...Array(totalPages)].map((_, i) => (
              <Button
                key={i}
                variant={currentPage === i + 1 ? "default" : "ghost"}
                size="sm"
                onClick={() => setCurrentPage(i + 1)}
                className={
                  currentPage === i + 1
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                    : "text-gray-600 hover:bg-gray-50"
                }
              >
                {i + 1}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
