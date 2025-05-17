import { useState, useEffect, useCallback } from "react";
import { Product } from "../types";
import axiosInstance, { getCsrfToken } from "@/lib/axios";
import { toast } from "sonner";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });

  const fetchProducts = useCallback(
    async (page: number = 1) => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/api/barang`, {
          params: { page },
        });
        if (response.data.status === "success") {
          setProducts(response.data.data.data);
          setPagination({
            currentPage: response.data.data.current_page,
            lastPage: response.data.data.last_page,
            total: response.data.data.total,
          });
        }
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || "Failed to load products";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setProducts, setPagination, setError]
  );

  // Fetch only once when component mounts
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Filter products locally
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

  const handlePageChange = (page: number) => {
    if (page === pagination.currentPage) return;
    fetchProducts(page);
  };

  const handleDelete = async (id: number) => {
    try {
      const token = await getCsrfToken();
      await axiosInstance.delete(`/api/barang/${id}`, {
        headers: {
          "X-XSRF-TOKEN": typeof token === "string" ? token : "",
        },
      });

      // Update local state instead of refetching
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id_barang !== id)
      );

      toast.success("Produk berhasil dihapus");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal menghapus produk");
      throw err; // Re-throw to handle in the component
    }
  };

  return {
    products: filteredProducts,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    pagination,
    handlePageChange,
    handleDelete,
    refetchProducts: fetchProducts,
  };
};
