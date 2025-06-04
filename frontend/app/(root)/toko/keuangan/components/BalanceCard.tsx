import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, DollarSign, Clock, Download } from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import { SaldoPenjual } from "../types";
import { motion } from "framer-motion";

interface BalanceCardProps {
  balance: SaldoPenjual;
  onWithdraw: () => void;
}

export function BalanceCard({ balance, onWithdraw }: BalanceCardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total Saldo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="border-orange-100 bg-gradient-to-br from-orange-50 to-orange-100/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <div className="p-2 rounded-lg bg-[#F79E0E] text-white">
                <Wallet className="h-4 w-4" />
              </div>
              Total Saldo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#F79E0E] mb-1">
              {formatRupiah(balance.total_saldo)}
            </div>
            <p className="text-sm text-gray-600">Tersedia + Tertahan</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Saldo Tersedia */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="border-green-100 bg-gradient-to-br from-green-50 to-green-100/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <div className="p-2 rounded-lg bg-green-500 text-white">
                <DollarSign className="h-4 w-4" />
              </div>
              Saldo Tersedia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 mb-1">
              {formatRupiah(balance.saldo_tersedia)}
            </div>
            <p className="text-sm text-gray-600">Siap untuk dicairkan</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Saldo Tertahan */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card className="border-amber-100 bg-gradient-to-br from-amber-50 to-amber-100/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <div className="p-2 rounded-lg bg-amber-500 text-white">
                <Clock className="h-4 w-4" />
              </div>
              Saldo Tertahan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600 mb-1">
              {formatRupiah(balance.saldo_tertahan)}
            </div>
            <p className="text-sm text-gray-600">Sedang diproses</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Withdraw Button - Full Width */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="md:col-span-3"
      >
        <Card className="border-orange-100">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  Tarik Saldo
                </h3>
                <p className="text-sm text-gray-600">
                  Cairkan saldo tersedia Anda ke rekening bank
                </p>
              </div>
              <Button
                onClick={onWithdraw}
                disabled={balance.saldo_tersedia <= 0}
                className="bg-[#F79E0E] hover:bg-[#F79E0E]/90 w-full sm:w-auto"
              >
                <Download className="h-4 w-4 mr-2" />
                Tarik Saldo
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
