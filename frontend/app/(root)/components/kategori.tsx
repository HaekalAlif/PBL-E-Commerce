"use client";

import React from "react";
import { useKategori } from "./hooks/useKategori";
import {
  FaThLarge,
  FaRecycle,
  FaLeaf,
  FaHeart,
  FaSync,
  FaTree,
  FaShieldAlt,
} from "react-icons/fa";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export default function Kategori() {
  const { kategori, loading } = useKategori();

  const decorElements = {
    right: [
      { icon: FaRecycle, text: "Ramah Lingkungan" },
      { icon: FaTree, text: "Sustainable" },
    ],
    left: [
      { icon: FaHeart, text: "Pre-loved Items" },
      { icon: FaSync, text: "Second Chance" },
    ],
  };

  if (loading) {
    return (
      <section className="relative py-16 bg-gradient-to-b from-[#FFF8EF] to-white">
        <div className="absolute inset-0 opacity-5" />
        <div className="relative">
          <h2 className="text-2xl md:text-3xl text-center font-bold text-[#F79E0E] mb-3">
            Jelajahi Kategori
          </h2>
          <p className="text-gray-500 text-center mb-8 max-w-lg mx-auto">
            Temukan berbagai produk menarik dari setiap kategori
          </p>
          <div className="container px-4 mx-auto">
            <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide md:justify-center md:flex-wrap">
              {[...Array(8)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="flex-shrink-0 w-[110px] h-[120px] md:w-[130px] md:h-[140px] rounded-xl bg-orange-100/50"
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-8 bg-gradient-to-b from-[#FFF8EF] to-white overflow-hidden">
      {/* Background Pattern */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.05 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 "
      />

      {/* Left Decorative Elements */}
      <div className="fixed-container">
        <div className="absolute left-4 lg:left-12 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-8">
          {decorElements.left.map((elem, index) => (
            <motion.div
              key={`left-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: index * 0.3,
                duration: 0.5,
                ease: "easeOut",
              }}
              className="flex flex-col items-center gap-2 text-orange-400"
            >
              <elem.icon className="w-6 h-6" />
              <span className="text-xs font-medium text-gray-600 writing-vertical-lr transform-none">
                {elem.text}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Right Decorative Elements */}
        <div className="absolute right-4 lg:right-12 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-8">
          {decorElements.right.map((elem, index) => (
            <motion.div
              key={`right-${index}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: index * 0.3,
                duration: 0.5,
                ease: "easeOut",
              }}
              className="flex flex-col items-center gap-2 text-orange-400"
            >
              <elem.icon className="w-6 h-6" />
              <span className="text-xs font-medium text-gray-600 writing-vertical-lr">
                {elem.text}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="relative">
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-[#F79E0E] mb-2">
            Jelajahi Kategori
          </h2>
          <div className="flex items-center justify-center gap-2 text-gray-600 text-sm px-4">
            <FaShieldAlt className="w-4 h-4 text-orange-400 flex-shrink-0" />
            <p className="text-center">
              Temukan barang bekas berkualitas dari berbagai kategori
            </p>
          </div>
        </motion.div>

        <div className="container px-4 mx-auto max-w-5xl">
          <motion.div
            className="flex overflow-x-auto gap-3 pb-4 scrollbar-hide md:justify-center md:flex-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {kategori.slice(0, 8).map((cat, index) => (
              <motion.div
                key={cat.id_kategori}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.3,
                  ease: "easeOut",
                }}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.2 },
                }}
                className="group flex-shrink-0 bg-gradient-to-br from-[#F79E0E] to-[#F7AB2E] text-white 
                  w-[90px] h-[100px] md:w-[110px] md:h-[120px] rounded-xl 
                  flex flex-col justify-center items-center gap-3
                  shadow-md hover:shadow-lg hover:shadow-orange-200
                  border border-orange-200/20 relative overflow-hidden"
              >
                {/* Recycled Icon Watermark */}
                <div className="absolute -right-4 -bottom-4 opacity-10">
                  <FaRecycle className="w-16 h-16" />
                </div>

                {cat.logo ? (
                  <div className="w-9 h-9 md:w-10 md:h-10 relative group-hover:scale-110 transition-transform duration-300">
                    <div className="absolute inset-0 bg-white/10 rounded-full blur-md" />
                    <img
                      src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${cat.logo}`}
                      alt={cat.nama_kategori}
                      className="relative w-full h-full object-contain drop-shadow-md"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/placeholder-category.png";
                      }}
                    />
                  </div>
                ) : (
                  <div className="text-lg md:text-xl group-hover:scale-110 transition-transform duration-300">
                    <FaThLarge className="drop-shadow-md" />
                  </div>
                )}
                <span className="text-xs md:text-sm font-medium text-center px-2 leading-snug">
                  {cat.nama_kategori}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Add this to your global CSS or component styles
const styles = `
.fixed-container {
  @apply max-w-[1920px] mx-auto relative;
}

.writing-vertical-lr {
  writing-mode: vertical-lr;
}
`;
