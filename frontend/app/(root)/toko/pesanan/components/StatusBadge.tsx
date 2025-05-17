import { Badge } from "@/components/ui/badge";
import { Clock, Package, TruckIcon, CheckCircle2, X } from "lucide-react";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  switch (status) {
    case "Draft":
      return (
        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
          <Clock className="w-3 h-3 mr-1" /> Draft
        </Badge>
      );
    case "Menunggu Pembayaran":
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
          <Clock className="w-3 h-3 mr-1" /> Waiting for Payment
        </Badge>
      );
    case "Dibayar":
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
          <Clock className="w-3 h-3 mr-1" /> New Order
        </Badge>
      );
    case "Diproses":
      return (
        <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
          <Package className="w-3 h-3 mr-1" /> Processing
        </Badge>
      );
    case "Dikirim":
      return (
        <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">
          <TruckIcon className="w-3 h-3 mr-1" /> Shipped
        </Badge>
      );
    case "Selesai":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
          <CheckCircle2 className="w-3 h-3 mr-1" /> Completed
        </Badge>
      );
    case "Dibatalkan":
      return (
        <Badge variant="secondary" className="bg-gray-200">
          <X className="w-3 h-3 mr-1" /> Canceled
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}
