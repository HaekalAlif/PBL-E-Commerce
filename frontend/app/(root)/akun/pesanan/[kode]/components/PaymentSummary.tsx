import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatRupiah } from "@/lib/utils";
import { formatDate } from "@/lib/formatter";
import {
  AlertCircle,
  CheckCircle,
  Download,
  CreditCard,
  Package,
  Check,
  Cigarette,
} from "lucide-react";
import Link from "next/link";
import { FaMoneyBill } from "react-icons/fa";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PaymentSummaryProps {
  order: {
    status_pembelian: string;
    id_pembelian: number;
    review?: {
      id_review: number;
      rating: number;
      komentar: string;
      image_review?: string;
    };
    tagihan?: {
      total_harga: number;
      biaya_kirim: number;
      biaya_admin: number;
      total_tagihan: number;
      status_pembayaran: string;
      metode_pembayaran: string;
      midtrans_payment_type?: string;
      tanggal_pembayaran?: string;
      kode_tagihan?: string;
    };
    komplain?: {
      id_komplain: number;
      alasan_komplain: string;
      isi_komplain: string;
      bukti_komplain: string;
      status_komplain: string;
      created_at: string;
    };
  };
  onConfirmDelivery: () => void;
  onReportIssue: () => void;
  onPayNow?: () => void;
  onReview?: () => void;
  onComplete?: () => void;
  isConfirming?: boolean;
  isCompleting?: boolean;
}

