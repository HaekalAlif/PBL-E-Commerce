import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History, Package, Calendar, DollarSign } from "lucide-react";
import { formatRupiah, formatDate } from "@/lib/utils";
import { SaldoPerusahaan } from "../types";
import { motion } from "framer-motion";

interface BalanceHistoryProps {
  history: SaldoPerusahaan[];
}

const statusColors = {
  "Menunggu Penyelesaian": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Siap Dicairkan": "bg-green-100 text-green-800 border-green-200",
  Dicairkan: "bg-blue-100 text-blue-800 border-blue-200",
};

export function BalanceHistory({ history }: BalanceHistoryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.4 }}
    >
      <Card className="border-orange-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-orange-50">
              <History className="h-4 w-4 text-[#F79E0E]" />
            </div>
            Riwayat Saldo
          </CardTitle>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Belum ada riwayat saldo</p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((item, index) => (
                <motion.div
                  key={item.id_saldo_perusahaan}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-orange-50/30 rounded-lg border border-orange-100"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-white border border-orange-100">
                      <Package className="h-5 w-5 text-[#F79E0E]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">
                          Pesanan #{item.pembelian.kode_pembelian}
                        </span>
                        <Badge
                          variant="outline"
                          className={statusColors[item.status]}
                        >
                          {item.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(item.created_at)}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          {formatRupiah(item.jumlah_saldo)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-[#F79E0E]">
                      +{formatRupiah(item.jumlah_saldo)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {item.pembelian.status_pembelian}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
