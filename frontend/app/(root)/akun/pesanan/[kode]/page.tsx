"use client";

import { useParams } from "next/navigation";
import { OrderDetailHeader } from "./components/OrderDetailHeader";
import { OrderTrackingTimeline } from "./components/OrderTrackingTimeline";
import { OrderItems } from "./components/OrderItems";
import { ShippingInfo } from "./components/ShippingInfo";
import { PaymentSummary } from "./components/PaymentSummary";
import { ConfirmationDialogs } from "./components/ConfirmationDialogs";
import { useOrderDetail } from "./hooks/useOrderDetail";
import { trackingSteps } from "./types";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getStatusIcon, getStatusBadge } from "@/lib/status-utils";
import { OrderDetailSkeleton } from "./components/OrderDetailSkeleton";

export default function OrderDetailPage() {
  const params = useParams();
  const kode = params?.kode as string;

  const {
    order,
    loading,
    error,
    currentStep,
    isConfirmDeliveryOpen,
    isComplaintDialogOpen,
    isConfirming,
    setIsConfirmDeliveryOpen,
    setIsComplaintDialogOpen,
    confirmDelivery,
    refetch,
  } = useOrderDetail(kode);

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
            currentStep={currentStep}
            steps={trackingSteps}
            trackingInfo={order.tracking_info}
            isCancelled={order.status_pembelian === "Dibatalkan"}
          />

          <OrderItems items={order.detailPembelian} onRetry={refetch} />

          <ShippingInfo
            address={order.alamat}
            shippingMethod={order.tagihan?.opsi_pengiriman}
            notes={order.catatan_pembeli}
          />
        </div>

        <div className="space-y-6">
          <PaymentSummary
            order={order}
            onConfirmDelivery={() => setIsConfirmDeliveryOpen(true)}
            onReportIssue={() => setIsComplaintDialogOpen(true)}
            onPayNow={() =>
              (window.location.href = `/payments/${order.tagihan?.kode_tagihan}`)
            }
          />
        </div>
      </div>

      <ConfirmationDialogs
        confirmDeliveryOpen={isConfirmDeliveryOpen}
        setConfirmDeliveryOpen={setIsConfirmDeliveryOpen}
        complaintDialogOpen={isComplaintDialogOpen}
        setComplaintDialogOpen={setIsComplaintDialogOpen}
        onConfirmDelivery={confirmDelivery}
        isConfirming={isConfirming}
      />
    </div>
  );
}
