import { Card, CardContent } from "@/components/ui/card";
import { formatRupiah } from "@/lib/utils";
import { StoreCheckout } from "../types";
import { Receipt } from "lucide-react";

interface StoreTotalCardProps {
  store: StoreCheckout;
}

export const StoreTotalCard = ({ store }: StoreTotalCardProps) => {
  return (
    <Card className="bg-white/95 backdrop-blur-sm border-none shadow-lg overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-800">
            <Receipt className="h-5 w-5 text-[#F79E0E]" />
            <span className="font-medium">Store Subtotal</span>
          </div>
          <div className="text-lg font-bold text-[#F79E0E]">
            {formatRupiah(store.subtotal + store.shippingCost)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
