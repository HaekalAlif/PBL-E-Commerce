"use client";

import { Pencil, Trash2, ChevronLeft, ChevronRight, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Kategori, ITEMS_PER_PAGE } from "../../types";

interface KategoriTableProps {
  kategori: Kategori[];
  totalKategori: number;
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onEdit: (kategori: Kategori) => void;
  onDelete: (kategori: Kategori) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export default function KategoriTable({
  kategori,
  totalKategori,
  currentPage,
  totalPages,
  isLoading,
  onPageChange,
  onEdit,
  onDelete,
  onClearFilters,
  hasActiveFilters,
}: KategoriTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Logo</TableHead>
            <TableHead>Category Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {kategori.length > 0 ? (
            kategori.map((item) => (
              <TableRow key={item.id_kategori}>
                <TableCell>
                  {item.logo ? (
                    <div className="relative w-12 h-12 overflow-hidden rounded">
                      <img
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${item.logo}`}
                        alt={item.nama_kategori}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/placeholder-category.png";
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                      <Tag className="h-5 w-5 text-gray-500" />
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">
                  {item.nama_kategori}
                </TableCell>
                <TableCell>{item.slug}</TableCell>
                <TableCell>
                  <div
                    className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                      item.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {item.is_active ? "Active" : "Inactive"}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onEdit(item)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => onDelete(item)}
                    >
                      <Trash2 className="h-4 w-4 text-white" strokeWidth={2} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8">
                {hasActiveFilters ? (
                  <>
                    Tidak ada kategori yang sesuai dengan kriteria pencarian
                    Anda.
                    <Button variant="link" onClick={onClearFilters}>
                      Hapus filter
                    </Button>
                  </>
                ) : (
                  "Belum ada kategori. Tambahkan kategori baru untuk memulai."
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      {kategori.length > 0 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Menampilkan {(currentPage - 1) * ITEMS_PER_PAGE + 1} sampai{" "}
            {Math.min(currentPage * ITEMS_PER_PAGE, totalKategori)} dari{" "}
            {totalKategori} kategori
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Halaman Sebelumnya</span>
            </Button>
            <div className="text-sm">
              Halaman {currentPage} dari {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Halaman Berikutnya</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
