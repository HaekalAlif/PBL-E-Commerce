import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Clock,
  Ban,
  Package,
  Truck,
  CircleCheck,
} from "lucide-react";
import { JSX, createElement } from "react";

// Function to get status badge UI component based on status
export function getStatusBadge(status: string): JSX.Element {
  switch (status) {
    case "Dibayar":
      return createElement(Badge, {
        className: "bg-blue-100 text-blue-800 hover:bg-blue-200",
        children: "Paid",
      });
    case "Diproses":
      return createElement(Badge, {
        className: "bg-purple-100 text-purple-800 hover:bg-purple-200",
        children: "Processing",
      });
    case "Dikirim":
      return createElement(Badge, {
        className: "bg-orange-100 text-orange-800 hover:bg-orange-200",
        children: "Shipped",
      });
    case "Diterima":
      return createElement(Badge, {
        className: "bg-teal-100 text-teal-800 hover:bg-teal-200",
        children: "Delivered",
      });
    case "Selesai":
      return createElement(Badge, {
        className: "bg-green-100 text-green-800 hover:bg-green-200",
        children: "Completed",
      });
    case "Dibatalkan":
      return createElement(Badge, {
        variant: "secondary",
        className: "bg-gray-200",
        children: "Cancelled",
      });
    case "Menunggu Pembayaran":
      return createElement(Badge, {
        variant: "outline",
        className: "border-yellow-500 text-yellow-600",
        children: "Awaiting Payment",
      });
    default:
      return createElement(Badge, {
        variant: "secondary",
        children: status,
      });
  }
}

// Function to get appropriate icon component based on status
export function getStatusIcon(status: string): JSX.Element {
  switch (status) {
    case "Dibayar":
      return createElement(CheckCircle, {
        className: "h-5 w-5 text-blue-600",
      });
    case "Diproses":
      return createElement(Package, {
        className: "h-5 w-5 text-purple-600",
      });
    case "Dikirim":
      return createElement(Truck, {
        className: "h-5 w-5 text-orange-600",
      });
    case "Diterima":
      return createElement(CircleCheck, {
        className: "h-5 w-5 text-teal-600",
      });
    case "Selesai":
      return createElement(CircleCheck, {
        className: "h-5 w-5 text-green-600",
      });
    case "Dibatalkan":
      return createElement(Ban, {
        className: "h-5 w-5 text-gray-500",
      });
    case "Menunggu Pembayaran":
      return createElement(Clock, {
        className: "h-5 w-5 text-yellow-600",
      });
    default:
      return createElement(Package, {
        className: "h-5 w-5 text-gray-600",
      });
  }
}

// Calculate order tracking step number from status
export function getOrderTrackingStep(status: string): number {
  switch (status) {
    case "Menunggu Pembayaran":
      return 0; // Order Placed
    case "Dibayar":
      return 1; // Payment Confirmed
    case "Diproses":
      return 2; // Processing
    case "Dikirim":
      return 3; // Shipped
    case "Diterima":
      return 4; // Delivered
    case "Selesai":
      return 5; // Completed
    case "Dibatalkan":
      return -1; // Special case for canceled orders
    default:
      return 0;
  }
}

// Format a date string for display
export function formatDate(dateString: string) {
  if (!dateString) return "N/A";

  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Check if payment is needed for an order
export function canPayNow(order: any): boolean {
  if (!order) return false;

  // Check if tagihan exists and has "Menunggu" status
  if (
    order.tagihan?.status_pembayaran === "Menunggu" &&
    order.status_pembelian === "Menunggu Pembayaran"
  ) {
    return true;
  }

  // Fallback check based on order status alone if tagihan data is incomplete
  if (order.status_pembelian === "Menunggu Pembayaran" && !order.tagihan) {
    return true;
  }

  return false;
}
