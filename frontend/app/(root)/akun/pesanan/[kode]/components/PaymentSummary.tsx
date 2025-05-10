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
}

export const PaymentSummary = ({
  order,
  onConfirmDelivery,
  onReportIssue,
  onPayNow,
}: PaymentSummaryProps) => {
  const canPayNow = () => {
    return (
      order.tagihan?.status_pembayaran === "Menunggu" &&
      order.status_pembelian === "Menunggu Pembayaran"
    );
  };

  return (
    <Card className="border border-orange-100 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-[#F79E0E]" />
          Ringkasan Pembayaran
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-500">Subtotal</span>
            <span>{formatRupiah(order.tagihan?.total_harga || 0)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Biaya Pengiriman</span>
            <span>{formatRupiah(order.tagihan?.biaya_kirim || 0)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Biaya Admin</span>
            <span>{formatRupiah(order.tagihan?.biaya_admin || 0)}</span>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span className="text-[#F79E0E]">
              {formatRupiah(order.tagihan?.total_tagihan || 0)}
            </span>
          </div>
        </div>

        {/* Payment information */}
        <div className="mt-4 space-y-2 bg-gray-50 p-3 rounded-lg">
          <div className="flex justify-between items-start">
            <span className="text-gray-500 text-sm">Status Pembayaran</span>
            <span className="text-sm font-medium text-right">
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
        {order.status_pembelian === "Menunggu Pembayaran" && canPayNow() && (
          <Button
            variant="outline"
            className="w-full border-[#F79E0E] text-[#F79E0E] hover:border-[#F79E0E] hover:text-[#F79E0E] hover:bg-orange-100"
            onClick={onPayNow}
          >
            <FaMoneyBill className="h-4 w-4 mr-2" />
            Bayar Sekarang
          </Button>
        )}

        {order.status_pembelian === "Dikirim" && (
          <>
            <Button
              className="w-full border-[#F79E0E] text-[#F79E0E] hover:border-[#F79E0E] hover:text-[#F79E0E] hover:bg-orange-100"
              onClick={onConfirmDelivery}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Konfirmasi Penerimaan
            </Button>
            <Button
              variant="outline"
              className="w-full border-[#F79E0E] text-[#F79E0E] hover:border-[#F79E0E] hover:text-[#F79E0E] hover:bg-orange-100"
              onClick={onReportIssue}
            >
              <AlertCircle className="h-4 w-4 mr-2" />
              Laporkan Masalah
            </Button>
          </>
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
