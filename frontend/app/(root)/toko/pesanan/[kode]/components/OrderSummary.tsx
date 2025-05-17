import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FileText, Receipt } from "lucide-react";
import { formatRupiah, formatDate } from "@/lib/utils";
import { StatusBadge } from "../../components/StatusBadge";

interface OrderSummaryProps {
  kode_pembelian: string;
  created_at: string;
  status_pembelian: string;
  total: number;
  catatan_pembeli?: string;
}

export function OrderSummary({
  kode_pembelian,
  created_at,
  status_pembelian,
  total,
  catatan_pembeli,
}: OrderSummaryProps) {
  return (
    <Card className="border-orange-100">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-gray-800">
          <Receipt className="mr-2 h-5 w-5 text-[#F79E0E]" />
          Ringkasan Pesanan
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Nomor Pesanan</span>
            <span className="text-sm text-gray-900">{kode_pembelian}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Tanggal</span>
            <span className="text-sm text-gray-900">
              {formatDate(created_at)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Status</span>
            <StatusBadge status={status_pembelian} />
          </div>

          <Separator className="my-3 bg-orange-100" />

          <div className="flex justify-between items-center pt-1">
            <span className="font-medium text-gray-900">Total Pesanan</span>
            <span className="text-lg font-bold text-[#F79E0E]">
              {formatRupiah(total)}
            </span>
          </div>
        </div>

        {catatan_pembeli && (
          <div className="mt-4 bg-orange-50/50 rounded-lg p-4 border border-orange-100">
            <p className="text-sm font-medium text-gray-900 mb-1">
              Catatan Pembeli:
            </p>
            <p className="text-sm text-gray-600">{catatan_pembeli}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
