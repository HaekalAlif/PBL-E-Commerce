"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight, Loader2, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFeaturedProducts } from "./hooks/useFeaturedProducts";
import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Skeleton } from "@/components/ui/skeleton";
import { useAddToCart } from "../keranjang/hooks/useAddToCart";

interface Product {
  id_barang: number;
  nama_barang: string;
  slug: string;
  harga: number;
  gambarBarang?: Array<{
    url_gambar: string;
    is_primary: boolean;
  }>;
  gambar_barang?: Array<{
    url_gambar: string;
    is_primary: boolean;
  }>;
}

const ProductSkeleton = () => (
  <div className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/6 pl-4">
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="relative h-44 w-full overflow-hidden">
        <div className="w-full h-full bg-gradient-to-r from-amber-200 to-amber-300 animate-pulse" />
      </div>
      <div className="p-3 bg-gradient-to-b from-white to-gray-50">
        <div className="space-y-2">
          <div className="h-4 w-3/4 bg-gradient-to-r from-amber-100 to-amber-200 rounded animate-pulse" />
          <div className="h-5 w-1/2 bg-gradient-to-r from-amber-200 to-amber-300 rounded animate-pulse" />
        </div>
        <div className="h-9 w-full bg-gradient-to-r from-amber-100 to-amber-200 rounded-lg mt-3 animate-pulse" />
      </div>
    </div>
  </div>
);

export default function ProdukUnggulan() {
  const router = useRouter();
  const { products, loading, error } = useFeaturedProducts();
  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));
  const { addingToCart, handleAddToCart } = useAddToCart();

  const hasProductImage = (product: Product) => {
    return Boolean(
      (product.gambarBarang && product.gambarBarang.length > 0) ||
        (product.gambar_barang && product.gambar_barang.length > 0)
    );
  };

  const getProductImage = (product: Product) => {
    const imageUrl =
      product.gambarBarang?.[0]?.url_gambar ||
      product.gambar_barang?.[0]?.url_gambar;

    if (imageUrl) {
      // Check if the URL already includes the backend URL to prevent double prefixing
      if (imageUrl.startsWith("http")) {
        return imageUrl;
      }
      return `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${imageUrl}`;
    }
    return "/placeholder-product.png";
  };

  if (loading) {
    return (
      <section className="bg-gradient-to-br from-[#F79E0E] to-[#FFB648] py-12 px-4 sm:px-6 relative shadow-lg">
        <h2 className="text-[26px] sm:text-[32px] text-white font-bold text-center mb-8 relative">
          Produk Unggulan
        </h2>
        <div className="max-w-[1400px] mx-auto">
          <div className="flex gap-4 overflow-hidden">
            {[...Array(6)].map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !products?.length) {
    return null;
  }

  const containerVariants = {
    hidden: {
      opacity: 0,
      y: 50,
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.43, 0.13, 0.23, 0.96], // Custom easing
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.9,
    },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const handleProductClick = (slug: string) => {
    router.push(`/detail/${slug}`);
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
      className="bg-gradient-to-br from-[#F79E0E] to-[#FFB648] py-12 px-4 sm:px-6 relative shadow-lg"
    >
      <div className="absolute inset-0 opacity-10" />

      <motion.h2
        variants={itemVariants}
        className="text-[26px] sm:text-[32px] text-white font-bold text-center mb-8 relative"
      >
        Produk Unggulan
      </motion.h2>

      <div className="max-w-[1400px] mx-auto">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[plugin.current]}
          className="w-full relative"
        >
          <CarouselContent>
            {products.map((product, index) => (
              <CarouselItem
                key={product.id_barang}
                className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/6 pl-4"
              >
                <motion.div
                  variants={itemVariants}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  onClick={() => handleProductClick(product.slug)}
                  className="bg-white rounded-xl shadow-xl overflow-hidden cursor-pointer transform transition-all duration-200 hover:shadow-2xl"
                >
                  {/* Product Image */}
                  <div className="relative h-44 w-full overflow-hidden group">
                    {hasProductImage(product) ? (
                      <motion.img
                        src={getProductImage(product)}
                        alt={product.nama_barang}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          console.log(
                            "Image failed to load:",
                            (e.target as HTMLImageElement).src
                          );
                          (e.target as HTMLImageElement).src =
                            "/placeholder-product.png";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                        <p className="text-gray-400">No Image</p>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {/* Product Info */}
                  <div className="p-3 bg-gradient-to-b from-white to-gray-50">
                    <h3 className="text-base font-bold line-clamp-1 text-gray-800 mb-1">
                      {product.nama_barang}
                    </h3>
                    <p className="text-yellow-600 text-base font-bold mb-3">
                      Rp {product.harga.toLocaleString("id-ID")}
                    </p>
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 bg-[#F79E0E] text-white text-sm py-2 px-3 rounded-lg font-semibold shadow-md hover:bg-[#E08D0D] transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProductClick(product.slug);
                        }}
                      >
                        Beli Sekarang
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-3 bg-white border border-[#F79E0E] text-[#F79E0E] rounded-lg hover:bg-[#F79E0E]/5"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(
                            product.id_barang,
                            product.nama_barang
                          );
                        }}
                        disabled={addingToCart === product.id_barang}
                      >
                        {addingToCart === product.id_barang ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <ShoppingCart className="h-5 w-5" />
                        )}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute -left-4 lg:-left-6" />
          <CarouselNext className="absolute -right-4 lg:-right-6" />
        </Carousel>
      </div>
    </motion.section>
  );
}
