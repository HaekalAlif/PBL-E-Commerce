import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  CircleCheck,
  Ban,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const getStatusIcon = (status: string) => {
  switch (status) {
    case "Draft":
      return <Package className="h-5 w-5 text-gray-500" />;
    case "Menunggu Pembayaran":
      return <Clock className="h-5 w-5 text-yellow-600" />;
    case "Dibayar":
      return <CheckCircle className="h-5 w-5 text-blue-600" />;
    case "Diproses":
      return <Package className="h-5 w-5 text-[#F79E0E]" />;
    case "Dikirim":
      return <Truck className="h-5 w-5 text-[#F79E0E]" />;
    case "Selesai":
      return <CircleCheck className="h-5 w-5 text-green-600" />;
    case "Dibatalkan":
      return <Ban className="h-5 w-5 text-red-500" />;
    default:
      return <Package className="h-5 w-5 text-gray-600" />;
  }
};

export const getStatusBadge = (status: string) => {
  switch (status) {
    case "Menunggu Pembayaran":
      return (
        <Badge
          variant="outline"
          className="bg-yellow-50 text-yellow-700 border-yellow-200"
        >
          Belum Dibayar
        </Badge>
      );
    case "Dibayar":
      return (
        <Badge className="bg-blue-50 text-blue-700 border-blue-200">
          Sudah Dibayar
        </Badge>
      );
    case "Diproses":
      return (
        <Badge className="bg-orange-50 text-[#F79E0E] border-orange-200">
          Diproses
        </Badge>
      );
    case "Dikirim":
      return (
        <Badge className="bg-orange-50 text-[#F79E0E] border-orange-200">
          Dikirim
        </Badge>
      );
    case "Selesai":
      return (
        <Badge className="bg-green-50 text-green-700 border-green-200">
          Selesai
        </Badge>
      );
    case "Dibatalkan":
      return (
        <Badge
          variant="secondary"
          className="bg-red-50 text-red-700 border-red-200"
        >
          Dibatalkan
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};
