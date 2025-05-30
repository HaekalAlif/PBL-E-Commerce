"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { OrderDetailHeader } from "./components/OrderDetailHeader";
import { OrderTrackingTimeline } from "./components/OrderTrackingTimeline";
import { OrderItems } from "./components/OrderItems";
import { ShippingInfo } from "./components/ShippingInfo";
import { PaymentSummary } from "./components/PaymentSummary";
import { useOrderDetail } from "./hooks/useOrderDetail";
import { trackingSteps, statusToStepMap } from "./types";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getStatusIcon, getStatusBadge } from "@/lib/status-utils";
import { OrderDetailSkeleton } from "./components/OrderDetailSkeleton";
import { ReviewForm } from "./components/ReviewForm";
import { ReviewDetails } from "./components/ReviewDetails";
import { KomplainForm } from "./components/KomplainForm";
import { KomplainDetails } from "./components/KomplainDetails";

import { getCsrfToken } from "@/lib/axios";
import { toast } from "sonner";

interface OrderDetailPageProps {}

export default function OrderDetailPage() {
  const params = useParams();
  const kode = (params?.kode ?? "") as string;
  const {
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
    refetch,
  } = useOrderDetail(kode);

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isKomplainFormOpen, setIsKomplainFormOpen] = useState(false);
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);

  const handleReview = () => {
    if (order?.review?.id_review) {
      return;
    }
    setIsReviewModalOpen(true);
  };

  const handleReviewSuccess = () => {
    refetch();
  };

  if (loading) {
    return <OrderDetailSkeleton />;
  }

  if (error || !order) {
    return (
      <div className="space-y-6">
        <OrderDetailHeader
          orderCode="Error"
          orderDate=""
          statusIcon={<AlertCircle className="h-5 w-5 text-red-500" />}
          statusBadge={<Badge variant="destructive">Error</Badge>}
        />
        <Card className="border-red-100">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <p>{error || "Order not found"}</p>
            </div>
            <Button onClick={refetch} className="mt-4" variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentStatus =
    statusToStepMap[order.status_pembelian as keyof typeof statusToStepMap] ||
    0;

  return (
    <div className="space-y-6">
      <OrderDetailHeader
        orderCode={order.kode_pembelian}
        orderDate={order.created_at}
        statusIcon={getStatusIcon(order.status_pembelian)}
        statusBadge={getStatusBadge(order.status_pembelian)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <OrderTrackingTimeline
            currentStep={currentStatus}
            steps={trackingSteps}
            trackingInfo={{
              resi: order.detail_pembelian[0]?.pengiriman_pembelian?.nomor_resi,
              courier: order.tagihan?.opsi_pengiriman,
            }}
            isCancelled={order.status_pembelian === "Dibatalkan"}
          />

          <OrderItems
            items={order.detail_pembelian.map((item) => ({
              id_detail_pembelian: item.id_detail,
              jumlah: item.jumlah,
              harga_satuan: item.harga_satuan,
              subtotal: item.subtotal,
              barang: {
                nama_barang: item.barang.nama_barang,
                slug: item.barang.slug,
                gambar_barang: item.barang.gambar_barang,
              },
            }))}
            onRetry={refetch}
          />

          {order.detail_pembelian[0]?.pengiriman_pembelian && (
            <ShippingInfo
              pengiriman={{
                ...order.detail_pembelian[0].pengiriman_pembelian,
                catatan_pengiriman:
                  order.detail_pembelian[0].pengiriman_pembelian
                    .catatan_pengiriman ?? undefined,
              }}
              address={order.alamat}
              shippingMethod={order.tagihan?.opsi_pengiriman}
              notes={order.catatan_pembeli || undefined}
              showBukti={true}
            />
          )}
        </div>

        <div className="space-y-6">
          <PaymentSummary
            order={{
              ...order,
              tagihan: order.tagihan
                ? {
                    ...order.tagihan,
                    midtrans_payment_type:
                      order.tagihan.midtrans_payment_type ?? undefined,
                  }
                : undefined,
            }}
            onConfirmDelivery={confirmDelivery}
            onReportIssue={() => setIsKomplainFormOpen(true)}
            onPayNow={() =>
              (window.location.href = `/payments/${order.tagihan?.kode_tagihan}`)
            }
            onReview={handleReview}
            onComplete={completePurchase}
            isConfirming={isConfirming}
            isCompleting={isCompleting}
          />

          {order.review && <ReviewDetails review={order.review} />}
          {order.komplain && (
            <KomplainDetails
              komplain={order.komplain}
              kodePembelian={order.kode_pembelian} // Pass kodePembelian here
            />
          )}
        </div>
      </div>

      <ReviewForm
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        purchaseId={order.id_pembelian}
        onSuccess={handleReviewSuccess}
      />

      <KomplainForm
        isOpen={isKomplainFormOpen}
        onClose={() => setIsKomplainFormOpen(false)}
        purchaseId={order?.id_pembelian || 0}
        onSuccess={refetch}
      />
    </div>
  );
}
