import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
      <div className="py-8 text-center">
        <p className="text-gray-500">Detail pesanan tidak tersedia</p>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={onRetry}
          >
            Coba Muat Ulang
          </Button>
        )}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Produk dalam Pesanan</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id_detail_pembelian}
            className="flex gap-4 pb-4 last:pb-0 last:border-0 border-b"
          >
            <div className="w-16 h-16 bg-gray-100 relative overflow-hidden rounded-md">
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
              <Link
                href={`/katalog/detail/${item.barang?.slug || "#"}`}
                className="hover:underline"
              >
                <h3 className="font-medium text-gray-900">
                  {item.barang?.nama_barang || "Produk tidak tersedia"}
                </h3>
              </Link>
              <div className="flex justify-between mt-1">
                <div className="text-sm text-gray-500">
                  {item.jumlah} × {formatRupiah(item.harga_satuan)}
                </div>
                <div className="font-medium text-[#F79E0E]">
                  {formatRupiah(item.subtotal)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
