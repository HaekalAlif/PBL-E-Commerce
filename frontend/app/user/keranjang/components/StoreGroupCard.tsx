import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Store } from "lucide-react";
import { StoreGroup } from "../types";
import { CartItemCard } from "./CartItem"; // Updated import

interface StoreGroupCardProps {
  store: StoreGroup;
  onSelectStore: (storeId: number, selected: boolean) => void;
  onSelectItem: (itemId: number, selected: boolean) => void;
  onQuantityChange: (itemId: number, quantity: number) => void;
  onRemoveItem: (itemId: number) => void;
  isProductAvailable: (product: any) => boolean;
}

export function StoreGroupCard({
  store,
  onSelectStore,
  onSelectItem,
  onQuantityChange,
  onRemoveItem,
  isProductAvailable,
}: StoreGroupCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2 bg-gray-50">
        <div className="flex items-center">
          <Checkbox
            id={`store-${store.id_toko}`}
            checked={store.allSelected}
            onCheckedChange={(checked) =>
              onSelectStore(store.id_toko, !!checked)
            }
            className="mr-3"
          />
          <label
            htmlFor={`store-${store.id_toko}`}
            className="text-sm font-medium cursor-pointer flex-1 flex items-center"
          >
            <Store className="h-4 w-4 mr-2" />
            {store.nama_toko}
          </label>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 divide-y">
        {store.items.map((item) => (
          <CartItemCard // Updated component name
            key={item.id_keranjang}
            item={item}
            isAvailable={isProductAvailable(item.barang)}
            onSelect={onSelectItem}
            onQuantityChange={onQuantityChange}
            onRemove={onRemoveItem}
          />
        ))}
      </CardContent>
    </Card>
  );
}
