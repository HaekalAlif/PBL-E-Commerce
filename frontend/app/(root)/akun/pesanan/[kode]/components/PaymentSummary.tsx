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
  };
  onConfirmDelivery: () => void;
  onReportIssue: () => void;
  onPayNow?: () => void;
  onReview?: () => void;
}

export const PaymentSummary = ({
  order,
  onConfirmDelivery,
  onReportIssue,
  onPayNow,
  onReview,
}: PaymentSummaryProps) => {
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

  return (
    <Card className="border-orange-100">
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
              <span className="text-gray-500 text-sm">Tanggal Pembayaran</span>
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
          <>
            <Button
              variant="outline"
              className="w-full border-[#F79E0E] text-[#F79E0E] hover:border-[#F79E0E] hover:text-[#F79E0E] hover:bg-orange-1200"
              onClick={onConfirmDelivery}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Konfirmasi Penerimaan
            </Button>
            <Button
              variant="outline"
              className="w-full border-[#F79E0E] bg-red-500 text-white hover:border-[#F79E0E] hover:text-white hover:bg-red-800"
              onClick={onReportIssue}
            >
              <AlertCircle className="h-4 w-4 mr-2" />
              Laporkan Masalah
            </Button>
          </>
        )}

        {showReviewButton() && (
          <div className="w-full space-y-1.5">
            <Button
              variant="outline"
              className={`w-full ${
                hasReview
                  ? "border-gray-200 bg-gray-50 cursor-not-allowed"
                  : "border-[#F79E0E] text-[#F79E0E] hover:border-[#F79E0E] hover:text-[#F79E0E] hover:bg-orange-100"
              }`}
              onClick={handleReviewClick}
              disabled={hasReview}
            >
              {hasReview ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  <span className="text-gray-500">Sudah Direview</span>
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Beri Review
                </>
              )}
            </Button>
            {hasReview && (
              <p className="text-xs text-center text-gray-500">
                Anda telah memberikan penilaian untuk pesanan ini
              </p>
            )}
          </div>
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
  );
};
