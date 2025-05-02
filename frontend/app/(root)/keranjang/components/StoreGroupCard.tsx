import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Store } from "lucide-react";
import { StoreGroup } from "../types";
import { CartItemCard } from "./CartItem";
import { motion } from "framer-motion";

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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-amber-100/50"
    >
      <div className="p-6">
        {/* Store Header */}
        <div className="flex items-center gap-4 pb-4 border-b border-amber-100/30">
          <Checkbox
            id={`store-${store.id_toko}`}
            checked={store.allSelected}
            onCheckedChange={(checked) =>
              onSelectStore(store.id_toko, !!checked)
            }
            className="text-amber-400 border-amber-200 data-[state=checked]:bg-amber-400 data-[state=checked]:border-amber-400"
          />
          <div className="flex items-center gap-2 flex-1">
            <div className="p-2 bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-lg">
              <Store className="h-4 w-4 text-amber-400" />
            </div>
            <label
              htmlFor={`store-${store.id_toko}`}
              className="text-amber-500 font-medium cursor-pointer"
            >
              {store.nama_toko}
            </label>
          </div>
        </div>

        {/* Cart Items */}
        <div className="divide-y divide-amber-100/30">
          {store.items.map((item) => (
            <CartItemCard
              key={item.id_keranjang}
              item={item}
              isAvailable={isProductAvailable(item.barang)}
              onSelect={onSelectItem}
              onQuantityChange={onQuantityChange}
              onRemove={onRemoveItem}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
