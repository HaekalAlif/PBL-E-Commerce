import { Store } from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StoreCheckout } from "../types";

interface StoreCheckoutCardProps {
  store: StoreCheckout;
}

export const StoreCheckoutCard = ({ store }: StoreCheckoutCardProps) => {
  return (
    <Card className="bg-white/95 backdrop-blur-sm border-none shadow-lg overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-white">
          <div className="p-2.5 bg-gradient-to-br from-[#F79E0E] to-[#FFB648] rounded-full">
            <Store className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-lg text-amber-500 tracking-wide">
              {store.nama_toko}
            </span>
            <span className="text-xs font-normal text-gray-500">
              {store.products.length}{" "}
              {store.products.length > 1 ? "items" : "item"}
            </span>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="divide-y divide-amber-100/30">
        {store.products.map((product, idx) => (
          <div key={idx} className="group py-4 first:pt-2 last:pb-2">
            <div className="flex gap-4 items-center">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-amber-50/50 border border-amber-100">
                {product.gambar_barang && product.gambar_barang.length > 0 ? (
                  <img
                    src={product.gambar_barang[0]?.url_gambar}
                    alt={product.nama_barang}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/placeholder-product.png";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400 text-xs">
                    No image
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-800 truncate">
                  {product.nama_barang}
                </h3>
                <div className="mt-1.5 flex items-end justify-between">
                  <div className="text-sm text-gray-500">
                    {formatRupiah(product.harga)} × {product.jumlah}
                  </div>
                  <div className="text-[#F79E0E] font-semibold">
                    {formatRupiah(product.subtotal)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
