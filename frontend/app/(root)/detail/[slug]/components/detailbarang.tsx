"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { ProductDetail } from "../hooks/useProductDetail";
import { useProductActions } from "../hooks/useProductActions";
import { ChevronLeft, ChevronRight, Store } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DetailProdukProps {
  product: ProductDetail | null;
  loading: boolean;
}

export default function DetailProduk({ product, loading }: DetailProdukProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const router = useRouter();

  const { addingToCart, handleBuyNow, handleMakeOffer, handleAddToCart } =
    useProductActions(product);

  const handleQuantity = (type: "inc" | "dec") => {
    if (type === "inc" && quantity < (product?.stok || 0)) {
      setQuantity((q) => q + 1);
    } else if (type === "dec" && quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  const getImageUrl = (imageUrl: string | undefined) => {
    if (!imageUrl) return "/placeholder-product.png";
    if (imageUrl.startsWith("http")) return imageUrl;
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${imageUrl}`;
  };

  if (loading) {
    return (
      <div className="bg-white py-8 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Left Column - Image Skeleton */}
            <div className="space-y-4">
              <div className="aspect-square w-full max-w-[420px] mx-auto bg-amber-50 rounded-lg animate-pulse" />
              <div className="grid grid-cols-6 gap-2 max-w-[420px] mx-auto">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-md bg-amber-100/50 animate-pulse"
                  />
                ))}
              </div>
            </div>

            {/* Right Column - Info Skeleton */}
            <div className="flex flex-col h-full">
              <div className="space-y-6">
                {/* Store Card Skeleton */}
                <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white animate-pulse" />
                      <div className="space-y-2">
                        <div className="h-4 w-32 bg-white rounded animate-pulse" />
                        <div className="h-3 w-24 bg-white/70 rounded animate-pulse" />
                      </div>
                    </div>
                    <div className="w-24 h-9 bg-white rounded-lg animate-pulse" />
                  </div>
                </div>

                {/* Product Info Skeleton */}
                <div className="space-y-4">
                  <div className="h-7 w-3/4 bg-amber-100 rounded animate-pulse" />
                  <div className="h-9 w-1/2 bg-amber-200 rounded animate-pulse" />
                </div>

                {/* Specifications Skeleton */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-20 h-4 bg-amber-100 rounded animate-pulse" />
                      <div className="h-4 w-32 bg-amber-100/70 rounded animate-pulse" />
                    </div>
                  ))}
                </div>

                {/* Actions Skeleton */}
                <div className="bg-white rounded-xl border p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="w-32 h-4 bg-amber-100 rounded animate-pulse" />
                    <div className="w-20 h-4 bg-amber-100 rounded animate-pulse" />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="h-12 bg-amber-200 rounded-lg animate-pulse" />
                    <div className="h-12 bg-amber-100 rounded-lg animate-pulse" />
                    <div className="h-12 bg-amber-100 rounded-lg animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left Column - Images */}
          <div className="relative">
            <div className="sticky top-24">
              {/* Main Image Container */}
              <div className="aspect-square relative w-full max-w-[420px] mx-auto rounded-lg overflow-hidden bg-gray-50 border">
                <motion.img
                  key={selectedImageIndex}
                  src={getImageUrl(
                    product?.gambar_barang?.[selectedImageIndex]?.url_gambar
                  )}
                  alt={product?.nama_barang}
                  className="w-full h-full object-contain"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                {/* Navigation Arrows */}
                {product.gambar_barang && product.gambar_barang.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setSelectedImageIndex((i) =>
                          i > 0 ? i - 1 : product.gambar_barang!.length - 1
                        )
                      }
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() =>
                        setSelectedImageIndex((i) =>
                          i < product.gambar_barang!.length - 1 ? i + 1 : 0
                        )
                      }
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-6 gap-2 mt-4 max-w-[420px] mx-auto">
                {product.gambar_barang.map((image, index) => (
                  <motion.button
                    key={image.id_gambar}
                    className={`relative rounded-md overflow-hidden h-20
                      ${
                        selectedImageIndex === index
                          ? "ring-2 ring-amber-500 ring-offset-2"
                          : "ring-1 ring-gray-200 hover:ring-amber-200"
                      }`}
                    onClick={() => setSelectedImageIndex(index)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img
                      src={getImageUrl(image.url_gambar)}
                      alt={`${product.nama_barang} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div className="flex flex-col h-full">
            <div className="space-y-6 py-4">
              {/* Store Card */}
              <motion.div
                className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl p-4 border border-amber-100 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-white rounded-lg shadow-sm">
                      <Store className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {product?.toko?.nama_toko}
                      </p>
                      <p className="text-sm text-gray-600">
                        Toko Terverifikasi
                      </p>
                    </div>
                  </div>
                  <button className="px-4 py-2 text-sm font-medium text-amber-500 bg-white rounded-lg border border-amber-200 hover:bg-amber-50 transition-colors">
                    Kunjungi Toko
                  </button>
                </div>
              </motion.div>

              {/* Product Title & Price */}
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {product?.nama_barang}
                </h1>
                <p className="text-3xl font-bold text-amber-500">
                  Rp {product?.harga?.toLocaleString("id-ID")}
                </p>
              </div>

              {/* Product Specifications */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Kondisi</p>
                    <p className="font-medium">{product?.kondisi_detail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Berat</p>
                    <p className="font-medium">{product?.berat_barang} gram</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full">
                    Grade {product?.grade}
                  </span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                    {product?.kategori?.nama_kategori}
                  </span>
                </div>
              </div>

              {/* Quantity and Actions Section */}
              <div className="bg-white rounded-xl border p-4 space-y-4">
                {/* Quantity Selector */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">
                      Jumlah
                    </span>
                    <div className="flex items-center border rounded-lg">
                      <button
                        onClick={() => handleQuantity("dec")}
                        disabled={quantity <= 1}
                        className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-medium">
                        {quantity}
                      </span>
                      <button
                        onClick={() => handleQuantity("inc")}
                        disabled={quantity >= (product?.stok || 0)}
                        className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    Stok: <span className="font-medium">{product?.stok}</span>
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-3 bg-amber-500 text-white rounded-lg font-medium 
            hover:bg-amber-600 transition-colors text-sm sm:text-base
            flex items-center justify-center gap-2"
                    onClick={() => handleBuyNow(quantity)}
                  >
                    <span className="whitespace-nowrap">Beli Sekarang</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-3 border border-amber-500 text-amber-500 
            rounded-lg font-medium hover:bg-amber-50 transition-colors
            text-sm sm:text-base flex items-center justify-center gap-2"
                    onClick={() => handleMakeOffer(quantity)}
                  >
                    <span className="whitespace-nowrap">Tawar</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={addingToCart}
                    className="px-4 py-3 border border-amber-500 text-amber-500 
            rounded-lg font-medium hover:bg-amber-50 transition-colors
            text-sm sm:text-base flex items-center justify-center gap-2
            disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handleAddToCart(quantity)}
                  >
                    <span className="whitespace-nowrap">
                      {addingToCart ? "Menambahkan..." : "+ Keranjang"}
                    </span>
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
