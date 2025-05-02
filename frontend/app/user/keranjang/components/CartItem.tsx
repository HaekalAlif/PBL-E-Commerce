import type { CartItem as CartItemType } from "../types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { AlertTriangle, MinusCircle, PlusCircle, Trash2 } from "lucide-react";
import { formatRupiah } from "@/lib/utils";

interface CartItemProps {
  item: CartItemType;
  isAvailable: boolean;
  onSelect: (id: number, selected: boolean) => void;
  onQuantityChange: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
}

export function CartItemCard({
  // Renamed from CartItem to CartItemCard
  item,
  isAvailable,
  onSelect,
  onQuantityChange,
  onRemove,
}: CartItemProps) {
  return (
    <div className="flex gap-4 pt-4 first:pt-2">
      <div className="pt-1">
        <Checkbox
          checked={item.is_selected}
          disabled={!isAvailable}
          onCheckedChange={(checked) => onSelect(item.id_keranjang, !!checked)}
        />
      </div>

      <div className="w-20 h-20 bg-gray-100 relative overflow-hidden rounded-md">
        {(item.barang.gambarBarang && item.barang.gambarBarang.length > 0) ||
        (item.barang.gambar_barang && item.barang.gambar_barang.length > 0) ? (
          <img
            src={
              item.barang.gambarBarang?.[0]?.url_gambar ||
              item.barang.gambar_barang?.[0]?.url_gambar
            }
            alt={item.barang.nama_barang}
            className={`object-cover w-full h-full ${
              !isAvailable ? "opacity-50" : ""
            }`}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder-product.png";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
            No image
          </div>
        )}

        {!isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
            <Badge variant="destructive" className="pointer-events-none">
              {item.barang.stok === 0 ? "Out of Stock" : "Unavailable"}
            </Badge>
          </div>
        )}
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <Link
            href={`/user/katalog/detail/${item.barang.slug}`}
            className="hover:underline"
          >
            <h3 className="font-medium">{item.barang.nama_barang}</h3>
          </Link>

          {!isAvailable && <AlertTriangle className="h-4 w-4 text-red-500" />}
        </div>

        <p className="text-sm text-gray-500">{item.barang.toko.nama_toko}</p>
        <p className="font-medium mt-1">{formatRupiah(item.barang.harga)}</p>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() =>
                onQuantityChange(item.id_keranjang, item.jumlah - 1)
              }
              disabled={item.jumlah <= 1 || !isAvailable}
            >
              <MinusCircle className="h-4 w-4" />
            </Button>
            <span className="w-10 text-center">{item.jumlah}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() =>
                onQuantityChange(item.id_keranjang, item.jumlah + 1)
              }
              disabled={item.jumlah >= item.barang.stok || !isAvailable}
            >
              <PlusCircle className="h-4 w-4" />
            </Button>
            <span
              className={`text-sm ${
                !isAvailable ? "text-red-500 font-medium" : "text-gray-500"
              } ml-2`}
            >
              {isAvailable
                ? `Stock: ${item.barang.stok}`
                : item.barang.stok === 0
                ? "Out of Stock"
                : "Unavailable"}
            </span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(item.id_keranjang)}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </div>
    </div>
  );
}
