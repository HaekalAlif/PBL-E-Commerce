import { useState, useMemo } from "react";
import { OrderDetail } from "../types";

export const useOrderSummary = (order: OrderDetail | null) => {
  const [isLoading, setIsLoading] = useState(false);

  const summary = useMemo(() => {
    if (!order) return null;

    const subtotal = order.tagihan?.total_harga || 0;
    const shippingCost = order.tagihan?.biaya_kirim || 0;
    const adminFee = order.tagihan?.biaya_admin || 0;
    const total = order.tagihan?.total_tagihan || 0;

    return {
      subtotal,
      shippingCost,
      adminFee,
      total,
      itemCount: order.detail_pembelian?.length || 0,
      paymentInfo: {
        method: order.tagihan?.metode_pembayaran,
        status: order.tagihan?.status_pembayaran || "Pending",
        paymentType: order.tagihan?.midtrans_payment_type,
      },
    };
  }, [order]);

  const canPayNow = useMemo(() => {
    if (!order?.tagihan) return false;
    return (
      order.tagihan.status_pembayaran === "Menunggu" &&
      order.status_pembelian === "Menunggu Pembayaran"
    );
  }, [order]);

  return {
    summary,
    isLoading,
    canPayNow,
  };
};
