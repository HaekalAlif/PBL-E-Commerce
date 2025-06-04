import { useState, useEffect } from "react";
import { SaldoPenjual, SaldoPerusahaan, WithdrawalFormData } from "../types";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { useWithdrawals } from "./useWithdrawals";

export const useBalance = () => {
  const [balance, setBalance] = useState<SaldoPenjual | null>(null);
  const [history, setHistory] = useState<SaldoPerusahaan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createWithdrawal, fetchWithdrawals } = useWithdrawals();

  const fetchBalance = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/seller/balance`
      );

      if (response.data.status === "success") {
        setBalance(response.data.data);
      } else {
        setError("Failed to load balance");
      }
    } catch (error: any) {
      console.error("Error fetching balance:", error);
      setError(error.response?.data?.message || "Error loading balance");
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/seller/balance/history`
      );

      if (response.data.status === "success") {
        setHistory(response.data.data);
      }
    } catch (error: any) {
      console.error("Error fetching history:", error);
    }
  };

  const submitWithdrawal = async (
    data: WithdrawalFormData
  ): Promise<boolean> => {
    const success = await createWithdrawal(data);
    if (success) {
      // Refresh balance after successful withdrawal request
      await fetchBalance();
      await fetchWithdrawals();
    }
    return success;
  };

  useEffect(() => {
    fetchBalance();
    fetchHistory();
  }, []);

  return {
    balance,
    history,
    loading,
    error,
    isSubmitting,
    fetchBalance,
    fetchHistory,
    submitWithdrawal,
  };
};
