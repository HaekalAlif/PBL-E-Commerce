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
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { PencairanFilterValues, PengajuanPencairan } from "../types";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { formatRupiah } from "@/lib/utils";

interface PencairanTableProps {
  pencairans: PengajuanPencairan[];
  loading: boolean;
  totalPages: number;
  totalPencairans: number;
  filters: PencairanFilterValues;
  updateFilters: (filters: Partial<PencairanFilterValues>) => void;
  onViewDetails: (id: number) => void;
  selectedIds: number[];
  onSelectionChange: (ids: number[]) => void;
}

export default function PencairanTable({
  pencairans,
  loading,
  totalPages,
  totalPencairans,
  filters,
  updateFilters,
  onViewDetails,
  selectedIds,
  onSelectionChange,
}: PencairanTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Menunggu":
        return "bg-yellow-100 text-yellow-800";
      case "Diproses":
        return "bg-blue-100 text-blue-800";
      case "Selesai":
        return "bg-green-100 text-green-800";
      case "Ditolak":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(pencairans.map((p) => p.id_pencairan));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectItem = (id: number, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedIds, id]);
    } else {
      onSelectionChange(selectedIds.filter((selectedId) => selectedId !== id));
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
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={
                    pencairans.length > 0 &&
                    pencairans.every((p) =>
                      selectedIds.includes(p.id_pencairan)
                    )
                  }
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Seller</TableHead>
              <TableHead>Bank Details</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead className="w-[100px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10">
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                    <span>Loading...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : pencairans.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10">
                  Tidak ada data pencairan
                </TableCell>
              </TableRow>
            ) : (
              pencairans.map((pencairan) => (
                <TableRow key={pencairan.id_pencairan}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(pencairan.id_pencairan)}
                      onCheckedChange={(checked) =>
                        handleSelectItem(
                          pencairan.id_pencairan,
                          checked as boolean
                        )
                      }
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    #{pencairan.id_pencairan}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {pencairan.user?.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        {pencairan.user?.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{pencairan.nama_bank}</span>
                      <span className="text-sm text-gray-500">
                        {pencairan.nomor_rekening}
                      </span>
                      <span className="text-sm text-gray-500">
                        {pencairan.nama_pemilik_rekening}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-[#F79E0E]">
                      {formatRupiah(pencairan.jumlah_dana)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={getStatusColor(pencairan.status_pencairan)}
                    >
                      {pencairan.status_pencairan}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(
                      new Date(pencairan.tanggal_pengajuan),
                      "dd MMM yyyy",
                      {
                        locale: id,
                      }
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0 hover:bg-gray-100"
                      onClick={() => onViewDetails(pencairan.id_pencairan)}
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
        totalItems={totalPencairans}
        itemsPerPage={filters.per_page || 10}
        showingText="pencairan"
      />
    </div>
  );
}
