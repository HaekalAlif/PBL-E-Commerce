import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertCircle, CheckCircle, Download } from "lucide-react";

interface OrderActionsProps {
  orderStatus: string;
  canPayNow: boolean;
  onPayNow: () => void;
  onConfirmDelivery: () => void;
  onReportIssue: () => void;
}

export const OrderActions = ({
  orderStatus,
  canPayNow,
  onPayNow,
  onConfirmDelivery,
  onReportIssue,
}: OrderActionsProps) => {
  return (
    <div className="flex flex-col gap-3">
      {orderStatus === "Menunggu Pembayaran" && canPayNow && (
        <Button
          onClick={onPayNow}
          className="w-full bg-[#F79E0E] hover:bg-[#E08D0D]"
        >
          Bayar Sekarang
        </Button>
      )}

      {orderStatus === "Dikirim" && (
        <>
          <Button
            className="w-full bg-[#F79E0E] hover:bg-[#E08D0D]"
            onClick={onConfirmDelivery}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Konfirmasi Penerimaan
          </Button>
          <Button
            variant="outline"
            className="w-full hover:bg-orange-50 hover:text-[#F79E0E]"
            onClick={onReportIssue}
          >
            <AlertCircle className="h-4 w-4 mr-2" />
            Laporkan Masalah
          </Button>
        </>
      )}

      <Button variant="outline" className="w-full" asChild>
        <Link href="/katalog">Lanjut Belanja</Link>
      </Button>

      {orderStatus !== "Menunggu Pembayaran" && (
        <Button variant="outline" className="w-full">
          <Download className="h-4 w-4 mr-2" />
          Download Invoice
        </Button>
      )}
    </div>
  );
};
