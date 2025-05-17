"use client";

import { motion } from "framer-motion";
import { Store, BarChart2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useStoreProfile } from "@/app/(root)/toko/profile/hooks/useStoreProfile";

const ProfileCardStore = () => {
  const { profile, loading, error } = useStoreProfile();

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
        className="bg-white rounded-xl shadow-sm border border-amber-100 p-4"
      >
        <div className="flex items-center gap-3 animate-pulse">
          <div className="w-12 h-12 rounded-full bg-amber-100" />
          <div className="space-y-2">
            <div className="h-4 w-24 bg-amber-100 rounded" />
            <div className="h-3 w-32 bg-amber-50 rounded" />
          </div>
        </div>
      </motion.div>
    );
  }

  if (error || !profile) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-amber-100 p-4 mb-4"
    >
      <div className="flex items-center gap-3 mb-3">
        <Avatar className="w-12 h-12 border-2 border-amber-100">
          <AvatarFallback className="bg-gradient-to-r from-[#F79E0E] to-[#FFB648] text-white font-semibold text-xl">
            {getInitials(profile.nama_toko)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold text-gray-900">{profile.nama_toko}</h3>
          <p className="text-sm text-gray-500 pt-1">
            {profile.is_active ? (
              <span className="text-amber-500 flex items-center gap-2">
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
            <Store className="w-4 h-4 text-amber-500" />
            <span>0 Produk</span>
          </div>
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-amber-500" />
            <span>0 Penjualan</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileCardStore;
