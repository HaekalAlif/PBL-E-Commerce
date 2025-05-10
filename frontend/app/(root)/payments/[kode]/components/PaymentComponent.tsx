import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, RefreshCw, CreditCard } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { PaymentComponentProps } from "../types";

export const PaymentComponent = ({
  invoice,
  paymentStatus,
  timeLeft,
  paymentLoading,
  onPayment,
}: PaymentComponentProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <Card className="sticky top-6 border-amber-100/50 shadow-lg bg-white/60 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="border-b border-amber-100/30">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-[#F79E0E] to-[#FFB648] rounded-full">
              <CreditCard className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
              Payment Method
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-100/50">
            <div className="p-2 rounded-full bg-white/80">
              <CreditCard className="h-4 w-4 text-amber-500" />
            </div>
            <div>
              <p className="font-medium text-gray-800">
                {invoice.metode_pembayaran === "midtrans"
                  ? "Midtrans Payment Gateway"
                  : invoice.metode_pembayaran}
              </p>
              {invoice.midtrans_payment_type && (
                <p className="text-sm text-gray-500">
                  Payment type: {invoice.midtrans_payment_type}
                </p>
              )}
            </div>
          </div>
        </CardContent>
        <Separator className="bg-amber-100/50" />
        <CardFooter className="flex flex-col gap-4 px-6">
          {paymentStatus === "Menunggu" &&
          timeLeft &&
          timeLeft !== "Expired" ? (
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full"
            >
              <Button
                className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 
                         text-white font-medium py-6 shadow-sm hover:shadow-md transition-all duration-300"
                onClick={onPayment}
                disabled={paymentLoading}
              >
                {paymentLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </span>
                ) : (
                  "Pay Now"
                )}
              </Button>
            </motion.div>
          ) : (
            <div className="w-full space-y-3">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  className="w-full border-amber-200 text-amber-600 hover:bg-amber-50 transition-colors"
                  variant="outline"
                  asChild
                >
                  <Link href={`/akun/pesanan/${invoice.pembelian.kode_pembelian}`}>
                    Lihat Detail Pesanan
                  </Link>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white"
                  asChild
                >
                  <Link href="/katalog">Lanjut Belanja</Link>
                </Button>
              </motion.div>
            </div>
          )}

          {paymentStatus === "Menunggu" && (
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                className="w-full border-amber-200 text-amber-600 hover:bg-amber-50/80 hover:border-amber-300 
                         transition-all duration-300 group"
                onClick={() => toast.info("Refreshing payment status...")}
              >
                <RefreshCw className="mr-2 h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
                Refresh Status
              </Button>
            </motion.div>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};
