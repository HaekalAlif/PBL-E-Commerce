"use client";

import {
  Eye,
  Pencil,
  Trash2,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Trash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Product, PRODUCT_STATUS, ITEMS_PER_PAGE } from "../../types";
import { formatRupiah } from "@/lib/utils";

interface ProductTableProps {
  products: Product[];
  totalProducts: number;
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  showDeleted: boolean;
  onPageChange: (page: number) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onRestore: (product: Product) => void;
  onView: (product: Product) => void;
  onPermanentDelete: (product: Product) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export default function ProductTable({
  products,
  totalProducts,
  currentPage,
  totalPages,
  isLoading,
  showDeleted,
  onPageChange,
  onEdit,
  onDelete,
  onRestore,
  onView,
  onPermanentDelete,
  onClearFilters,
  hasActiveFilters,
}: ProductTableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Product Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Shop</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length > 0 ? (
            products.map((product) => (
              <TableRow key={product.id_barang}>
                <TableCell>
                  {product.gambar_barang && product.gambar_barang[0] ? (
                      <div className="relative w-12 h-12 overflow-hidden rounded">
                      <img
                        src={product.gambar_barang[0].url_gambar}
                        alt={product.nama_barang}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/placeholder-product.png";
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs">
                      No image
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">
                  {product.nama_barang}
                </TableCell>
                <TableCell>{formatRupiah(product.harga)}</TableCell>
                <TableCell>{product.kategori?.nama_kategori || "-"}</TableCell>
                <TableCell>
                  <div
                    className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                      product.status_barang === "Tersedia"
                        ? "bg-green-100 text-green-800"
                        : product.status_barang === "Habis"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {PRODUCT_STATUS[
                      product.status_barang as keyof typeof PRODUCT_STATUS
                    ] || product.status_barang}
                  </div>
                </TableCell>
                <TableCell>{product.toko?.nama_toko || "-"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onView(product)}
                      title="View details"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                    {showDeleted ? (
                      <>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onRestore(product)}
                          title="Restore product"
                          className="text-green-600 border-green-600"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => onPermanentDelete(product)}
                          title="Delete permanently"
                        >
                          <Trash
                            className="h-4 w-4 text-white"
                            strokeWidth={2}
                          />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onEdit(product)}
                          title="Edit product"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => onDelete(product)}
                          title="Delete product"
                        >
                          <Trash2
                            className="h-4 w-4 text-white"
                            strokeWidth={2}
                          />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                {hasActiveFilters ? (
                  <>
                    No products found matching your search criteria.
                    <Button variant="link" onClick={onClearFilters}>
                      Clear filters
                    </Button>
                  </>
                ) : showDeleted ? (
                  "No deleted products found."
                ) : (
                  "No active products found."
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      {products.length > 0 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
            {Math.min(currentPage * ITEMS_PER_PAGE, totalProducts)} of{" "}
            {totalProducts} {showDeleted ? "deleted" : "active"} products
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous Page</span>
            </Button>
            <div className="text-sm">
              Page {currentPage} of {totalPages || 1}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next Page</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
