import { CartItem } from "../types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { AlertTriangle, MinusCircle, PlusCircle, Trash2 } from "lucide-react";
import { formatRupiah } from "@/lib/utils";

interface CartItemCardProps {
  item: CartItem;
  isAvailable: boolean;
  onSelect: (id: number, selected: boolean) => void;
  onQuantityChange: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
}

export function CartItemCard({
  item,
  isAvailable,
  onSelect,
  onQuantityChange,
  onRemove,
}: CartItemCardProps) {
  return (
    <div className="flex gap-4 pt-4 first:pt-2">
      {/* ...existing CartItem UI code... */}
    </div>
  );
}
