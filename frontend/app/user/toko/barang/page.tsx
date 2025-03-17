"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";
import { toast } from "sonner";
import Link from "next/link";

// UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Package,
  PlusCircle,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Search,
  AlertCircle,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Define interfaces for our data
interface Barang {
  id_barang: number;
  nama_barang: string;
  slug: string;
  harga: number;
  status_barang: string;
  stok: number;
  is_deleted: boolean;
  created_at: string;
  // Update to use snake_case to match API response
  gambar_barang: GambarBarang[];
  kategori: {
    id_kategori: number;
    nama_kategori: string;
  };
}

interface GambarBarang {
  id_gambar: number;
  url_gambar: string;
  is_primary: boolean;
}

interface PaginatedResponse {
  current_page: number;
  data: Barang[];
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
}

export default function BarangListPage() {
  const router = useRouter();
  const [barangList, setBarangList] = useState<Barang[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });

  // Fetch the product list on component mount
  useEffect(() => {
    fetchBarang();
  }, [pagination.currentPage]);

  const fetchBarang = async (page = pagination.currentPage) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `/api/barang?page=${page}${searchTerm ? `&search=${searchTerm}` : ""}`
      );

      if (response.data.status === "success") {
        const paginatedData = response.data.data as PaginatedResponse;
        setBarangList(paginatedData.data);
        setPagination({
          currentPage: paginatedData.current_page,
          lastPage: paginatedData.last_page,
          total: paginatedData.total,
        });
      } else {
        setError("Gagal memuat data barang");
      }
    } catch (error: any) {
      console.error("Error fetching barang:", error);
      if (error.response?.status === 404) {
        setError(
          "Anda belum memiliki toko. Silakan buat toko terlebih dahulu."
        );
      } else {
        setError(
          error.response?.data?.message || "Terjadi kesalahan saat memuat data"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBarang(1); // Reset to first page when searching
  };

  const handleDeleteBarang = async (id: number) => {
    try {
      await axios.delete(`/api/barang/${id}`);
      toast.success("Produk berhasil dihapus");
      fetchBarang(); // Refresh the list
    } catch (error: any) {
      console.error("Error deleting barang:", error);
      toast.error(error.response?.data?.message || "Gagal menghapus produk");
    }
  };

  // Get primary image URL for a product or use a placeholder
  const getPrimaryImageUrl = (barang: Barang): string => {
    // Look for image with is_primary = true in the gambar_barang array (snake_case)
    const primaryImage = barang.gambar_barang?.find((img) => img.is_primary);
    // Return the url_gambar from the primary image or a placeholder
    return primaryImage?.url_gambar || "/placeholder-product.png";
  };

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Render status badge with appropriate color
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "Tersedia":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Tersedia
          </Badge>
        );
      case "Terjual":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            Terjual
          </Badge>
        );
      case "Habis":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            Habis
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Render loading skeletons when fetching data
  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Package className="h-6 w-6" />
            <h1 className="text-3xl font-bold">Daftar Produk</h1>
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-72" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center gap-4">
                  <Skeleton className="h-16 w-16 rounded-md" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render navigation guidance if the user doesn't have a store yet
  if (error?.includes("belum memiliki toko")) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center gap-3 mb-6">
          <Package className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Daftar Produk</h1>
        </div>

        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Toko Belum Ada</AlertTitle>
          <AlertDescription>
            Anda belum memiliki toko. Silakan buat toko terlebih dahulu untuk
            dapat menambahkan produk.
          </AlertDescription>
        </Alert>

        <Button onClick={() => router.push("/user/toko/create")}>
          Buat Toko Sekarang
        </Button>
      </div>
    );
  }

  // Render error message if any other error occurs
  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center gap-3 mb-6">
          <Package className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Daftar Produk</h1>
        </div>

        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>

        <Button onClick={() => fetchBarang()}>Coba Lagi</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      {/* Header with title and create button */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Package className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Daftar Produk</h1>
        </div>
        <Button
          onClick={() => router.push("/user/toko/barang/create")}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Tambah Produk
        </Button>
      </div>

      {/* Main content card */}
      <Card>
        <CardHeader>
          <CardTitle>Produk Toko Anda</CardTitle>
          <CardDescription>
            Kelola produk yang Anda jual di toko Anda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Display message if no products */}
          {barangList.length === 0 ? (
            <div className="text-center py-10 border rounded-md">
              <Package className="h-10 w-10 mx-auto text-gray-400 mb-2" />
              <p className="text-lg font-medium">Belum ada produk</p>
              <p className="text-gray-500 mb-4">
                Mulai tambahkan produk ke toko Anda
              </p>
              <Button onClick={() => router.push("/user/toko/barang/create")}>
                Tambah Produk Pertama
              </Button>
            </div>
          ) : (
            <>
              {/* Products table */}
              <div className="border rounded-md overflow-hidden">
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
                    {barangList.map((barang) => (
                      <TableRow key={barang.id_barang}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <img
                              src={getPrimaryImageUrl(barang)}
                              alt={barang.nama_barang}
                              className="w-12 h-12 rounded-md object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "/placeholder-product.png";
                              }}
                            />
                            <div>
                              <p className="font-medium line-clamp-1">
                                {barang.nama_barang}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(barang.created_at).toLocaleDateString(
                                  "id-ID"
                                )}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {barang.kategori?.nama_kategori || "-"}
                        </TableCell>
                        <TableCell>{formatCurrency(barang.harga)}</TableCell>
                        <TableCell>
                          {renderStatusBadge(barang.status_barang)}
                        </TableCell>
                        <TableCell>{barang.stok}</TableCell>
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
                                  router.push(
                                    `/user/toko/barang/detail/${barang.slug}`
                                  )
                                }
                              >
                                <Eye className="mr-2 h-4 w-4" /> Detail
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  router.push(
                                    `/user/toko/barang/edit/${barang.slug}`
                                  )
                                }
                              >
                                <Edit className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem
                                    onSelect={(e) => e.preventDefault()}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" /> Hapus
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Konfirmasi Penghapusan
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Apakah Anda yakin ingin menghapus produk "
                                      {barang.nama_barang}"? Tindakan ini tidak
                                      dapat dibatalkan.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Batal</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        handleDeleteBarang(barang.id_barang)
                                      }
                                      className="bg-red-600 text-white hover:bg-red-700"
                                    >
                                      Hapus
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
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
                          handlePageChange(pagination.currentPage - 1)
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
                          onClick={() => handlePageChange(page)}
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
                          handlePageChange(pagination.currentPage + 1)
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
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
