import { useState } from "react";

// Extend the Window interface to include the 'snap' property
declare global {
  interface Window {
    snap?: {
      pay: (
        snapToken: string,
        callbacks: {
          onSuccess?: (result: any) => void;
          onPending?: (result: any) => void;
          onError?: (result: any) => void;
          onClose?: () => void;
        }
      ) => void;
    };
  }
}
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { InvoiceDetails } from "../types";

export const usePayment = (kode: string) => {
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentProcessed, setPaymentProcessed] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [invoice, setInvoice] = useState<InvoiceDetails | null>(null);

  const fetchInvoiceDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/payments/${kode}`
      );

      if (response.data.status === "success") {
        const invoiceData = response.data.data;

        // Debug logs
        console.log("Raw API Response:", response.data);
        console.log("Invoice Data:", invoiceData);
        console.log("Pembelian Data:", invoiceData.pembelian);
        console.log("Alamat from API:", invoiceData.pembelian?.alamat);

        // Validasi data pembelian dan alamat
        if (!invoiceData.pembelian) {
          console.error("Missing pembelian data");
          setError("Invalid invoice data structure: missing pembelian");
          return;
        }

        if (!invoiceData.pembelian.alamat) {
          console.error("Missing alamat data");
          setError("Invalid invoice data structure: missing alamat");
          return;
        }

        // Set invoice data
        setInvoice(invoiceData);
        setPaymentStatus(invoiceData.status_pembayaran);

        if (invoiceData.status_pembayaran === "Dibayar") {
          setPaymentProcessed(true);
        }
      } else {
        setError("Failed to load payment details. Invalid response from server.");
      }
    } catch (error) {
      console.error("Error fetching invoice details:", error);
      setError("Failed to load payment details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPurchaseDetails = async (purchaseId: number) => {
    if (!purchaseId) return;

    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/debug/purchases/by-id/${purchaseId}`
      );

      if (response.data.status === "success" && response.data.purchase) {
        setInvoice((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            pembelian: {
              ...response.data.purchase,
              detailPembelian: response.data.details || [],
            },
          };
        });
      }
    } catch (error) {
      console.error("Error fetching purchase details:", error);
    }
  };

  const checkPaymentStatus = async () => {
    if (!kode || paymentProcessed) return;

    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/payments/${kode}/status`
      );

      if (response.data.status === "success") {
        const paymentData = response.data.data;
        setPaymentStatus(paymentData.status_pembayaran);

        if (error) setError(null);

        if (paymentData.status_pembayaran === "Dibayar") {
          setPaymentProcessed(true);
          toast.success("Payment completed successfully!");
        } else if (
          paymentData.status_pembayaran === "Expired" ||
          paymentData.status_pembayaran === "Gagal"
        ) {
          setPaymentProcessed(true);
        }
      }
    } catch (error) {
      console.error("Error checking payment status:", error);
    }
  };

  const handlePayment = async () => {
    if (!invoice) return;

    setPaymentLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_URL}/payments/${kode}/process`
      );

      if (response.data.status === "success") {
        const { snap_token, redirect_url } = response.data.data;

        if (window.snap && snap_token) {
          window.snap.pay(snap_token, {
            onSuccess: function (result: any) {
              setPaymentProcessed(true);
              setPaymentStatus("Dibayar");
              toast.success("Payment completed successfully!");
              checkPaymentStatus();
            },
            onPending: function (result: any) {
              toast.info("Waiting for your payment");
              checkPaymentStatus();
            },
            onError: function (result: any) {
              toast.error("Payment failed, please try again");
              checkPaymentStatus();
            },
            onClose: function () {
              toast.info("Payment window closed, you can try again");
              checkPaymentStatus();
            },
          });
        } else if (redirect_url) {
          window.location.href = redirect_url;
        } else {
          setError("Payment method not available. Please try again later.");
          toast.error("Payment method not available");
        }
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Payment processing failed. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setPaymentLoading(false);
    }
  };

  return {
    loading,
    paymentLoading,
    paymentProcessed,
    paymentStatus,
    error,
    invoice,
    fetchInvoiceDetails,
    checkPaymentStatus,
    handlePayment,
  };
};
