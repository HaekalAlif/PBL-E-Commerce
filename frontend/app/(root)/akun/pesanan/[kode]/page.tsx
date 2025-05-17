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
                    .catatan_pengiriman || undefined,
              }}
              address={{
                nama_penerima: order.alamat.nama_penerima,
                no_telepon: order.alamat.no_telepon,
                alamat_lengkap: order.alamat.alamat_lengkap,
                kode_pos: order.alamat.kode_pos,
                district: {
                  name: order.alamat.district.name,
                },
                regency: {
                  name: order.alamat.regency.name,
                },
                province: {
                  name: order.alamat.province.name,
                },
              }}
              shippingMethod={order.tagihan?.opsi_pengiriman}
              notes={order.catatan_pembeli || undefined}
              showBukti={true}
            />
          )}
        </div>

        <div className="space-y-6">
          <PaymentSummary
            order={{
              status_pembelian: order.status_pembelian,
              tagihan: {
                total_harga: order.tagihan?.total_harga || 0,
                biaya_kirim: order.tagihan?.biaya_kirim || 0,
                biaya_admin: order.tagihan?.biaya_admin || 0,
                total_tagihan: order.tagihan?.total_tagihan || 0,
                status_pembayaran: order.tagihan?.status_pembayaran || "",
                metode_pembayaran: order.tagihan?.metode_pembayaran || "",
                midtrans_payment_type:
                  order.tagihan?.midtrans_payment_type || undefined,
                tanggal_pembayaran: order.tagihan?.tanggal_pembayaran,
                kode_tagihan: order.tagihan?.kode_tagihan,
              },
            }}
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
