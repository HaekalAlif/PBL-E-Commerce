import { Store, Star, Package, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { StoreProfile } from '../types';

interface StoreHeaderProps {
  profile: StoreProfile;
}

export const StoreHeader = ({ profile }: StoreHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-[#F79E0E] to-[#FFB648] rounded-xl p-6 text-white shadow-lg"
    >
      <div className="flex items-start gap-4">
        <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
          <Store className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{profile.nama_toko}</h1>
          <p className="text-white/90 mt-1">{profile.deskripsi}</p>
        </div>
      </div>
      <div className="flex items-center gap-4 mt-4">
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4" />
          <span>{profile.rating?.toFixed(1) || '0.0'}</span>
        </div>
        <div className="flex items-center gap-1">
          <Package className="w-4 h-4" />
          <span>{profile.products_count || 0} Produk</span>
        </div>
        <div className="flex items-center gap-1">
          <ShoppingBag className="w-4 h-4" />
          <span>{profile.sales_count || 0} Terjual</span>
        </div>
      </div>
    </motion.div>
  );
};
