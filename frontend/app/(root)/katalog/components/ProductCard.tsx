import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ShoppingCart, Store } from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import { Product } from "../types";
import { useAddToCart } from "../../keranjang/hooks/useAddToCart";

interface ProductCardProps {
  product: Product;
  processingBuyNow: number | null;
  onBuyNow: (product: Product) => void;
}

export function ProductCard({
  product,
  processingBuyNow,
  onBuyNow,
}: ProductCardProps) {
  const { addingToCart, handleAddToCart } = useAddToCart();

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleAddToCart(product.id_barang, product.nama_barang);
  };

  const handleBuyNowClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onBuyNow(product);
  };

  const isOutOfStock =
    product.stok === 0 || product.status_barang !== "Tersedia";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
      className="group h-full"
    >
      <Card className="overflow-hidden border border-gray-200 shadow-sm hover:shadow-md bg-white transition-all duration-200 h-full flex flex-col">
        {/* Image Section */}
        <Link href={`/detail/${product.slug}`}>
          <div className="relative h-48 w-full overflow-hidden bg-gray-50">
            {(product.gambarBarang && product.gambarBarang.length > 0) ||
            (product.gambar_barang && product.gambar_barang.length > 0) ? (
              <motion.img
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                src={
                  product.gambarBarang?.[0]?.url_gambar ||
                  product.gambar_barang?.[0]?.url_gambar
                }
                alt={product.nama_barang}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "/placeholder-product.png";
                }}
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <p className="text-gray-400 text-sm">No Image</p>
              </div>
            )}

            {/* Out of stock overlay */}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Badge
                  variant="destructive"
                  className="bg-red-500 text-white text-xs"
                >
                  Stok Habis
                </Badge>
              </div>
            )}

            {/* Grade Badge */}
            <div className="absolute top-2 left-2">
              <Badge className="bg-[#F79E0E] text-white text-xs px-2 py-1">
                {product.grade}
              </Badge>
            </div>
          </div>
        </Link>

        {/* Content Section */}
        <CardContent className="p-3 flex-1 flex flex-col">
          <Link
            href={`/detail/${product.slug}`}
            className="no-underline text-black flex-1"
          >
            <h3 className="font-medium text-sm text-gray-800 line-clamp-2 hover:text-[#F79E0E] transition-colors mb-2 min-h-[2.5rem]">
              {product.nama_barang}
            </h3>
          </Link>

          {/* Price */}
          <div className="mb-3">
            <p className="text-lg font-bold text-[#F79E0E]">
              {formatRupiah(product.harga)}
            </p>
          </div>

          {/* Store and Category Info */}
          <div className="space-y-2 mb-3">
            <div className="flex items-center text-xs text-gray-500 gap-1">
              <Store className="h-3 w-3" />
              <span className="truncate">{product.toko.nama_toko}</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Badge
                variant="outline"
                className="border-gray-300 text-gray-600 text-xs px-2 py-0.5"
              >
                {product.kategori.nama_kategori}
              </Badge>
              {product.stok > 0 && (
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-700 text-xs px-2 py-0.5"
                >
                  Stok: {product.stok}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>

        {/* Action Buttons */}
        <CardFooter className="p-3 pt-0 gap-2">
          <motion.div
            className="flex-1"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={handleBuyNowClick}
              disabled={isOutOfStock || processingBuyNow === product.id_barang}
              className="w-full bg-[#F79E0E] hover:bg-[#E08D0D] text-white text-xs py-2 h-8 font-medium transition-colors disabled:opacity-50"
            >
              {processingBuyNow === product.id_barang ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  Loading...
                </>
              ) : (
                "Beli Sekarang"
              )}
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleAddToCartClick}
              variant="outline"
              disabled={isOutOfStock || addingToCart === product.id_barang}
              className="px-3 py-2 h-8 border-gray-300 text-gray-600 hover:border-[#F79E0E] hover:text-[#F79E0E] hover:bg-[#F79E0E]/5 text-xs transition-colors disabled:opacity-50"
            >
              {addingToCart === product.id_barang ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <ShoppingCart className="h-3 w-3" />
              )}
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
