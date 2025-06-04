"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight, Wallet, AlertTriangle, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Import hooks & components
import { useBalance } from "./hooks/useBalance";
import { useWithdrawals } from "./hooks/useWithdrawals";
import { BalanceCard } from "./components/BalanceCard";
import { BalanceHistory } from "./components/BalanceHistory";
import { WithdrawalDialog } from "./components/WithdrawalDialog";
import { WithdrawalHistory } from "./components/WithdrawalHistory";
import { BalanceSkeleton } from "./components/BalanceSkeleton";
import { WithdrawalFormData } from "./types";

export default function KeuanganPage() {
  const {
    balance,
    history,
    loading,
    error,
    fetchBalance,
    fetchHistory,
    submitWithdrawal,
  } = useBalance();

  const {
    withdrawals,
    loading: withdrawalsLoading,
    isSubmitting: withdrawalSubmitting,
  } = useWithdrawals();

  const [isWithdrawalDialogOpen, setIsWithdrawalDialogOpen] = useState(false);

  const handleWithdrawal = async (
    data: WithdrawalFormData
  ): Promise<boolean> => {
    return await submitWithdrawal(data);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 min-h-screen bg-gray-50/50">
        <div className="space-y-4 mb-6">
          <nav className="text-sm">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-16 bg-orange-100 rounded animate-pulse" />
              <div className="h-4 w-4 bg-orange-100 rounded-full animate-pulse" />
              <div className="h-4 w-24 bg-orange-100 rounded animate-pulse" />
            </div>
          </nav>

          <div className="bg-white p-6 rounded-xl border border-orange-100">
            <div className="h-8 w-48 bg-orange-100 rounded animate-pulse" />
          </div>
        </div>

        <BalanceSkeleton />
      </div>
    );
  }

  if (error || !balance) {
    return (
      <div className="container mx-auto p-6 min-h-screen bg-gray-50/50">
        <div className="space-y-4 mb-6">
          {/* Breadcrumb */}
          <nav className="text-sm">
            <ol className="flex items-center space-x-2">
              <li>
                <Link
                  href="/toko/profile"
                  className="text-gray-600 hover:text-[#F79E0E] transition-colors"
                >
                  Toko
                </Link>
              </li>
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <li className="text-[#F79E0E] font-medium">Keuangan</li>
            </ol>
          </nav>

          {/* Header */}
          <div className="bg-white p-6 rounded-xl border border-orange-100/50">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#F79E0E] to-[#FFB648] text-white">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Keuangan Toko
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  Kelola saldo dan riwayat pendapatan toko Anda
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Error State */}
        <Card className="border-orange-100">
          <CardHeader>
            <CardTitle className="text-red-500 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Terjadi Kesalahan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              {error || "Gagal memuat data keuangan"}
            </p>
            <Button
              onClick={fetchBalance}
              className="bg-[#F79E0E] hover:bg-[#F79E0E]/90"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Coba Lagi
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 min-h-screen bg-gray-50/50">
      <div className="space-y-4 mb-6">
        {/* Breadcrumb */}
        <nav className="text-sm">
          <ol className="flex items-center space-x-2">
            <li>
              <Link
                href="/toko/profile"
                className="text-gray-600 hover:text-[#F79E0E] transition-colors"
              >
                Toko
              </Link>
            </li>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <li className="text-[#F79E0E] font-medium">Keuangan</li>
          </ol>
        </nav>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl border border-orange-100/50 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#F79E0E] to-[#FFB648] text-white shadow-lg shadow-orange-100/50">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Keuangan Toko</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Kelola saldo dan riwayat pendapatan toko Anda
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="space-y-6">
        {/* Balance Cards */}
        <BalanceCard
          balance={balance}
          onWithdraw={() => setIsWithdrawalDialogOpen(true)}
        />

        {/* Balance History */}
        <BalanceHistory history={history} />

        {/* Withdrawal History */}
        <WithdrawalHistory
          withdrawals={withdrawals}
          loading={withdrawalsLoading}
        />

        {/* Withdrawal Dialog */}
        <WithdrawalDialog
          open={isWithdrawalDialogOpen}
          onOpenChange={setIsWithdrawalDialogOpen}
          onSubmit={handleWithdrawal}
          isSubmitting={withdrawalSubmitting}
          maxAmount={balance?.saldo_tersedia || 0}
        />
      </div>
    </div>
  );
}
