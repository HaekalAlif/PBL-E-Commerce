"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useRecommendedProducts } from "./hooks/useRecommendedProducts";
import { RecommendedProduct } from "./hooks/useRecommendedProducts";
import { useAddToCart } from "../keranjang/hooks/useAddToCart";
import { Loader2, ShoppingCart } from "lucide-react";

const containerVariants = {
  hidden: {
    opacity: 0,
    y: 50,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.43, 0.13, 0.23, 0.96],
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const getProductImage = (product: RecommendedProduct) => {
  const imageUrl = product.gambar_barang?.[0]?.url_gambar;

  if (imageUrl) {
    // Check if the URL already includes the backend URL to prevent double prefixing
    if (imageUrl.startsWith("http")) {
      return imageUrl;
    }
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${imageUrl}`;
  }
  return "/placeholder-product.png";
};

const LoadingSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
    <div className="relative">
      <div className="w-full h-60 xl:h-72 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
    </div>
    <div className="flex flex-col gap-2 p-4 bg-[#F79E0E]">
      <div className="space-y-2">
        <div className="h-5 w-3/4 bg-white/30 rounded animate-pulse" />
        <div className="h-4 w-1/2 bg-white/30 rounded animate-pulse" />
      </div>
      <div className="h-10 w-full bg-white/30 rounded animate-pulse mt-2" />
    </div>
  </div>
);

export default function Rekomendasi() {
  const router = useRouter();
  const { products, loading, error } = useRecommendedProducts();
  const { addingToCart, handleAddToCart } = useAddToCart();

  return (
    <>
      <section className="py-6 bg-white">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="flex flex-col items-center"
        >
          <motion.h2
            variants={itemVariants}
            className="text-2xl md:text-3xl font-bold text-[#F79E0E] mb-3"
          >
            Rekomendasi
          </motion.h2>
        </motion.div>
      </section>

      <section className="py-10 bg-amber-50">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-[1920px]">
          {loading ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"
            >
              {[...Array(12)].map((_, index) => (
                <motion.div key={index} variants={itemVariants} custom={index}>
                  <LoadingSkeleton />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"
            >
              {products.map((product) => (
                <motion.div
                  key={product.id_barang}
                  variants={itemVariants}
                  className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer flex flex-col"
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => router.push(`/detail/${product.slug}`)}
                >
                  <div className="relative group">
                    {product.gambar_barang &&
                    product.gambar_barang.length > 0 ? (
                      <img
                        src={getProductImage(product)}
                        alt={product.nama_barang}
                        className="w-full h-60 xl:h-72 object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/placeholder-product.png";
                        }}
                      />
                    ) : (
                      <div className="w-full h-60 xl:h-72 bg-gray-100 flex items-center justify-center">
                        <p className="text-gray-400">No Image</p>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  <div className="flex flex-col gap-2 p-4 bg-[#F79E0E] flex-grow">
                    <div>
                      <h3 className="text-lg text-white font-medium mb-1">
                        {product.nama_barang}
                      </h3>
                      <p className="text-white font-semibold">
                        Rp {product.harga.toLocaleString("id-ID")}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/detail/${product.slug}`);
                        }}
                        className="flex-1 bg-white text-[#F79E0E] py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200 shadow-sm"
                      >
                        Lihat Detail
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(
                            product.id_barang,
                            product.nama_barang
                          );
                        }}
                        disabled={addingToCart === product.id_barang}
                        className="px-4 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                      >
                        {addingToCart === product.id_barang ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <ShoppingCart className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* View All Link */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex justify-center mt-12"
          >
            <motion.button
              onClick={() => router.push("/user/katalog")}
              className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-400 text-white rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px]"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Lihat Semua Produk</span>
              <span className="transform transition-transform group-hover:translate-x-1">
                →
              </span>
            </motion.button>
          </motion.div>
        </div>
      </section>
    </>
  );
}
