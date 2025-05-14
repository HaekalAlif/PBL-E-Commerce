import { useState, useEffect } from "react";
import { Product } from "../types";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });

  const fetchProducts = async (page = pagination.currentPage) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/api/barang?page=${page}`);

      if (response.data.status === "success") {
        console.log("Products:", response.data.data.data);
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
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
    fetchProducts(page);
  };

  const handleDelete = async (id: number) => {
    try {
      await axiosInstance.delete(`/api/barang/${id}`);
      toast.success("Product deleted successfully");
      fetchProducts(pagination.currentPage);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete product");
    }
  };

  return {
    products,
    loading,
    error,
    pagination,
    handlePageChange,
    handleDelete,
  };
};
