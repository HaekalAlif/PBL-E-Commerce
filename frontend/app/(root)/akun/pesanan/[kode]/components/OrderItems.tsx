import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { formatRupiah } from "@/lib/utils";

interface OrderItemsProps {
  items: Array<{
    id_detail_pembelian: number;
    jumlah: number;
    harga_satuan: number;
    subtotal: number;
    barang: {
      nama_barang: string;
      slug: string;
      gambar_barang?: Array<{ url_gambar: string }>;
    };
  }>;
  onRetry?: () => void;
}

export const OrderItems = ({ items, onRetry }: OrderItemsProps) => {
  if (!items || items.length === 0) {
    return (
      <Card className="border-orange-100">
        <CardContent className="py-8">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="p-3 rounded-full bg-orange-50 mb-3">
              <ShoppingCart className="h-6 w-6 text-[#F79E0E]" />
            </div>
            <p className="text-gray-500 mb-3">Detail pesanan tidak tersedia</p>
            {onRetry && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                className="border-[#F79E0E] text-[#F79E0E] hover:bg-orange-50"
              >
                Coba Muat Ulang
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-orange-100">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="rounded-lg bg-orange-50">
            <Package className="h-4 w-4 text-[#F79E0E]" />
          </div>
          <span className="font-medium">Produk dalam Pesanan</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id_detail_pembelian}
            className="flex gap-4 pb-4 last:pb-0 last:border-0 border-b border-orange-100"
          >
            <div className="w-20 h-20 bg-orange-50/50 relative overflow-hidden rounded-lg border border-orange-100">
              {item.barang?.gambar_barang &&
              item.barang.gambar_barang.length > 0 ? (
                <img
                  src={item.barang.gambar_barang[0].url_gambar}
                  alt={item.barang.nama_barang}
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
              <h3 className="font-medium text-gray-900 hover:text-[#F79E0E]">
                {item.barang?.nama_barang || "Produk tidak tersedia"}
              </h3>

              <div className="flex justify-between mt-2">
                <div className="space-y-1">
                  <div className="text-sm text-gray-500">
                    {formatRupiah(item.harga_satuan)} x {item.jumlah}
                  </div>
                  <div className="font-medium text-[#F79E0E] pt-2">
                    Total: {formatRupiah(item.subtotal)}
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
