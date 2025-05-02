import type { CartItem as CartItemType } from "../types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { AlertTriangle, MinusCircle, PlusCircle, Trash2 } from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import { motion } from "framer-motion";

interface CartItemProps {
  item: CartItemType;
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
}: CartItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-4 py-4 group"
    >
      <motion.div whileTap={{ scale: 0.95 }}>
        <Checkbox
          checked={item.is_selected}
          disabled={!isAvailable}
          onCheckedChange={(checked) => onSelect(item.id_keranjang, !!checked)}
          className="text-amber-400 border-amber-200 data-[state=checked]:bg-amber-400 transition-colors"
        />
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="relative h-24 w-24 rounded-lg overflow-hidden bg-amber-50"
      >
        <img
          src={
            item.barang.gambarBarang?.[0]?.url_gambar ||
            item.barang.gambar_barang?.[0]?.url_gambar ||
            "/placeholder-product.png"
          }
          alt={item.barang.nama_barang}
          className={`w-full h-full object-cover transition-opacity ${
            !isAvailable ? "opacity-50" : ""
          }`}
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder-product.png";
          }}
        />
        {!isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <Badge variant="destructive" className="text-xs">
              {item.barang.stok === 0 ? "Stok Habis" : "Tidak Tersedia"}
            </Badge>
          </div>
        )}
      </motion.div>

      <div className="flex-1 min-w-0 space-y-2">
        <motion.div layout>
          <Link
            href={`/user/katalog/detail/${item.barang.slug}`}
            className="hover:text-amber-400 transition-colors inline-block"
          >
            <h3 className="font-medium text-gray-800 line-clamp-2 hover:text-amber-500 transition-colors">
              {item.barang.nama_barang}
            </h3>
          </Link>
          <p className="text-sm text-gray-500">{item.barang.toko.nama_toko}</p>
          <p className="font-bold text-amber-400">
            {formatRupiah(item.barang.harga)}
          </p>
        </motion.div>

        <div className="flex items-center justify-between mt-2">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-1 bg-amber-50/80 backdrop-blur-sm rounded-lg p-1 shadow-sm"
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-amber-400 hover:text-amber-500 hover:bg-amber-100"
              onClick={() =>
                onQuantityChange(item.id_keranjang, item.jumlah - 1)
              }
              disabled={item.jumlah <= 1 || !isAvailable}
            >
              <MinusCircle className="h-4 w-4" />
            </Button>
            <span className="w-10 text-center font-medium text-gray-700">
              {item.jumlah}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-amber-400 hover:text-amber-500 hover:bg-amber-100"
              onClick={() =>
                onQuantityChange(item.id_keranjang, item.jumlah + 1)
              }
              disabled={item.jumlah >= item.barang.stok || !isAvailable}
            >
              <PlusCircle className="h-4 w-4" />
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
              onClick={() => onRemove(item.id_keranjang)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-amber-500"
        >
          {isAvailable
            ? `Stok: ${item.barang.stok}`
            : item.barang.stok === 0
            ? "Stok Habis"
            : "Tidak Tersedia"}
        </motion.p>
      </div>
    </motion.div>
  );
}
