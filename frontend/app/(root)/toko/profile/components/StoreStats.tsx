import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Package, ShoppingBag, Star, MessageSquare } from "lucide-react";
import { StoreProfile } from "../types";

interface StoreStatsProps {
  profile: StoreProfile;
}

const StatCard = ({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: number;
}) => (
  <div className="flex items-center gap-3 p-4 rounded-xl bg-orange-50/50">
    <div className="p-2 rounded-lg bg-[#F79E0E] text-white">
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-lg font-semibold text-gray-900">{value}</p>
    </div>
  </div>
);

export const StoreStats = ({ profile }: StoreStatsProps) => {
  return (
    <Card className="border-orange-100">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Package}
            label="Total Produk"
            value={profile.products_count || 0}
          />
          <StatCard
            icon={ShoppingBag}
            label="Total Penjualan"
            value={profile.sales_count || 0}
          />
          <StatCard
            icon={Star}
            label="Rating Toko"
            value={profile.rating || 0}
          />
          <StatCard
            icon={MessageSquare}
            label="Total Review"
            value={profile.jumlah_ulasan || 0}
          />
        </div>
      </CardContent>
    </Card>
  );
};
