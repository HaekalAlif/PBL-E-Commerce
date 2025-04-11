import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { PaymentWithOrder, PaymentFilters } from "../../types";
import { formatRupiah } from "@/lib/formatter";
import { format } from "date-fns";

interface PaymentTableProps {
  payments: PaymentWithOrder[];
  loading: boolean;
  totalPages: number;
  totalPayments: number;
  filters: PaymentFilters;
  updateFilters: (filters: Partial<PaymentFilters>) => void;
  resetFilters: () => void;
  onViewDetails: (paymentCode: string) => void;
}

export default function PaymentTable({
  payments,
  loading,
  totalPages,
  totalPayments,
  filters,
  updateFilters,
  resetFilters,
  onViewDetails,
}: PaymentTableProps) {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd MMM yyyy, HH:mm");
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Menunggu":
        return "bg-yellow-100 text-yellow-800";
      case "Dibayar":
        return "bg-green-100 text-green-800";
      case "Expired":
        return "bg-gray-100 text-gray-800";
      case "Gagal":
        return "bg-red-100 text-red-800";
      case "Refund":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="mt-6 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice ID</TableHead>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  Loading payments...
                </div>
              </TableCell>
            </TableRow>
          ) : payments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
                <div className="text-muted-foreground">No payments found</div>
                <Button variant="link" onClick={resetFilters} className="mt-2">
                  Clear filters and try again
                </Button>
              </TableCell>
            </TableRow>
          ) : (
            payments.map((payment) => (
              <TableRow key={payment.id_tagihan}>
                <TableCell className="font-medium">
                  {payment.kode_tagihan}
                </TableCell>
                <TableCell>
                  {payment.pembelian ? payment.pembelian.kode_pembelian : "N/A"}
                </TableCell>
                <TableCell>
                  {payment.pembelian?.pembeli?.name || "Unknown"}
                </TableCell>
                <TableCell>{formatDate(payment.created_at)}</TableCell>
                <TableCell>
                  {payment.metode_pembayaran || "Not specified"}
                </TableCell>
                <TableCell>
                  <div
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusBadgeColor(
                      payment.status_pembayaran
                    )}`}
                  >
                    {payment.status_pembayaran}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {formatRupiah(payment.total_tagihan || 0)}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={() => onViewDetails(payment.kode_tagihan)}
                    title="View payment details"
                  >
                    <span className="sr-only">View details</span>
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Showing {(filters.page! - 1) * filters.per_page! + 1} to{" "}
            {Math.min(filters.page! * filters.per_page!, totalPayments)} of{" "}
            {totalPayments} payments
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    updateFilters({ page: Math.max(1, filters.page! - 1) })
                  }
                  className={
                    filters.page === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>

              {/* First page */}
              {filters.page! > 2 && (
                <PaginationItem>
                  <PaginationLink onClick={() => updateFilters({ page: 1 })}>
                    1
                  </PaginationLink>
                </PaginationItem>
              )}

              {/* Ellipsis if needed */}
              {filters.page! > 3 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {/* Previous page if not at start */}
              {filters.page! > 1 && (
                <PaginationItem>
                  <PaginationLink
                    onClick={() => updateFilters({ page: filters.page! - 1 })}
                  >
                    {filters.page! - 1}
                  </PaginationLink>
                </PaginationItem>
              )}

              {/* Current page */}
              <PaginationItem>
                <PaginationLink isActive>{filters.page}</PaginationLink>
              </PaginationItem>

              {/* Next page if not at end */}
              {filters.page! < totalPages && (
                <PaginationItem>
                  <PaginationLink
                    onClick={() => updateFilters({ page: filters.page! + 1 })}
                  >
                    {filters.page! + 1}
                  </PaginationLink>
                </PaginationItem>
              )}

              {/* Ellipsis if needed */}
              {filters.page! < totalPages - 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {/* Last page if not current */}
              {filters.page! < totalPages - 1 && (
                <PaginationItem>
                  <PaginationLink
                    onClick={() => updateFilters({ page: totalPages })}
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    updateFilters({
                      page: Math.min(totalPages, filters.page! + 1),
                    })
                  }
                  className={
                    filters.page === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
