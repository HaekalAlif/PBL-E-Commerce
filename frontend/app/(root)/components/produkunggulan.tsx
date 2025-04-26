"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
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
    <div className="bg-white rounded-xl shadow-xl overflow-hidden">
      <div className="relative h-44 w-full">
        <Skeleton className="h-full w-full" />
      </div>
      <div className="p-3">
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-5 w-1/2 mb-3" />
        <Skeleton className="h-8 w-full" />
      </div>
    </div>
  </div>
);

export default function ProdukUnggulan() {
  const router = useRouter();
  const { products, loading, error } = useFeaturedProducts();
  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));

  const hasProductImage = (product: Product) => {
    return Boolean(
      (product.gambarBarang && product.gambarBarang.length > 0) ||
        (product.gambar_barang && product.gambar_barang.length > 0)
    );
  };

  const getProductImage = (product: Product) => {
    return (
      product.gambarBarang?.[0]?.url_gambar ||
      product.gambar_barang?.[0]?.url_gambar ||
      "/placeholder-product.png"
    );
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
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.section
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="bg-gradient-to-br from-[#F79E0E] to-[#FFB648] py-12 px-4 sm:px-6 relative shadow-lg"
    >
      <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10" />

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
                  className="bg-white rounded-xl shadow-xl overflow-hidden cursor-pointer"
                >
                  <div className="relative h-44 w-full overflow-hidden group">
                    {hasProductImage(product) ? (
                      <motion.img
                        src={getProductImage(product)}
                        alt={product.nama_barang}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
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

                  <div className="p-3 bg-gradient-to-b from-white to-gray-50">
                    <h3 className="text-base font-bold line-clamp-1 text-gray-800 mb-1">
                      {product.nama_barang}
                    </h3>
                    <p className="text-yellow-600 text-base font-bold mb-3">
                      Rp {product.harga.toLocaleString("id-ID")}
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-[#F79E0E] text-white text-sm py-2 px-3 rounded-lg font-semibold shadow-md hover:bg-[#E08D0D] transition-colors"
                      onClick={() =>
                        router.push(`/user/katalog/detail/${product.slug}`)
                      }
                    >
                      Beli Sekarang
                    </motion.button>
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
