import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { OrderDetail } from "../types";

export const useOrderDetail = (kode: string) => {
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isConfirmDeliveryOpen, setIsConfirmDeliveryOpen] = useState(false);
  const [isComplaintDialogOpen, setIsComplaintDialogOpen] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const updateCurrentStep = (status: string) => {
    let step = 0;
    switch (status) {
      case "Draft":
        step = 0;
        break;
      case "Menunggu Pembayaran":
        step = 0;
        break;
      case "Dibayar":
        step = 1;
        break;
      case "Diproses":
        step = 2;
        break;
      case "Dikirim":
        step = 3;
        break;
      case "Selesai":
        step = 5;
        break;
      case "Dibatalkan":
        step = -1;
        break;
      default:
        step = 0;
    }
    setCurrentStep(step);
  };

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/purchases/${kode}`
      );

      if (response.data.status === "success") {
        const orderData = response.data.data;
        setOrder(orderData);
        updateCurrentStep(orderData.status_pembelian);

        // Log order details for debugging
        console.log("Order Response:", {
          orderData,
          detailPembelian: orderData.detail_pembelian?.[0],
          detailPembelianId: orderData.detail_pembelian?.[0]?.id_detail,
        });
      } else {
        throw new Error(
          response.data.message || "Failed to load order details"
        );
      }
    } catch (error: any) {
      console.error("Error fetching order details:", error);
      setError(error.response?.data?.message || "Error loading order details");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderItems = async (purchaseId: number) => {
    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/purchases/${kode}/items`
      );

      if (response.data.status === "success" && response.data.data) {
        setOrder((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            detailPembelian: response.data.data,
          };
        });
      }
    } catch (error) {
      console.error("Error fetching order items:", error);
    }
  };

  const confirmDelivery = async () => {
    if (!order) return;

    setIsConfirming(true);
    try {
      const response = await axiosInstance.put(
        `${process.env.NEXT_PUBLIC_API_URL}/purchases/${order.kode_pembelian}/confirm-delivery`
      );

      if (response.data.status === "success") {
        toast.success("Delivery confirmed successfully!");
        setOrder({
          ...order,
          status_pembelian: "Diterima",
        });
        setCurrentStep(5);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to confirm delivery");
    } finally {
      setIsConfirming(false);
      setIsConfirmDeliveryOpen(false);
    }
  };

  const completePurchase = async () => {
    if (!order) return;

    setIsCompleting(true);
    try {
      const response = await axiosInstance.put(
        `${process.env.NEXT_PUBLIC_API_URL}/purchases/${kode}/complete`
      );

      if (response.data.status === "success") {
        toast.success("Pesanan berhasil diselesaikan");
        setOrder((prev) =>
          prev
            ? {
                ...prev,
                status_pembelian: "Selesai",
              }
            : null
        );
        updateCurrentStep("Selesai");
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Gagal menyelesaikan pesanan"
      );
    } finally {
      setIsCompleting(false);
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
    currentStep,
    isConfirmDeliveryOpen,
    isComplaintDialogOpen,
    isConfirming,
    isCompleting,
    setIsConfirmDeliveryOpen,
    setIsComplaintDialogOpen,
    confirmDelivery,
    completePurchase,
    refetch: fetchOrderDetail,
  };
};
