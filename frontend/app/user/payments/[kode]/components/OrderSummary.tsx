import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock } from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import { OrderSummaryProps } from "../types";

export const OrderSummary = ({
  invoice,
  paymentStatus,
  timeLeft,
}: OrderSummaryProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Invoice Number</p>
            <p className="font-medium">{invoice.kode_tagihan}</p>
          </div>
          <Badge
            variant={
              paymentStatus === "Dibayar"
                ? "default"
                : paymentStatus === "Menunggu"
                ? "outline"
                : "secondary"
            }
          >
            {paymentStatus === "Dibayar"
              ? "Paid"
              : paymentStatus === "Menunggu"
              ? "Pending"
              : paymentStatus === "Expired"
              ? "Expired"
              : "Failed"}
          </Badge>
        </div>

        {paymentStatus === "Menunggu" && timeLeft && timeLeft !== "Expired" && (
          <div className="bg-gray-100 p-3 rounded-md">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-gray-500" />
              <p className="text-sm text-gray-500">Time Remaining</p>
            </div>
            <p className="font-mono text-lg font-bold">{timeLeft}</p>
          </div>
        )}

        <Separator />

        <div className="space-y-3">
          {invoice?.pembelian?.detail_pembelian &&
          Array.isArray(invoice.pembelian.detail_pembelian) &&
          invoice.pembelian.detail_pembelian.length > 0 ? (
            invoice.pembelian.detail_pembelian.map((item) => (
              <div
                key={item.id_detail || `item-${Math.random()}`}
                className="flex justify-between items-center"
              >
                <div className="flex-1">
                  <p className="font-medium">
                    {item.barang?.nama_barang || "Unknown Product"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {item.jumlah} x {formatRupiah(item.harga_satuan || 0)}
                  </p>
                </div>
                <p className="font-medium">
                  {formatRupiah(item.subtotal || 0)}
                </p>
              </div>
            ))
          ) : (
            <div className="py-3">
              <div className="flex justify-between items-center mb-2">
                <div className="flex-1">
                  <p className="font-medium">Order Items</p>
                  <p className="text-sm text-gray-500">Details not available</p>
                </div>
              </div>
              <p className="text-gray-500 text-sm">
                This transaction contains products with a total value of{" "}
                {formatRupiah(invoice?.total_harga || 0)}
              </p>
            </div>
          )}
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-500">Subtotal</span>
            <span>{formatRupiah(invoice?.total_harga || 0)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">
              Shipping ({invoice?.opsi_pengiriman || "Standard"})
            </span>
            <span>{formatRupiah(invoice?.biaya_kirim || 0)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Admin Fee</span>
            <span>{formatRupiah(invoice?.biaya_admin || 0)}</span>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>{formatRupiah(invoice?.total_tagihan || 0)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
