import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, Receipt } from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import { OrderSummaryProps } from "../types";
import { motion } from "framer-motion";

export const OrderSummary = ({ invoice, paymentStatus, timeLeft }: OrderSummaryProps) => {
  const getBadgeStyles = (status: string | null) => {
    switch (status) {
      case "Dibayar":
        return "bg-green-50 text-green-600 border-green-200 hover:bg-green-100";
      case "Menunggu":
        return "bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100";
      case "Expired":
        return "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100";
      default:
        return "bg-red-50 text-red-600 border-red-200 hover:bg-red-100";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-amber-100/50 shadow-lg bg-white/60 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
        <CardHeader className="border-b border-amber-100/30">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-[#F79E0E] to-[#FFB648] rounded-full">
              <Receipt className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
              Order Summary
            </span>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Invoice Number</p>
              <p className="font-medium">{invoice.kode_tagihan}</p>
            </div>
            <Badge
              variant="outline"
              className={`${getBadgeStyles(paymentStatus)} transition-colors duration-200`}
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
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-amber-50 to-amber-100/50 p-4 rounded-lg border border-amber-200/50
                       hover:from-amber-100/50 hover:to-amber-200/50 transition-all duration-300"
            >
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-amber-500" />
                <p className="text-sm text-amber-600">Time Remaining</p>
              </div>
              <p className="font-mono text-lg font-bold text-amber-700">{timeLeft}</p>
            </motion.div>
          )}

          <Separator className="bg-amber-100/50" />

          <div className="space-y-3">
            {invoice?.pembelian?.detail_pembelian &&
            Array.isArray(invoice.pembelian.detail_pembelian) &&
            invoice.pembelian.detail_pembelian.length > 0 ? (
              invoice.pembelian.detail_pembelian.map((item) => (
                <motion.div
                  key={item.id_detail || `item-${Math.random()}`}
                  whileHover={{ x: 4 }}
                  className="flex justify-between items-center p-3 rounded-lg hover:bg-amber-50/50 transition-colors duration-200"
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
                </motion.div>
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

          <Separator className="bg-amber-100/50" />

          <div className="space-y-2 rounded-lg bg-gradient-to-br from-amber-50/50 to-amber-100/30 p-4 border border-amber-100/50">
            <div className="space-y-2 text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-gray-700">{formatRupiah(invoice?.total_harga || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping ({invoice?.opsi_pengiriman || "Standard"})</span>
                <span className="text-gray-700">{formatRupiah(invoice?.biaya_kirim || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Admin Fee</span>
                <span className="text-gray-700">{formatRupiah(invoice?.biaya_admin || 0)}</span>
              </div>
            </div>
            <Separator className="my-2 bg-amber-100/50" />
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="flex justify-between font-bold text-lg"
            >
              <span className="text-gray-800">Total</span>
              <span className="bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
                {formatRupiah(invoice?.total_tagihan || 0)}
              </span>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
