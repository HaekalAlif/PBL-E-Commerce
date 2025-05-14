import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
import { formatRupiah } from "@/lib/utils";
import {
  Eye,
  MoreVertical,
  Pencil,
  Trash2,
  Plus,
  Search,
  Filter,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ProductDeleteDialog } from "./ProductDeleteDialog";
import { Product, ProductTableProps } from "../types";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";

export const ProductTable = ({
  products,
  pagination, // Gunakan pagination dari props
  onPageChange,
  onDelete,
}: ProductTableProps) => {
  const router = useRouter();
  const [deletingProduct, setDeletingProduct] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const getPrimaryImageUrl = (product: Product) => {
    const primaryImage = product.gambar_barang?.find((img) => img.is_primary);
    if (primaryImage?.url_gambar) {
      // Check if URL is already absolute
      if (primaryImage.url_gambar.startsWith("http")) {
        return primaryImage.url_gambar;
      }
      // Add backend URL if needed
      return `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${primaryImage.url_gambar}`;
    }
    return "/placeholder-product.png";
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "Tersedia":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-600 border-green-200"
          >
            Tersedia
          </Badge>
        );
      case "Terjual":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-600 border-blue-200"
          >
            Terjual
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="bg-gray-50 text-gray-600 border-gray-200"
          >
            {status}
          </Badge>
        );
    }
  };

  const handleDelete = async () => {
    if (!deletingProduct) return;

    setIsDeleting(true);
    await onDelete(deletingProduct.id);
    setDeletingProduct(null);
    setIsDeleting(false);
  };

  // Add null check for products array
  if (!products || products.length === 0) {
    return (
      <Card className="border-orange-100">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Belum ada produk
          </h3>
          <p className="text-gray-500 mb-6">
            Mulai tambahkan produk ke toko Anda
          </p>
          <Button
            onClick={() => router.push("/toko/produk/tambah")}
            className="bg-[#F79E0E] hover:bg-[#E08D0D]"
          >
            Tambah Produk Pertama
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-orange-100">
      <CardContent>
        <div className="space-y-4">
          {/* Search and Filter Section */}
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cari produk..."
                className="pl-10 border-gray-200 focus:border-orange-200 focus:ring-orange-200"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" /> Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Status: Aktif</DropdownMenuItem>
                <DropdownMenuItem>Status: Tidak Aktif</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Kategori: Semua</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Products Table */}
          <div className="rounded-lg border border-gray-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produk</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Harga</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Stok</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id_barang}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-lg overflow-hidden bg-gray-50 border">
                          <img
                            src={getPrimaryImageUrl(product)}
                            alt={product.nama_barang}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "/placeholder-product.png";
                            }}
                          />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {product.nama_barang}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {product.kategori?.nama_kategori || "-"}
                    </TableCell>
                    <TableCell>{formatRupiah(product.harga)}</TableCell>
                    <TableCell>
                      {renderStatusBadge(product.status_barang)}
                    </TableCell>
                    <TableCell>{product.stok}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Aksi</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(`/toko/produk/${product.slug}`)
                            }
                          >
                            <Eye className="mr-2 h-4 w-4" /> Detail
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(`/toko/produk/edit/${product.slug}`)
                            }
                          >
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              setDeletingProduct({
                                id: product.id_barang,
                                name: product.nama_barang,
                              })
                            }
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {pagination.lastPage > 1 && (
            <Pagination className="mt-6">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      pagination.currentPage > 1 &&
                      onPageChange(pagination.currentPage - 1)
                    }
                    className={
                      pagination.currentPage <= 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {/* Generate page numbers */}
                {Array.from(
                  { length: pagination.lastPage },
                  (_, i) => i + 1
                ).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => onPageChange(page)}
                      isActive={page === pagination.currentPage}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      pagination.currentPage < pagination.lastPage &&
                      onPageChange(pagination.currentPage + 1)
                    }
                    className={
                      pagination.currentPage >= pagination.lastPage
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </CardContent>

      {/* Delete Dialog */}
      <ProductDeleteDialog
        open={!!deletingProduct}
        onClose={() => setDeletingProduct(null)}
        onConfirm={handleDelete}
        loading={isDeleting}
        productName={deletingProduct?.name || ""}
      />
    </Card>
  );
};
