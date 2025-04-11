import { useState, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import { getCsrfToken } from "@/lib/axios";
import { PaymentWithOrder, PaymentStats } from "../types";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const usePaymentManagement = () => {
  const router = useRouter();
  const [payments, setPayments] = useState<PaymentWithOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPayments, setTotalPayments] = useState(0);
  const [selectedPayment, setSelectedPayment] =
    useState<PaymentWithOrder | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [isVerifyDialogOpen, setIsVerifyDialogOpen] = useState(false);
  const [isStatusUpdateDialogOpen, setIsStatusUpdateDialogOpen] =
    useState(false);
  const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false);

  // Fetch payments with filters
  const fetchPayments = useCallback(
    async (filters: any = {}) => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/admin/payments`, {
          params: filters,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: true,
        });

        if (response.data.status === "success") {
          setPayments(response.data.data.data || []);
          setTotalPages(response.data.data.last_page || 1);
          setTotalPayments(response.data.data.total || 0);
        } else {
          toast.error(response.data.message || "Failed to fetch payments");
          setPayments([]);
        }
      } catch (error: any) {
        console.error("Error fetching payments:", error);
        toast.error("Failed to load payments. Please try again later.");

        // Handle unauthorized access
        if (error.response?.status === 401) {
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  // Fetch payment stats
  const fetchStats = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/payments/stats`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        withCredentials: true,
      });

      if (response.data.status === "success") {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching payment stats:", error);
    }
  }, []);

  // Get payment details
  const getPaymentDetails = useCallback(async (kode: string) => {
    try {
      const response = await axios.get(`${API_URL}/admin/payments/${kode}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        withCredentials: true,
      });

      if (response.data.status === "success") {
        setSelectedPayment(response.data.data);
        setIsDetailOpen(true);
        return response.data.data;
      } else {
        toast.error(response.data.message || "Failed to fetch payment details");
        return null;
      }
    } catch (error) {
      console.error("Error fetching payment details:", error);
      toast.error("Failed to load payment details");
      return null;
    }
  }, []);

  // Update payment status
  const updatePaymentStatus = useCallback(
    async (kode: string, status: string, adminNotes?: string) => {
      try {
        await getCsrfToken();

        const response = await axios.put(
          `${API_URL}/admin/payments/${kode}/status`,
          {
            status,
            admin_notes: adminNotes,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            withCredentials: true,
          }
        );

        if (response.data.status === "success") {
          toast.success("Payment status updated successfully");
          // Refresh payment details
          await getPaymentDetails(kode);
          return true;
        } else {
          toast.error(
            response.data.message || "Failed to update payment status"
          );
          return false;
        }
      } catch (error: any) {
        console.error("Error updating payment status:", error);
        toast.error(
          error.response?.data?.message || "Failed to update payment status"
        );
        return false;
      }
    },
    [getPaymentDetails]
  );

  // Process refund
  const processRefund = useCallback(
    async (
      kode: string,
      reason: string,
      amount: number | null,
      fullRefund: boolean
    ) => {
      try {
        await getCsrfToken();

        const response = await axios.post(
          `${API_URL}/admin/payments/${kode}/refund`,
          {
            reason,
            amount,
            full_refund: fullRefund,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            withCredentials: true,
          }
        );

        if (response.data.status === "success") {
          toast.success("Refund processed successfully");
          // Refresh payment details
          await getPaymentDetails(kode);
          return true;
        } else {
          toast.error(response.data.message || "Failed to process refund");
          return false;
        }
      } catch (error: any) {
        console.error("Error processing refund:", error);
        toast.error(
          error.response?.data?.message || "Failed to process refund"
        );
        return false;
      }
    },
    [getPaymentDetails]
  );

  // Verify payment manually
  const verifyPaymentManually = useCallback(
    async (kode: string, adminNotes?: string) => {
      try {
        await getCsrfToken();

        const response = await axios.post(
          `${API_URL}/admin/payments/${kode}/verify`,
          {
            admin_notes: adminNotes,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            withCredentials: true,
          }
        );

        if (response.data.status === "success") {
          toast.success("Payment manually verified successfully");
          // Refresh payment details
          await getPaymentDetails(kode);
          return true;
        } else {
          toast.error(response.data.message || "Failed to verify payment");
          return false;
        }
      } catch (error: any) {
        console.error("Error verifying payment:", error);
        toast.error(
          error.response?.data?.message || "Failed to verify payment"
        );
        return false;
      }
    },
    [getPaymentDetails]
  );

  return {
    payments,
    loading,
    totalPages,
    totalPayments,
    selectedPayment,
    isDetailOpen,
    stats,
    isVerifyDialogOpen,
    isStatusUpdateDialogOpen,
    isRefundDialogOpen,
    setIsDetailOpen,
    setIsVerifyDialogOpen,
    setIsStatusUpdateDialogOpen,
    setIsRefundDialogOpen,
    fetchPayments,
    fetchStats,
    getPaymentDetails,
    updatePaymentStatus,
    processRefund,
    verifyPaymentManually,
  };
};