export const PaymentSummary = ({
  order,
  onConfirmDelivery,
  onReportIssue,
  onPayNow,
  onReview,
  onComplete,
  isConfirming,
  isCompleting,
}: PaymentSummaryProps) => {
  const [isConfirmDeliveryOpen, setIsConfirmDeliveryOpen] = useState(false);
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);

  const canPayNow = () => {
    return (
      order.tagihan?.status_pembayaran === "Menunggu" &&
      order.status_pembelian === "Menunggu Pembayaran"
    );
  };

  const hasReview = !!order.review;

  // Modified showReviewButton to only check status
  const showReviewButton = () => {
    return order.status_pembelian === "Selesai";
  };

  const handleReviewClick = (e: React.MouseEvent) => {
    if (hasReview) return;
    onReview?.();
  };

  const handleDeliveryConfirm = () => {
    onConfirmDelivery(); // Call the confirmDelivery function from hooks
    setIsConfirmDeliveryOpen(false);
  };

  const handleComplete = () => {
    onComplete?.(); // Call the completePurchase function from hooks
    setIsCompleteDialogOpen(false);
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="p-1.5 rounded-lg bg-orange-50">
              <CreditCard className="h-4 w-4 text-[#F79E0E]" />
            </div>
            <span className="font-medium">Ringkasan Pembayaran</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal Produk</span>
              <span className="font-medium">
                {formatRupiah(order.tagihan?.total_harga || 0)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Biaya Pengiriman</span>
              <span className="font-medium">
                {formatRupiah(order.tagihan?.biaya_kirim || 0)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Biaya Admin</span>
              <span className="font-medium">
                {formatRupiah(order.tagihan?.biaya_admin || 0)}
              </span>
            </div>
            <Separator className="my-2 bg-orange-100" />
            <div className="flex justify-between">
              <span className="font-medium">Total</span>
              <span className="font-bold text-[#F79E0E]">
                {formatRupiah(order.tagihan?.total_tagihan || 0)}
              </span>
            </div>
          </div>

          {/* Payment information with updated styling */}
          <div className="mt-4 space-y-2 bg-orange-50/50 p-3 rounded-lg border border-orange-100">
            <div className="flex justify-between items-start text-sm">
              <span className="text-gray-600">Status Pembayaran</span>
              <span className="font-medium text-right">
                {order.tagihan?.status_pembayaran || "Tidak Tersedia"}
              </span>
            </div>

            {order.tagihan?.metode_pembayaran && (
              <div className="flex justify-between items-start">
                <span className="text-gray-500 text-sm">Metode Pembayaran</span>
                <span className="text-sm text-right">
                  {order.tagihan.metode_pembayaran === "midtrans"
                    ? `Midtrans${
                        order.tagihan.midtrans_payment_type
                          ? ` (${order.tagihan.midtrans_payment_type})`
                          : ""
                      }`
                    : order.tagihan.metode_pembayaran}
                </span>
              </div>
            )}

            {order.tagihan?.tanggal_pembayaran && (
              <div className="flex justify-between items-start">
                <span className="text-gray-500 text-sm">
                  Tanggal Pembayaran
                </span>
                <span className="text-sm text-right">
                  {formatDate(order.tagihan.tanggal_pembayaran)}
                </span>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 pt-6 border-t border-orange-100">
          {/* Action buttons with consistent styling */}
          {order.status_pembelian === "Menunggu Pembayaran" && canPayNow() && (
            <Button
              className="w-full bg-[#F79E0E] hover:bg-[#F79E0E]/90 text-white"
              onClick={onPayNow}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Bayar Sekarang
            </Button>
          )}

          {order.status_pembelian === "Dikirim" && (
            <Button
              variant="outline"
              className="w-full border-[#F79E0E] text-[#F79E0E] hover:bg-orange-50"
              onClick={() => setIsConfirmDeliveryOpen(true)}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Konfirmasi Penerimaan
            </Button>
          )}

          {order.status_pembelian === "Diterima" && (
            <div className="w-full space-y-3">
              {/* Only show Complete button if there's no complaint */}
              {!order.komplain && (
                <Button
                  className="w-full bg-[#F79E0E] hover:bg-[#F79E0E]/90 text-white"
                  onClick={() => setIsCompleteDialogOpen(true)}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Selesaikan Pesanan
                </Button>
              )}
              {/* Only show Report Issue button if there's no complaint yet */}
              {!order.komplain && (
                <Button
                  variant="outline"
                  className="w-full border-red-500 bg-red-500 text-white hover:bg-red-600"
                  onClick={onReportIssue}
                >
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Ajukan Komplain
                </Button>
              )}
            </div>
          )}

          {order.status_pembelian === "Selesai" && !order.review && (
            <Button
              variant="outline"
              className="w-full border-[#F79E0E] text-[#F79E0E] hover:bg-orange-50"
              onClick={onReview}
            >
              <Cigarette className="h-4 w-4 mr-2" />
              Beri Review
            </Button>
          )}

          <Button
            variant="outline"
            className="w-full border-[#F79E0E] text-[#F79E0E] hover:border-[#F79E0E] hover:text-[#F79E0E] hover:bg-orange-100"
            asChild
          >
            <Link href="/katalog">
              <Package className="h-4 w-4 mr-2" />
              Lanjut Belanja
            </Link>
          </Button>

          {order.status_pembelian !== "Menunggu Pembayaran" && (
            <Button
              variant="outline"
              className="w-full border-[#F79E0E] text-[#F79E0E] hover:border-[#F79E0E] hover:text-[#F79E0E] hover:bg-orange-100"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Invoice
            </Button>
          )}
        </CardFooter>
      </Card>

      <AlertDialog
        open={isConfirmDeliveryOpen}
        onOpenChange={setIsConfirmDeliveryOpen}
      >
        <AlertDialogContent className="max-w-[360px] p-0">
          <div className="p-6 pb-4 space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
            <AlertDialogHeader className="space-y-2 text-center">
              <AlertDialogTitle className="text-base">
                Konfirmasi Penerimaan
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-gray-600">
                Apakah Anda sudah menerima pesanan Anda?
              </AlertDialogDescription>
              <p className="text-sm font-medium text-[#F79E0E]">
                Tindakan ini tidak dapat dibatalkan.
              </p>
            </AlertDialogHeader>
          </div>

          <div className="p-4 border-t border-gray-100 bg-gray-50/50">
            <div className="grid grid-cols-2 gap-3">
              <AlertDialogCancel className="mt-0 h-9">Batal</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeliveryConfirm} // Use the handler that calls confirmDelivery
                disabled={isConfirming}
                className="h-9 bg-[#F79E0E] hover:bg-[#F79E0E]/90"
              >
                {isConfirming ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Proses...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>Ya, Terima</span>
                  </div>
                )}
              </AlertDialogAction>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Updated Confirmation Dialog for Completing Order */}
      <AlertDialog
        open={isCompleteDialogOpen}
        onOpenChange={setIsCompleteDialogOpen}
      >
        <AlertDialogContent className="max-w-[360px] p-0">
          <div className="p-6 pb-4 space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
            <AlertDialogHeader className="space-y-2 text-center">
              <AlertDialogTitle className="text-base">
                Selesaikan Pesanan
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-gray-600">
                Apakah barang yang Anda terima sudah sesuai dengan pesanan?
              </AlertDialogDescription>
              <p className="text-sm font-medium text-[#F79E0E]">
                Tindakan ini tidak dapat dibatalkan.
              </p>
            </AlertDialogHeader>
          </div>

          <div className="p-4 border-t border-gray-100 bg-gray-50/50">
            <div className="grid grid-cols-2 gap-3">
              <AlertDialogCancel className="mt-0 h-9">Batal</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleComplete}
                disabled={isCompleting}
                className="h-9 bg-[#F79E0E] hover:bg-[#F79E0E]/90"
              >
                {isCompleting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Proses...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>Ya, Sesuai</span>
                  </div>
                )}
              </AlertDialogAction>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
