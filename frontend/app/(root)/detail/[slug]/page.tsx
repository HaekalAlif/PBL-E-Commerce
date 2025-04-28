"use client";

import DetailProduk from "./components/detailbarang";
import Deskripsi from "./components/deskripsi";
import ProdukLain from "./components/produklain";
import { useParams } from "next/navigation";
import { useProductDetail } from "./hooks/useProductDetail";
import { motion } from "framer-motion";

const pageVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { product, loading, error } = useProductDetail(slug);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="min-h-screen bg-gray-50"
    >
      <div className="container mx-auto py-4 bg-orange-50">
        <motion.h1
          className="text-2xl md:text-3xl font-bold text-orange-400 text-center mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Detail Produk
        </motion.h1>
        <DetailProduk product={product} loading={loading} />
        <div>
          <Deskripsi product={product} loading={loading} />
        </div>
        <div>
          <ProdukLain />
        </div>
      </div>
    </motion.div>
  );
}
