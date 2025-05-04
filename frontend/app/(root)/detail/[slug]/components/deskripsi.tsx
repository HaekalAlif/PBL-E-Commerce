"use client";

import { ProductDetail } from "../hooks/useProductDetail";
import { motion } from "framer-motion";
import {
  MapPin,
  Package,
  Shield,
  Building2,
  Star,
  Award,
  CheckCircle,
  Box,
  Truck,
  FileText,
  Store,
  Phone,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface DeskripsiProps {
  product: ProductDetail | null;
  loading: boolean;
}

export default function Deskripsi({ product, loading }: DeskripsiProps) {
  const getStoreLocation = () => {
    const primaryAddress = product?.toko?.alamat_toko?.find(
      (addr) => addr.is_primary
    );

    if (!primaryAddress) return "Lokasi tidak tersedia";

    const parts = [
      primaryAddress.alamat_lengkap,
      primaryAddress.regency?.name,
      primaryAddress.province?.name,
    ].filter(Boolean);

    return parts.join(", ");
  };

  if (loading) {
    return (
      <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-orange-100">
        {/* Tab Headers Skeleton */}
        <div className="w-full border-b bg-gradient-to-r from-orange-50 to-orange-100">
          <div className="flex">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex-1 p-4 flex items-center justify-center gap-2"
              >
                <div className="w-4 h-4 rounded-full bg-orange-200/60 animate-pulse" />
                <div className="h-4 w-20 bg-orange-100/80 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Description Section Skeleton */}
          <div className="flex flex-col space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 animate-pulse">
                <div className="w-6 h-6" />
              </div>
              <div className="flex-1 space-y-4">
                <div className="h-6 w-48 bg-gradient-to-r from-orange-100 to-orange-200 rounded-lg animate-pulse" />
                <div className="p-4 rounded-xl border border-orange-100 bg-orange-50/50">
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-orange-100/80 rounded animate-pulse" />
                    <div className="h-4 w-5/6 bg-orange-100/60 rounded animate-pulse" />
                    <div className="h-4 w-4/6 bg-orange-100/40 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-orange-100">
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="w-full border-b bg-gradient-to-r from-orange-50 to-orange-100">
          <TabsTrigger
            value="description"
            className="flex-1 py-4 gap-2 text-orange-400 data-[state=active]:text-orange-600 data-[state=active]:bg-white/50"
          >
            <FileText className="w-4 h-4" />
            Deskripsi
          </TabsTrigger>
          <TabsTrigger
            value="details"
            className="flex-1 py-4 gap-2 text-orange-400 data-[state=active]:text-orange-600 data-[state=active]:bg-white/50"
          >
            <Box className="w-4 h-4" />
            Spesifikasi
          </TabsTrigger>
          <TabsTrigger
            value="quality"
            className="flex-1 py-4 gap-2 text-orange-400 data-[state=active]:text-orange-600 data-[state=active]:bg-white/50"
          >
            <Shield className="w-4 h-4" />
            Jaminan
          </TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="prose prose-sm max-w-none">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
                  <FileText className="w-6 h-6 text-orange-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-orange-600 mb-4">
                    Deskripsi Produk
                  </h3>
                  <div className="text-gray-700 whitespace-pre-line leading-relaxed bg-orange-50/50 p-4 rounded-xl border border-orange-100">
                    {product?.deskripsi_barang}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="details" className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Store Info */}
            <div className="space-y-4">
              <h4 className="font-semibold flex items-center gap-2 text-orange-600">
                <MapPin className="w-4 h-4" />
                Info Toko
              </h4>
              <div className="bg-orange-50/50 p-4 rounded-lg border border-orange-100">
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-gray-700">
                    <Store className="w-4 h-4 text-orange-400 flex-shrink-0" />
                    <span>
                      {product?.toko?.nama_toko || "Nama toko tidak tersedia"}
                    </span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-700">
                    <MapPin className="w-4 h-4 text-orange-400 mt-1 flex-shrink-0" />
                    <span>{getStoreLocation()}</span>
                  </li>
                  {product?.toko?.alamat_toko?.[0]?.no_telepon && (
                    <li className="flex items-center gap-3 text-gray-700">
                      <Phone className="w-4 h-4 text-orange-400 flex-shrink-0" />
                      <span>{product.toko.alamat_toko[0].no_telepon}</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* Product Specifications */}
            <div className="space-y-4">
              <h4 className="font-semibold flex items-center gap-2 text-orange-600">
                <Box className="w-4 h-4" />
                Detail Produk
              </h4>
              <div className="bg-orange-50/50 p-4 rounded-lg border border-orange-100">
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-400" />
                    <div>
                      <span className="font-medium text-orange-700">
                        Kondisi:
                      </span>
                      <span className="ml-1 text-gray-700">
                        {product?.kondisi_detail}
                      </span>
                    </div>
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-orange-400" />
                    <div>
                      <span className="font-medium text-orange-700">
                        Grade:
                      </span>
                      <span className="ml-1 text-gray-700">
                        {product?.grade}
                      </span>
                    </div>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-400" />
                    <div>
                      <span className="font-medium text-orange-700">
                        Berat:
                      </span>
                      <span className="ml-1 text-gray-700">
                        {product?.berat_barang} gram
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="quality" className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-6"
          >
            <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 p-6 rounded-xl border border-orange-100">
              <h4 className="text-lg font-semibold text-orange-700 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Jaminan Kualitas Produk
              </h4>
              <ul className="space-y-4">
                <motion.li
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="p-2 bg-white rounded-lg">
                    <Shield className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Garansi Pengembalian
                    </p>
                    <p className="text-sm text-gray-600">
                      Jaminan 7 hari pengembalian jika tidak sesuai deskripsi
                    </p>
                  </div>
                </motion.li>
                <motion.li
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-start gap-3"
                >
                  <div className="p-2 bg-white rounded-lg">
                    <Award className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Produk Berkualitas
                    </p>
                    <p className="text-sm text-gray-600">
                      Telah melalui proses pengecekan dan verifikasi kualitas
                    </p>
                  </div>
                </motion.li>
              </ul>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
