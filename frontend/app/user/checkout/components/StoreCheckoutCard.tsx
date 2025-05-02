import { Store } from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StoreCheckout } from "../types";

interface StoreCheckoutCardProps {
  store: StoreCheckout;
}

export const StoreCheckoutCard = ({ store }: StoreCheckoutCardProps) => {
  return (
    <Card>
      <CardHeader className="bg-gray-50">
        <CardTitle className="flex items-center">
          <Store className="h-5 w-5 mr-2" />
          {store.nama_toko}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {store.products.map((product, productIndex) => (
          <div key={productIndex} className="flex gap-4 py-2">
            <div className="w-16 h-16 bg-gray-100 relative overflow-hidden rounded-md">
              {product.gambar_barang && product.gambar_barang.length > 0 ? (
                <img
                  src={product.gambar_barang[0]?.url_gambar}
                  alt={product.nama_barang}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/placeholder-product.png";
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                  No image
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-medium">{product.nama_barang}</h3>
              <div className="flex justify-between mt-1">
                <span className="text-sm">
                  {formatRupiah(product.harga)} x {product.jumlah}
                </span>
                <span className="font-medium">
                  {formatRupiah(product.subtotal)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
