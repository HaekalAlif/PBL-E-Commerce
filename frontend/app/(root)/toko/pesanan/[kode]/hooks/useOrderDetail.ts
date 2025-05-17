import { useState } from "react";
import { OrderDetail, ShippingFormData } from "../types";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";

export const useOrderDetail = (kode: string) => {
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      console.error("Error fetching order detail:", error);
      setError(error.response?.data?.message || "Error loading order");
    } finally {
      setLoading(false);
    }
  };

  const confirmReceipt = async () => {
    if (!order) return;

    try {
      setIsProcessingOrder(true);
      const response = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_URL}/seller/orders/${order.kode_pembelian}/confirm`
      );

      if (response.data.status === "success") {
        toast.success("Pesanan sedang diproses");
        setOrder({
          ...order,
          status_pembelian: "Diproses",
        });
        return true;
      } else {
        toast.error("Gagal memproses pesanan");
        return false;
      }
    } catch (error: any) {
      console.error("Error processing order:", error);
      toast.error(error.response?.data?.message || "Error memproses pesanan");
      return false;
    } finally {
      setIsProcessingOrder(false);
    }
  };

  const shipOrder = async (formData: ShippingFormData) => {
    if (!order || !formData.bukti_pengiriman) {
      toast.error("Mohon lengkapi semua field yang diperlukan");
      return false;
    }

    try {
      setIsSubmitting(true);
      const data = new FormData();
      data.append("nomor_resi", formData.nomor_resi);
      if (formData.catatan_pengiriman) {
        data.append("catatan_pengiriman", formData.catatan_pengiriman);
      }
      data.append("bukti_pengiriman", formData.bukti_pengiriman);

      const response = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_URL}/seller/orders/${order.kode_pembelian}/ship`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status === "success") {
        toast.success("Pesanan telah dikirim");
        setOrder({
          ...order,
          status_pembelian: "Dikirim",
          pengiriman: response.data.data.pengiriman,
        });
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
      setIsSubmitting(false);
    }
  };

  return {
    order,
    loading,
    error,
    isProcessingOrder,
    isSubmitting,
    fetchOrderDetail,
    confirmReceipt,
    shipOrder,
  };
};
