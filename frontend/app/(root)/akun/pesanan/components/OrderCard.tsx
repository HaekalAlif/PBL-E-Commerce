import { motion } from "framer-motion";
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  CircleCheck,
  Ban,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatRupiah } from "@/lib/utils";
import { OrderCardProps, OrderItem } from "../types";

export const OrderCard = ({ order, onOrderClick }: OrderCardProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Draft":
        return <Package className="h-5 w-5 text-gray-500" />;
      case "Menunggu Pembayaran":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case "Dibayar":
        return <CheckCircle className="h-5 w-5 text-blue-600" />;
      case "Diproses":
        return <Package className="h-5 w-5 text-[#F79E0E]" />;
      case "Dikirim":
        return <Truck className="h-5 w-5 text-[#F79E0E]" />;
      case "Selesai":
        return <CircleCheck className="h-5 w-5 text-green-600" />;
      case "Dibatalkan":
        return <Ban className="h-5 w-5 text-red-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Menunggu Pembayaran":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            Belum Dibayar
          </Badge>
        );
      case "Dibayar":
        return (
          <Badge className="bg-blue-50 text-blue-700 border-blue-200">
            Sudah Dibayar
          </Badge>
        );
      case "Diproses":
        return (
          <Badge className="bg-orange-50 text-[#F79E0E] border-orange-200">
            Diproses
          </Badge>
        );
      case "Dikirim":
        return (
          <Badge className="bg-orange-50 text-[#F79E0E] border-orange-200">
            Dikirim
          </Badge>
        );
      case "Selesai":
        return (
          <Badge className="bg-green-50 text-green-700 border-green-200">
            Selesai
          </Badge>
        );
      case "Dibatalkan":
        return (
          <Badge
            variant="secondary"
            className="bg-red-50 text-red-700 border-red-200"
          >
            Dibatalkan
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const calculateOrderTotal = (order: OrderItem) => {
    if (order.tagihan?.total_tagihan) {
      return order.tagihan.total_tagihan;
    }
    return (
      order.detail_pembelian?.reduce((sum, item) => sum + item.subtotal, 0) || 0
    );
  };

  const renderOrderItems = () => {
    const items = order.detail_pembelian;
    if (!items || items.length === 0) return null;

    if (items.length === 1) {
      // Single item layout
      const item = items[0];
      return (
        <div className="flex gap-4 items-center">
          <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
            {item.barang.gambar_barang &&
            item.barang.gambar_barang.length > 0 ? (
              <img
                src={item.barang.gambar_barang[0].url_gambar}
                alt={item.barang.nama_barang}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "/placeholder-product.png";
                }}
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-gray-400 text-xs">
                No image
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 truncate">
              {item.barang.nama_barang}
            </h4>
            <div className="mt-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm">
              <span className="text-[#F79E0E] font-medium">
                {formatRupiah(item.harga_satuan)}
              </span>
              <span className="text-gray-500">
                {item.jumlah} {item.jumlah > 1 ? "items" : "item"}
              </span>
            </div>
          </div>
        </div>
      );
    }

    // Multiple items layout
    return (
      <div className="space-y-4">
        {/* First item with larger display */}
        <div className="flex gap-4 items-center">
          <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
            {items[0].barang.gambar_barang &&
            items[0].barang.gambar_barang.length > 0 ? (
              <img
                src={items[0].barang.gambar_barang[0].url_gambar}
                alt={items[0].barang.nama_barang}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "/placeholder-product.png";
                }}
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-gray-400 text-xs">
                No image
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 truncate">
              {items[0].barang.nama_barang}
            </h4>
            <div className="mt-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm">
              <span className="text-[#F79E0E] font-medium">
                {formatRupiah(items[0].harga_satuan)}
              </span>
              <span className="text-gray-500">
                {items[0].jumlah} {items[0].jumlah > 1 ? "items" : "item"}
              </span>
            </div>
          </div>
        </div>

        {/* Additional items in compact view */}
        <div className="flex gap-2 items-center border-t pt-3">
          {items.slice(1, 3).map((item) => (
            <div
              key={item.id_detail_pembelian}
              className="flex gap-2 items-center"
            >
              <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                {item.barang.gambar_barang &&
                item.barang.gambar_barang.length > 0 ? (
                  <img
                    src={item.barang.gambar_barang[0].url_gambar}
                    alt={item.barang.nama_barang}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-gray-400 text-xs">
                    No image
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {item.barang.nama_barang}
                </p>
                <p className="text-xs text-gray-500">
                  {item.jumlah}x {formatRupiah(item.harga_satuan)}
                </p>
              </div>
            </div>
          ))}

          {items.length > 3 && (
            <div className="flex items-center justify-center w-12 h-12 bg-gray-50 rounded-lg border border-gray-200">
              <span className="text-sm font-medium text-gray-500">
                +{items.length - 3}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className="overflow-hidden hover:shadow-md cursor-pointer transition-all duration-200"
        onClick={() => onOrderClick(order.kode_pembelian)}
      >
        <CardHeader className="pb-2 flex flex-row justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              {getStatusIcon(order.status_pembelian)}
              <span className="text-gray-900">
                Order #{order.kode_pembelian}
              </span>
            </CardTitle>
            <p className="text-sm text-gray-500">
              {formatDate(order.created_at)}
            </p>
          </div>
          <div>{getStatusBadge(order.status_pembelian)}</div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {renderOrderItems()}
            <Separator />

            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Dikirim ke:</p>
                <p className="font-medium text-gray-900">
                  {order.alamat?.nama_penerima}
                </p>
                <p className="text-sm text-gray-600 truncate max-w-[400px]">
                  {order.alamat?.alamat_lengkap}, {order.alamat?.regency?.name}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Pesanan:</p>
                <p className="text-xl font-semibold text-[#F79E0E]">
                  {formatRupiah(calculateOrderTotal(order))}
                </p>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="bg-gray-50/50 border-t px-6 py-3">
          <Button
            variant="outline"
            className="ml-auto hover:bg-orange-50 hover:text-[#F79E0E]"
            onClick={() => onOrderClick(order.kode_pembelian)}
          >
            Lihat Detail
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
