import { ProductList } from "./ProductList";
import { ProductHeader } from "./ProductHeader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Package } from "lucide-react";
import { Product } from "../types";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface ProductContentProps {
  products: Product[];
  error: string | null;
  searchQuery: string;
  activeFilter: string;
  pagination: {
    currentPage: number;
    lastPage: number;
    total: number;
  };
  onSearch: (value: string) => void;
  onFilterChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onDelete: (id: number) => Promise<void>;
  refetchProducts: () => void;
}

export const ProductContent = ({
  products,
  error,
  searchQuery,
  activeFilter,
  pagination,
  onSearch,
  onFilterChange,
  onPageChange,
  onDelete,
  refetchProducts,
}: ProductContentProps) => {
  const router = useRouter();

  if (error?.includes("belum memiliki toko")) {
    return (
      <div className="space-y-6">
        <ProductHeader />
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <Package className="w-12 h-12 text-orange-300 mb-4" />
          <h3 className="text-lg font-medium mb-2">Anda Belum Memiliki Toko</h3>
          <p className="text-gray-500 mb-6">
            Buat toko terlebih dahulu untuk mulai berjualan
          </p>
          <Button
            onClick={() => router.push("/toko/create")}
            className="bg-[#F79E0E] hover:bg-[#E08D0D]"
          >
            Buat Toko Sekarang
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProductHeader />
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <ProductList
        products={products}
        searchQuery={searchQuery}
        activeFilter={activeFilter}
        pagination={pagination}
        onSearch={onSearch}
        onFilterChange={onFilterChange}
        onPageChange={onPageChange}
        onDelete={onDelete}
        refetchProducts={refetchProducts}
      />
    </div>
  );
};
