import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Shield } from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import { motion } from "framer-motion";

interface OrderDetailSummaryProps {
  orderTotal: number;
  itemCount: number;
  paymentInfo: {
    method?: string;
    status: string;
    paymentType?: string;
  };
}

export const OrderDetailSummary = ({
  orderTotal,
  itemCount,
  paymentInfo,
}: OrderDetailSummaryProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Ringkasan Pesanan</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div className="text-sm text-gray-500">
              Total Item ({itemCount})
            </div>
            <div className="text-lg font-semibold text-[#F79E0E]">
              {formatRupiah(orderTotal)}
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Informasi Pembayaran</h4>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Metode</span>
                <span className="font-medium">
                  {paymentInfo.method || "Belum dipilih"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Status</span>
                <span className="font-medium">{paymentInfo.status}</span>
              </div>
              {paymentInfo.paymentType && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tipe Pembayaran</span>
                  <span className="font-medium">{paymentInfo.paymentType}</span>
                </div>
              )}
            </div>
          </div>

          <motion.div
            className="flex items-center gap-2 text-sm text-gray-500 bg-orange-50/50 p-3 rounded-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Shield className="w-4 h-4 text-[#F79E0E]" />
            <span>Transaksi Anda dijamin aman dan terpercaya</span>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
};
