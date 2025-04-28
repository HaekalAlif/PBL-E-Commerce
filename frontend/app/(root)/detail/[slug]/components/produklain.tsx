"use client";

import { useRouter } from "next/navigation";
import { useRecommendedProducts } from "@/app/(root)/components/hooks/useRecommendedProducts";
import { motion } from "framer-motion";

export default function ProdukLain() {
  const router = useRouter();
  const { products, loading, error } = useRecommendedProducts();

  const getProductImage = (product: any) => {
    const imageUrl = product.gambar_barang?.[0]?.url_gambar;
    if (imageUrl) {
      if (imageUrl.startsWith("http")) return imageUrl;
      return `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${imageUrl}`;
    }
    return "/placeholder-product.png";
  };

  if (loading) {
    return (
      <section className="py-10 bg-amber-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                <div className="h-36 sm:h-40 bg-gradient-to-r from-orange-100 to-orange-200 animate-pulse" />
                <div className="p-3 bg-[#F79E0E] space-y-2">
                  <div className="h-4 w-3/4 bg-white/30 rounded animate-pulse" />
                  <div className="h-5 w-1/2 bg-white/30 rounded animate-pulse" />
                  <div className="h-8 w-full bg-white/30 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className=" bg-amber-50">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-3xl font-bold text-amber-400 text-center py-6 mb-2"
        >
          Kamu Mungkin Juga Suka
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {products.slice(0, 12).map((product) => (
            <motion.div
              key={product.id_barang}
              whileHover={{ y: -4 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer flex flex-col"
              onClick={() => router.push(`/detail/${product.slug}`)}
            >
              <div className="relative group">
                <div className="h-36 sm:h-40 overflow-hidden">
                  <img
                    src={getProductImage(product)}
                    alt={product.nama_barang}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/placeholder-product.png";
                    }}
                  />
                </div>
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="flex flex-col gap-1 p-3 bg-[#F79E0E] flex-grow">
                <h3 className="text-sm text-white font-medium line-clamp-1">
                  {product.nama_barang}
                </h3>
                <p className="text-white font-semibold text-sm">
                  Rp {product.harga.toLocaleString("id-ID")}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/detail/${product.slug}`);
                  }}
                  className="mt-2 w-full bg-white text-[#F79E0E] py-1.5 px-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
                >
                  Lihat Detail
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
