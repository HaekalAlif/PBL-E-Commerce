import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Search,
  PackageSearch,
  RefreshCw,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "../types";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatRupiah } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  FaMagnifyingGlass,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa6";
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
import axios from "axios";
import { toast } from "react-toastify";
const ITEMS_PER_PAGE = 10;

interface ProductListProps {
  products: Product[];
  searchQuery: string;
  activeFilter: string;
  pagination: any;
  onSearch: (value: string) => void;
  onFilterChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onDelete: (id: number) => Promise<void>;
  refetchProducts: () => void;
}

export const ProductList = ({
  products,
  searchQuery,
  activeFilter,
  pagination,
  onSearch,
  onFilterChange,
  onPageChange,
  onDelete,
  refetchProducts,
}: ProductListProps) => {
  const router = useRouter();
  const [selectedProduct, setSelectedProduct] = useState<{
    id: number;
    name: string;
  } | null>(null);

  // Handle filtering locally
  const filteredProducts = products.filter((product) => {
    if (activeFilter !== "all" && product.status_barang !== activeFilter) {
      return false;
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        product.nama_barang.toLowerCase().includes(query) ||
        product.kategori?.nama_kategori.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "Tersedia":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-600 border-amber-200"
          >
            Tersedia
          </Badge>
        );
      case "Terjual":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-600 border-amber-200"
          >
            Terjual
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-600 border-amber-200"
          >
            {status}
          </Badge>
        );
    }
  };

  const handleDeleteClick = (product: {
    id_barang: number;
    nama_barang: string;
  }) => {
    setSelectedProduct({
      id: product.id_barang,
      name: product.nama_barang,
    });
  };

  const handleDeleteProduct = async () => {
    try {
      if (selectedProduct) {
        await onDelete(selectedProduct.id);
        toast.success("Produk berhasil dihapus");
        refetchProducts();
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Gagal menghapus produk");
    }
  };

  const EmptyState = ({
    message,
    isSearch,
  }: {
    message: string;
    isSearch?: boolean;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center py-12 text-center"
    >
      <div className="bg-amber-50 p-4 rounded-full mb-4">
        <PackageSearch className="w-12 h-12 text-amber-500" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Tidak ada produk
      </h3>
      <p className="text-gray-500 mb-6 max-w-sm">{message}</p>
      {isSearch && (
        <Button
          variant="outline"
          onClick={() => onSearch("")}
          className="gap-2 border-amber-500 text-amber-500 hover:bg-amber-50"
        >
          <RefreshCw className="w-4 h-4" />
          Reset Pencarian
        </Button>
      )}
    </motion.div>
  );

  const getPrimaryImageUrl = (product: Product) => {
    const primaryImage = product.gambar_barang?.find((img) => img.is_primary);
    if (primaryImage?.url_gambar) {
      if (primaryImage.url_gambar.startsWith("http")) {
        return primaryImage.url_gambar;
      }
      return `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${primaryImage.url_gambar}`;
    }
    return "/placeholder-product.png";
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-xl border border-amber-100 space-y-4">
        {/* Search and Actions */}
        <div className="flex gap-3 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-500" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Cari berdasarkan nama produk atau kategori..."
              className="pl-10 border-gray-200 focus:border-amber-500 focus:ring-amber-500"
            />
          </div>
          <Button
            variant="outline"
            onClick={refetchProducts}
            className="gap-2 border-amber-500 text-amber-500 hover:bg-amber-50"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        {/* Status Tabs - Updated styling */}
        <Tabs defaultValue={activeFilter} onValueChange={onFilterChange}>
          <TabsList className="bg-gray-50/80 p-1 border border-gray-100 rounded-lg">
            <TabsTrigger
              value="all"
              className="flex-1 data-[state=active]:bg-white data-[state=active]:text-amber-500 data-[state=active]:shadow-sm"
            >
              Semua Produk
            </TabsTrigger>
            <TabsTrigger
              value="Tersedia"
              className="flex-1 data-[state=active]:bg-white data-[state=active]:text-amber-500 data-[state=active]:shadow-sm"
            >
              Tersedia
            </TabsTrigger>
            <TabsTrigger
              value="Terjual"
              className="flex-1 data-[state=active]:bg-white data-[state=active]:text-amber-500 data-[state=active]:shadow-sm"
            >
              Terjual
            </TabsTrigger>
            <TabsTrigger
              value="Habis"
              className="flex-1 data-[state=active]:bg-white data-[state=active]:text-amber-500 data-[state=active]:shadow-sm"
            >
              Habis
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeFilter}>
            <AnimatePresence mode="wait">
              {filteredProducts.length === 0 ? (
                <EmptyState
                  message={
                    searchQuery
                      ? "Tidak dapat menemukan produk yang sesuai dengan pencarian"
                      : activeFilter === "all"
                      ? "Belum ada produk yang ditambahkan"
                      : `Tidak ada produk dengan status "${activeFilter}"`
                  }
                  isSearch={!!searchQuery}
                />
              ) : (
                <Card className="border-amber-100">
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Produk</TableHead>
                          <TableHead>Kategori</TableHead>
                          <TableHead className="text-center">Harga</TableHead>
                          <TableHead className="text-center">Status</TableHead>
                          <TableHead className="text-center">Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProducts.map((product, index) => (
                          <TableRow key={product.id}>
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
                              {product.kategori?.nama_kategori}
                            </TableCell>
                            <TableCell className="text-center">
                              {formatRupiah(product.harga)}
                            </TableCell>
                            <TableCell className="text-center">
                              {renderStatusBadge(product.status_barang)}
                            </TableCell>
                            <TableCell className="text-center">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className="h-8 w-8 p-0"
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() =>
                                      router.push(
                                        `/toko/produk/${product.slug}`
                                      )
                                    }
                                  >
                                    <FaMagnifyingGlass className="mr-2 h-4 w-4" />
                                    Detail
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      router.push(
                                        `/toko/produk/edit/${product.slug}`
                                      )
                                    }
                                  >
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <DropdownMenuItem
                                        onSelect={(e) => e.preventDefault()}
                                      >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Hapus
                                      </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>
                                          Konfirmasi Penghapusan
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Apakah Anda yakin ingin menghapus
                                          produk{" "}
                                          <span className="font-medium text-gray-900">
                                            {product.nama_barang}
                                          </span>
                                          ? Tindakan ini tidak dapat dibatalkan.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>
                                          Batal
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={(e) => {
                                            e.preventDefault();
                                            setSelectedProduct({
                                              id: product.id_barang,
                                              name: product.nama_barang,
                                            });
                                            handleDeleteProduct();
                                          }}
                                          className="bg-[#F79E0E] hover:bg-[#E08D0D] text-white"
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
                  </CardContent>
                </Card>
              )}
            </AnimatePresence>
          </TabsContent>
        </Tabs>
      </div>

      {/* Pagination */}
      {filteredProducts.length > 0 && (
        <div className="flex items-center justify-between mt-4 bg-white p-4 rounded-xl border border-amber-100">
          <div className="text-sm text-gray-600">
            Menampilkan {(pagination.currentPage - 1) * ITEMS_PER_PAGE + 1}{" "}
            sampai{" "}
            {Math.min(
              pagination.currentPage * ITEMS_PER_PAGE,
              pagination.total
            )}{" "}
            dari {pagination.total} produk
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="border-amber-200 hover:bg-amber-50"
            >
              <FaChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm font-medium">
              Halaman {pagination.currentPage} dari {pagination.lastPage || 1}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.lastPage}
              className="border-amber-200 hover:bg-amber-50"
            >
              <FaChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
