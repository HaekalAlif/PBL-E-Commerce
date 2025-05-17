import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle,
  Package,
  Truck,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { OrderDetail } from "../types";

interface OrderActionsProps {
  order: OrderDetail;
  onConfirm: () => void;
  onShip: () => void;
}

export function OrderActions({ order, onConfirm, onShip }: OrderActionsProps) {
  return (
    <Card className="border-orange-100 bg-white">
      <CardHeader>
        <CardTitle className="flex items-center text-gray-800 gap-2 text-base font-medium">
          <div className=" rounded-lg bg-orange-50">
            <Package className="h-4 w-4 text-[#F79E0E]" />
          </div>
          Status Pemrosesan
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-2">
          {order.status_pembelian === "Dibayar" && (
            <Button
              onClick={onConfirm}
              className="flex-1 bg-[#F79E0E] hover:bg-[#F79E0E]/90 h-9"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Proses Pesanan
            </Button>
          )}

          {order.status_pembelian === "Diproses" && (
            <Button
              onClick={onShip}
              className="flex-1 bg-[#F79E0E] hover:bg-[#F79E0E]/90 h-9"
            >
              <Truck className="h-4 w-4 mr-2" />
              Kirim Pesanan
            </Button>
          )}

          {order.status_pembelian === "Dikirim" && (
            <div className="flex items-start gap-2 bg-orange-50 p-3 rounded-lg border border-orange-100">
              <Clock className="h-4 w-4 text-[#F79E0E] mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">
                  Dalam Pengiriman
                </p>
                <p className="text-xs text-gray-600 mt-0.5">
                  Menunggu konfirmasi penerimaan dari pembeli
                </p>
              </div>
            </div>
          )}

          {order.status_pembelian === "Diterima" && (
            <div className="flex items-start gap-3 bg-green-50 p-3 rounded-lg border border-green-100">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800">
                  Pesanan Diterima
                </p>
                <p className="text-xs text-green-700 mt-0.5">
                  Pembeli telah mengkonfirmasi penerimaan pesanan
                </p>
              </div>
            </div>
          )}

          {order.status_pembelian === "Selesai" && (
            <div className="flex items-start gap-3 bg-green-50 p-3 rounded-lg border border-green-100">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800">
                  Pesanan Selesai
                </p>
                <p className="text-xs text-green-700 mt-0.5">
                  Transaksi telah selesai
                </p>
              </div>
            </div>
          )}

          {order.status_pembelian === "Dibatalkan" && (
            <div className="flex items-start gap-3 bg-red-50 p-3 rounded-lg border border-red-100">
              <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">
                  Pesanan Dibatalkan
                </p>
                <p className="text-xs text-red-700 mt-0.5">
                  Pesanan ini telah dibatalkan
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
