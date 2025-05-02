import { Card, CardContent } from "@/components/ui/card";
import { formatRupiah } from "@/lib/utils";
import { StoreCheckout } from "../types";

interface StoreTotalCardProps {
  store: StoreCheckout;
}

export const StoreTotalCard = ({ store }: StoreTotalCardProps) => {
  return (
    <Card>
      <CardContent className="py-4">
        <div className="flex justify-between items-center">
          <span className="font-medium">Store Subtotal:</span>
          <span className="font-bold">
            {formatRupiah(store.subtotal + store.shippingCost)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
