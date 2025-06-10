"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, MessageCircle, Store, Award, Info } from "lucide-react";
import { useStoreProfile } from "./hooks/useStoreProfile";
import { StoreHeader } from "./components/StoreHeader";
import { StoreProducts } from "./components/StoreProducts";
import { StoreReviews } from "./components/StoreReviews";
import Link from "next/link";
import { AlertCircle, ChevronRight, TimerIcon } from "lucide-react";

const PageSkeleton = () => (
  <div className="min-h-screen bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Skeleton */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 lg:p-12 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl animate-pulse" />
              <div className="flex-1 space-y-3">
                <div className="h-8 w-64 bg-gradient-to-r from-amber-100 to-orange-100 rounded animate-pulse" />
                <div className="h-6 w-48 bg-gradient-to-r from-amber-100 to-orange-100 rounded animate-pulse" />
              </div>
            </div>
            <div className="h-20 bg-gradient-to-r from-amber-100 to-orange-100 rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-24 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 mb-8">
        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-12 w-32 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="h-12 bg-gradient-to-r from-amber-100 to-orange-100 rounded animate-pulse mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-square bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl animate-pulse" />
                <div className="h-4 bg-gradient-to-r from-amber-100 to-orange-100 rounded animate-pulse" />
                <div className="h-6 w-1/2 bg-gradient-to-r from-amber-100 to-orange-100 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function StorePage() {
  const params = useParams();
  const storeSlug = Array.isArray(params?.slug)
    ? params.slug[0]
    : params?.slug ?? "";
  const [activeTab, setActiveTab] = useState("products");

  const { storeData, loading, error } = useStoreProfile(storeSlug);

  if (loading) {
    return <PageSkeleton />;
  }

  if (error || !storeData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto">
          <Card className="text-center p-8 shadow-sm border border-gray-100">
            <Store className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Toko Tidak Ditemukan
            </h2>
            <p className="text-gray-500">
              {error || "Toko yang Anda cari tidak ada atau sudah tidak aktif"}
            </p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-amber-50/30 to-orange-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6 lg:space-y-8"
        >
          {/* Breadcrumb */}
          <nav className="text-sm">
            <ol className="flex items-center space-x-2">
              <li>
                <Link href="/" className="text-gray-500 hover:text-[#F79E0E]">
                  Beranda
                </Link>
              </li>
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <li>
                <span className="text-gray-500">Toko</span>
              </li>
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <li className="text-[#F79E0E] font-medium">
                {storeData.store.nama_toko}
              </li>
            </ol>
          </nav>

          {/* Store Header */}
          <StoreHeader storeData={storeData} />

          {/* Navigation Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-6 lg:space-y-8"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100/80 p-2">
                <TabsList className="grid w-full grid-cols-3 bg-transparent gap-2 h-auto">
                  <TabsTrigger
                    value="products"
                    className="flex items-center gap-3 py-4 px-6 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300 font-medium hover:bg-amber-50"
                  >
                    <Package className="h-5 w-5" />
                    <span className="hidden sm:inline">Produk</span>
                    <Badge className="bg-gray-100 text-gray-600 data-[state=active]:bg-white/20 data-[state=active]:text-white">
                      {storeData.statistics.total_products}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger
                    value="reviews"
                    className="flex items-center gap-3 py-4 px-6 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300 font-medium hover:bg-amber-50"
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span className="hidden sm:inline">Ulasan</span>
                    <Badge className="bg-gray-100 text-gray-600 data-[state=active]:bg-white/20 data-[state=active]:text-white">
                      {storeData.rating.total_reviews}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger
                    value="about"
                    className="flex items-center gap-3 py-4 px-6 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300 font-medium hover:bg-amber-50"
                  >
                    <Info className="h-5 w-5" />
                    <span className="hidden sm:inline">Tentang</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Tab Contents */}
              <div className="relative">
                <TabsContent value="products" className="mt-0">
                  <StoreProducts storeSlug={storeSlug} />
                </TabsContent>

                <TabsContent value="reviews" className="mt-0">
                  <StoreReviews
                    storeSlug={storeSlug}
                    rating={storeData.rating}
                  />
                </TabsContent>

                <TabsContent value="about" className="mt-0">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                      <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl">
                          <Info className="h-6 w-6 text-amber-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800">
                          Tentang {storeData.store.nama_toko}
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-6">
                          <div className="p-6 bg-gray-50 rounded-xl">
                            <h4 className="font-semibold text-gray-800 mb-3">
                              Deskripsi Toko
                            </h4>
                            <p className="text-gray-600 leading-relaxed">
                              {storeData.store.deskripsi ||
                                "Deskripsi toko belum tersedia."}
                            </p>
                          </div>

                          <div className="p-6 bg-gray-50 rounded-xl">
                            <h4 className="font-semibold text-gray-800 mb-4">
                              Statistik Toko
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="text-center p-4 bg-white rounded-lg">
                                <div className="text-2xl font-bold text-amber-600">
                                  {storeData.statistics.total_products}
                                </div>
                                <div className="text-sm text-gray-600">
                                  Total Produk
                                </div>
                              </div>
                              <div className="text-center p-4 bg-white rounded-lg">
                                <div className="text-2xl font-bold text-green-600">
                                  {storeData.statistics.total_orders_completed}
                                </div>
                                <div className="text-sm text-gray-600">
                                  Pesanan Selesai
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-6">
                          <div className="p-6 bg-gray-50 rounded-xl">
                            <h4 className="font-semibold text-gray-800 mb-4">
                              Informasi Kontak
                            </h4>
                            <div className="space-y-3">
                              {storeData.store.kontak && (
                                <div className="flex items-center gap-3">
                                  <span className="font-medium text-gray-700">
                                    Kontak:
                                  </span>
                                  <span className="text-gray-600">
                                    {storeData.store.kontak}
                                  </span>
                                </div>
                              )}
                              {storeData.store.alamat_toko?.[0] && (
                                <div className="space-y-2">
                                  <span className="font-medium text-gray-700">
                                    Alamat:
                                  </span>
                                  <div className="text-gray-600">
                                    <div>
                                      {
                                        storeData.store.alamat_toko[0]
                                          .alamat_lengkap
                                      }
                                    </div>
                                    <div className="text-sm">
                                      {
                                        storeData.store.alamat_toko[0].district
                                          ?.name
                                      }
                                      ,{" "}
                                      {
                                        storeData.store.alamat_toko[0].regency
                                          ?.name
                                      }
                                      ,{" "}
                                      {
                                        storeData.store.alamat_toko[0].province
                                          ?.name
                                      }
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="p-6 bg-gray-50 rounded-xl">
                            <h4 className="font-semibold text-gray-800 mb-3">
                              Bergabung Sejak
                            </h4>
                            <p className="text-gray-600">
                              {new Date(
                                storeData.statistics.store_join_date
                              ).toLocaleDateString("id-ID", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </TabsContent>
              </div>
            </Tabs>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
