import { OrderStats } from "../types";
import { Clock, Package, TruckIcon, CheckCircle2 } from "lucide-react";
import { OrderStatsSkeleton } from "./OrderStatsSkeleton";

interface OrderStatsProps {
  stats: OrderStats;
  loading?: boolean;
}

export function OrderStatsCards({ stats, loading }: OrderStatsProps) {
  if (loading) {
    return <OrderStatsSkeleton />;
  }

  const statItems = [
    {
      label: "Pesanan Baru",
      value: stats.new_orders,
      icon: Clock,
    },
    {
      label: "Diproses",
      value: stats.processing_orders,
      icon: Package,
    },
    {
      label: "Dikirim",
      value: stats.shipped_orders,
      icon: TruckIcon,
    },
    {
      label: "Selesai",
      value: stats.completed_orders,
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-xl p-4 border border-amber-500 
                       hover:border-[#F79E0E]/20 hover:bg-orange-200/30 
                       transition-all duration-200 group"
          >
            <div className="flex items-center gap-3">
              <div
                className="p-2 rounded-lg bg-orange-50 text-[#F79E0E] 
                            group-hover:bg-[#F79E0E]/10"
              >
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{item.label}</p>
                <p className="text-lg font-semibold text-gray-900">
                  {item.value}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
