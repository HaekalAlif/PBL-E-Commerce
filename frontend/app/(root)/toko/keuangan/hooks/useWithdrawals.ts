import { useState, useEffect } from "react";
import { WithdrawalRequest, WithdrawalFormData } from "../types";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";

export const useWithdrawals = () => {
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchWithdrawals = async (status: string = "all") => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/seller/withdrawals`,
        {
          params: { status },
        }
      );

      if (response.data.status === "success") {
        setWithdrawals(response.data.data.data || []);
      } else {
        setError("Failed to load withdrawal requests");
      }
    } catch (error: any) {
      console.error("Error fetching withdrawals:", error);
      setError(
        error.response?.data?.message || "Error loading withdrawal requests"
      );
    } finally {
      setLoading(false);
    }
  };

  const createWithdrawal = async (
    data: WithdrawalFormData
  ): Promise<boolean> => {
    try {
      setIsSubmitting(true);
      const response = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_URL}/seller/withdrawals`,
        data
      );

      if (response.data.status === "success") {
        toast.success("Pengajuan pencairan berhasil dibuat");
        await fetchWithdrawals(); // Refresh list
        return true;
      } else {
        toast.error("Gagal membuat pengajuan pencairan");
        return false;
      }
    } catch (error: any) {
      console.error("Error creating withdrawal:", error);
      toast.error(
        error.response?.data?.message || "Error membuat pengajuan pencairan"
      );
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelWithdrawal = async (id: number): Promise<boolean> => {
    try {
      setIsSubmitting(true);
      const response = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_URL}/seller/withdrawals/${id}/cancel`
      );

      if (response.data.status === "success") {
        toast.success("Pengajuan pencairan berhasil dibatalkan");
        await fetchWithdrawals(); // Refresh list
        return true;
      } else {
        toast.error("Gagal membatalkan pengajuan pencairan");
        return false;
      }
    } catch (error: any) {
      console.error("Error canceling withdrawal:", error);
      toast.error(
        error.response?.data?.message || "Error membatalkan pengajuan pencairan"
      );
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWithdrawalById = async (
    id: number
  ): Promise<WithdrawalRequest | null> => {
    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/seller/withdrawals/${id}`
      );

      if (response.data.status === "success") {
        return response.data.data;
      }
      return null;
    } catch (error: any) {
      console.error("Error fetching withdrawal:", error);
      return null;
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  return {
    withdrawals,
    loading,
    error,
    isSubmitting,
    fetchWithdrawals,
    createWithdrawal,
    cancelWithdrawal,
    getWithdrawalById,
  };
};
