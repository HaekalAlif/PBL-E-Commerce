import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CircleDot,
  Eye,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { KomplainFilterValues, Komplain } from "../types";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface KomplainTableProps {
  komplains: Komplain[];
  loading: boolean;
  totalPages: number;
  totalKomplains: number;
  filters: KomplainFilterValues;
  updateFilters: (filters: Partial<KomplainFilterValues>) => void;
  onViewDetails: (id: number) => void;
}

export default function KomplainTable({
  komplains,
  loading,
  totalPages,
  totalKomplains,
  filters,
  updateFilters,
  onViewDetails,
}: KomplainTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Menunggu":
        return "bg-yellow-100 text-yellow-800";
      case "Diproses":
        return "bg-blue-100 text-blue-800";
      case "Selesai":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Internal PaginationSection component
  function PaginationSection({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange,
    showingText = "item",
  }: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    showingText?: string;
  }) {
    const startItem = Math.min(
      (currentPage - 1) * itemsPerPage + 1,
      totalItems
    );
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-600">
          Menampilkan {startItem}-{endItem} dari {totalItems} {showingText}
        </p>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="h-8 w-8"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (page) =>
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
              )
              .map((page, index, array) => {
                const showEllipsis = index > 0 && page - array[index - 1] > 1;

                return (
                  <div key={page} className="flex items-center">
                    {showEllipsis && (
                      <span className="px-2 text-gray-400">...</span>
                    )}
                    <Button
                      variant={currentPage === page ? "default" : "outline"}
                      onClick={() => onPageChange(page)}
                      className={`h-8 w-8 ${
                        currentPage === page
                          ? "bg-[#F79E0E] hover:bg-[#F79E0E]/90"
                          : ""
                      }`}
                    >
                      {page}
                    </Button>
                  </div>
                );
              })}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="h-8 w-8"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Alasan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Retur</TableHead> {/* New column */}
              <TableHead className="w-[100px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                    <span>Loading...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : komplains.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  Tidak ada data komplain
                </TableCell>
              </TableRow>
            ) : (
              komplains.map((komplain) => (
                <TableRow key={komplain.id_komplain}>
                  <TableCell className="font-medium">
                    #{komplain.id_komplain}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{komplain.user?.name}</span>
                      <span className="text-sm text-gray-500">
                        {komplain.user?.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{komplain.alasan_komplain}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(komplain.status_komplain)}>
                      {komplain.status_komplain}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(komplain.created_at), "dd MMM yyyy", {
                      locale: id,
                    })}
                  </TableCell>
                  <TableCell>
                    {komplain.retur ? "Ya" : "Tidak"} {/* New column value */}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0 hover:bg-gray-100"
                      onClick={() => onViewDetails(komplain.id_komplain)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <PaginationSection
        currentPage={filters.page || 1}
        totalPages={totalPages}
        onPageChange={(page: any) => updateFilters({ page })}
        totalItems={totalKomplains}
        itemsPerPage={filters.per_page || 10}
        showingText="komplain"
      />
    </div>
  );
}
