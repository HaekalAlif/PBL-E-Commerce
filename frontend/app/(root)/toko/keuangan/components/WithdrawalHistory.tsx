import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, Calendar, CreditCard, AlertCircle, CheckCircle } from "lucide-react";
import { formatRupiah, formatDate } from "@/lib/utils";
import { WithdrawalRequest } from "../types";
import { motion } from "framer-motion";

interface WithdrawalHistoryProps {
  withdrawals: WithdrawalRequest[];
  loading: boolean;
}

const statusColors = {
  Menunggu: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Diproses: "bg-blue-100 text-blue-800 border-blue-200",
  Selesai: "bg-green-100 text-green-800 border-green-200",
  Ditolak: "bg-red-100 text-red-800 border-red-200",
};

const statusIcons = {
  Menunggu: AlertCircle,
  Diproses: Calendar,
  Selesai: CheckCircle,
  Ditolak: AlertCircle,
};

export function WithdrawalHistory({ withdrawals, loading }: WithdrawalHistoryProps) {
  if (loading) {
    return (
      <Card className="border-orange-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-orange-50">
              <Wallet className="h-4 w-4 text-[#F79E0E]" />
            </div>
            Riwayat Pencairan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-gray-200 rounded"></div>
                      <div className="h-3 w-24 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                  <div className="h-4 w-20 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.6 }}
    >
      <Card className="border-orange-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-orange-50">
              <Wallet className="h-4 w-4 text-[#F79E0E]" />
            </div>
            Riwayat Pencairan
          </CardTitle>
        </CardHeader>
        <CardContent>
          {withdrawals.length === 0 ? (
            <div className="text-center py-8">
              <Wallet className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Belum ada pengajuan pencairan</p>
            </div>
          ) : (
            <div className="space-y-4">
              {withdrawals.map((withdrawal, index) => {
                const StatusIcon = statusIcons[withdrawal.status_pencairan];
                
                return (
                  <motion.div
                    key={withdrawal.id_pencairan}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-orange-50/30 rounded-lg border border-orange-100"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-white border border-orange-100">
                        <StatusIcon className="h-5 w-5 text-[#F79E0E]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">
                            #{withdrawal.id_pencairan}
                          </span>
                          <Badge
                            variant="outline"
                            className={statusColors[withdrawal.status_pencairan]}
                          >
                            {withdrawal.status_pencairan}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(withdrawal.tanggal_pengajuan)}
                            </div>
                            <div className="flex items-center gap-1">
                              <CreditCard className="h-3 w-3" />
                              {withdrawal.nama_bank} - {withdrawal.nomor_rekening}
                            </div>
                          </div>
                          {withdrawal.status_pencairan === 'Selesai' && withdrawal.tanggal_pencairan && (
                            <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                              Dicairkan pada {formatDate(withdrawal.tanggal_pencairan)}
                              <span className="ml-1">• Saldo dikurangi dari rekening</span>
                            </div>
                          )}
                          {withdrawal.catatan_admin && (
                            <div className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                              Admin: {withdrawal.catatan_admin}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-[#F79E0E]">
                        {formatRupiah(withdrawal.jumlah_dana)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {withdrawal.nama_pemilik_rekening}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
