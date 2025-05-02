import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { formatRupiah } from "@/lib/utils";

interface OrderSummaryProps {
  subTotal: number;
  total: number;
  itemCount: number;
  processingCheckout: boolean;
  onCheckout: () => void;
  onMakeOffer: () => void;
}

export function OrderSummary({
  subTotal,
  total,
  itemCount,
  processingCheckout,
  onCheckout,
  onMakeOffer,
}: OrderSummaryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-amber-100/50 shadow-md bg-white/60 backdrop-blur-sm">
        <CardHeader className="border-b border-amber-100/30">
          <CardTitle className="text-lg font-semibold bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
            Ringkasan Pesanan
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 pt-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            <div className="flex justify-between">
              <span className="text-gray-600">
                Subtotal ({itemCount} items)
              </span>
              <span className="font-medium text-gray-800">
                {formatRupiah(subTotal)}
              </span>
            </div>
            <Separator className="bg-amber-100" />
            <div className="flex justify-between">
              <span className="font-semibold text-gray-800">Total</span>
              <motion.span
                className="font-bold text-amber-500"
                whileHover={{ scale: 1.05 }}
              >
                {formatRupiah(total)}
              </motion.span>
            </div>
          </motion.div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full"
          >
            <Button
              className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white font-medium py-6 shadow-sm"
              disabled={processingCheckout || itemCount === 0}
              onClick={onCheckout}
            >
              {processingCheckout ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Memproses...
                </span>
              ) : (
                "Lanjutkan ke Pembayaran"
              )}
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="outline"
              className="w-full border-amber-200 text-amber-400 hover:bg-amber-50/50 backdrop-blur-sm"
              onClick={onMakeOffer}
              disabled={itemCount === 0}
            >
              Ajukan Penawaran
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
