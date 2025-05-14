"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Store, BarChart2, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";

interface StoreInfo {
  id_toko?: number;
  nama_toko: string;
  deskripsi?: string;
  logo_toko?: string;
  status?: "active" | "inactive";
  total_produk?: number;
  total_penjualan?: number;
}

const ProfileCardStore = () => {
  const [storeInfo, setStoreInfo] = useState<StoreInfo>({
    nama_toko: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        setLoading(true);
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

        const response = await axios.get(`${apiUrl}/seller/store`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: true,
        });

        if (response.data.status === "success") {
          const storeData = response.data.data;
          setStoreInfo({
            id_toko: storeData.id_toko,
            nama_toko: storeData.nama_toko || "",
            deskripsi: storeData.deskripsi || "",
            logo_toko: storeData.logo_toko,
            status: storeData.status || "active",
            total_produk: storeData.total_produk || 0,
            total_penjualan: storeData.total_penjualan || 0,
          });
        } else {
          throw new Error(
            response.data.message || "Failed to fetch store data"
          );
        }
      } catch (err) {
        console.error("Error fetching store data:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStoreData();
  }, []);

  const getInitials = (name: string) => {
    if (!name) return "S";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
      >
        <div className="flex items-center gap-3 animate-pulse">
          <div className="w-12 h-12 rounded-full bg-orange-100" />
          <div className="space-y-2">
            <div className="h-4 w-24 bg-orange-100 rounded" />
            <div className="h-3 w-32 bg-orange-50 rounded" />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4"
    >
      <div className="flex items-center gap-3 mb-3">
        <Avatar className="w-12 h-12 border-2 border-orange-100">
          {storeInfo.logo_toko ? (
            <AvatarImage
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${storeInfo.logo_toko}`}
              alt={storeInfo.nama_toko}
            />
          ) : (
            <AvatarFallback className="bg-gradient-to-r from-[#F79E0E] to-[#FFB648] text-white font-semibold text-xl">
              {getInitials(storeInfo.nama_toko)}
            </AvatarFallback>
          )}
        </Avatar>
        <div>
          <h3 className="font-semibold text-gray-900">{storeInfo.nama_toko}</h3>
          <p className="text-sm text-gray-500">
            {storeInfo.status === "active" ? (
              <span className="text-green-600 flex items-center gap-1">
                <Store className="w-3 h-3" />
                Toko Aktif
              </span>
            ) : (
              <span className="text-gray-500 flex items-center gap-1">
                <Store className="w-3 h-3" />
                Toko Tidak Aktif
              </span>
            )}
          </p>
        </div>
      </div>
      <div className="border-t border-gray-100 pt-3">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Store className="w-4 h-4 text-orange-500" />
            <span>{storeInfo.total_produk || 0} Produk</span>
          </div>
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-orange-500" />
            <span>{storeInfo.total_penjualan || 0} Penjualan</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileCardStore;