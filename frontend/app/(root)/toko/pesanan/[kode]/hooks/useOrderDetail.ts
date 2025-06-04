import { useState, useEffect } from "react";
import { OrderDetail, ShippingFormData } from "../types";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";

export const useOrderDetail = (kode: string) => {
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchOrderDetail = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/seller/orders/${kode}`
      );

      if (response.data.status === "success") {
        setOrder(response.data.data);
      } else {
        setError("Failed to load order details");
      }
    } catch (error: any) {
      console.error("Error fetching order details:", error);
      setError(error.response?.data?.message || "Error loading order details");
    } finally {
      setLoading(false);
    }
  };

  const confirmOrder = async () => {
    try {
      setIsProcessing(true);
      const response = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_URL}/seller/orders/${kode}/confirm`
      );

      if (response.data.status === "success") {
        toast.success("Pesanan berhasil dikonfirmasi");
        await fetchOrderDetail(); // Refresh order data
        return true;
      } else {
        toast.error("Gagal mengkonfirmasi pesanan");
        return false;
      }
    } catch (error: any) {
      console.error("Error confirming order:", error);
      toast.error(
        error.response?.data?.message || "Error mengkonfirmasi pesanan"
      );
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const shipOrder = async (formData: ShippingFormData) => {
    try {
      setIsProcessing(true);

      const data = new FormData();
      data.append("nomor_resi", formData.nomor_resi);
      if (formData.catatan_pengiriman) {
        data.append("catatan_pengiriman", formData.catatan_pengiriman);
      }
      data.append("bukti_pengiriman", formData.bukti_pengiriman);

      const response = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_URL}/seller/orders/${kode}/ship`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status === "success") {
        toast.success("Pesanan berhasil dikirim");
        await fetchOrderDetail(); // Refresh order data
        return true;
      } else {
        toast.error("Gagal mengirim pesanan");
        return false;
      }
    } catch (error: any) {
      console.error("Error shipping order:", error);
      toast.error(error.response?.data?.message || "Error mengirim pesanan");
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (kode) {
      fetchOrderDetail();
    }
  }, [kode]);

  return {
    order,
    loading,
    error,
    isProcessing,
    fetchOrderDetail,
    confirmOrder,
    shipOrder,
  };
};
