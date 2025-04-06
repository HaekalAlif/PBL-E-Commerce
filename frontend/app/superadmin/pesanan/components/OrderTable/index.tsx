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
import { Order, OrderFilters } from "../../types";
import { formatRupiah } from "@/lib/formatter";
import { format } from "date-fns";

interface OrderTableProps {
  orders: Order[];
  loading: boolean;
  totalPages: number;
  totalOrders: number;
  filters: OrderFilters;
  updateFilters: (filters: Partial<OrderFilters>) => void;
  resetFilters: () => void;
  onViewDetails: (orderCode: string) => void;
}

export default function OrderTable({
  orders,
  loading,
  totalPages,
  totalOrders,
  filters,
  updateFilters,
  resetFilters,
  onViewDetails,
}: OrderTableProps) {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd MMM yyyy, HH:mm");
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Draft":
        return "bg-gray-200 text-gray-800";
      case "Menunggu Pembayaran":
        return "bg-yellow-100 text-yellow-800";
      case "Dibayar":
        return "bg-blue-100 text-blue-800";
      case "Diproses":
        return "bg-indigo-100 text-indigo-800";
      case "Dikirim":
        return "bg-purple-100 text-purple-800";
      case "Selesai":
        return "bg-green-100 text-green-800";
      case "Dibatalkan":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Menunggu":
        return "bg-yellow-100 text-yellow-800";
      case "Sukses":
        return "bg-green-100 text-green-800";
      case "Gagal":
        return "bg-red-100 text-red-800";
      case "Kadaluwarsa":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="mt-6 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  Loading orders...
                </div>
              </TableCell>
            </TableRow>
          ) : orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                <div className="text-muted-foreground">No orders found</div>
                <Button variant="link" onClick={resetFilters} className="mt-2">
                  Clear filters and try again
                </Button>
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow key={order.id_pembelian}>
                <TableCell className="font-medium">
                  {order.kode_pembelian}
                </TableCell>
                <TableCell>{order.pembeli.name}</TableCell>
                <TableCell>{formatDate(order.created_at)}</TableCell>
                <TableCell>
                  <div
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusBadgeColor(
                      order.status_pembelian
                    )}`}
                  >
                    {order.status_pembelian}
                  </div>
                </TableCell>
                <TableCell>
                  {order.tagihan ? (
                    <div
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getPaymentStatusBadgeColor(
                        order.tagihan.status_pembayaran
                      )}`}
                    >
                      {order.tagihan.status_pembayaran}
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-xs">
                      Not applicable
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {formatRupiah(order.calculated_total)}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={() => onViewDetails(order.kode_pembelian)}
                    title="View order details"
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
            {Math.min(filters.page! * filters.per_page!, totalOrders)} of{" "}
            {totalOrders} orders
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
