"use client";

import { useState, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import { getCsrfTokenFromCookie, getCsrfToken } from "@/lib/axios";
import { Product, ProductFormData } from "../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const useProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<any[]>([]);

  // Fetch all products
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Fetching products from:", `${API_URL}/admin/barang`);

      const response = await axios.get(`${API_URL}/admin/barang`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        withCredentials: true,
      });

      console.log("API Response:", response.data);

      if (response.data.status === "success") {
        setProducts(
          Array.isArray(response.data.data) ? response.data.data : []
        );
      } else {
        toast.error(response.data.message || "Failed to fetch products");
        setProducts([]);
      }
    } catch (error: any) {
      console.error("Error fetching products:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to load products. Please try again later."
      );
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch product categories
  const fetchCategories = useCallback(async () => {
    try {
      console.log(
        "Fetching categories from:",
        `${API_URL}/admin/barang/categories`
      );

      const response = await axios.get(`${API_URL}/admin/barang/categories`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        withCredentials: true,
      });

      console.log("Categories API Response:", response.data);

      if (response.data.status === "success") {
        setCategories(response.data.data || []);
        return response.data.data;
      } else {
        toast.error(response.data.message || "Failed to fetch categories");
        return [];
      }
    } catch (error: any) {
      console.error("Error fetching categories:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to load categories. Please try again later."
      );
      return [];
    }
  }, []);

  // Get product details
  const getProductDetails = useCallback(async (id: number) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/admin/barang/${id}`, {
        withCredentials: true,
      });

      if (response.data && response.data.data) {
        // Ensure gambar_barang is always an array
        const product = response.data.data;
        product.gambar_barang = product.gambar_barang || [];

        setSelectedProduct(product);
        return product;
      }

      if (response.data.status === "success") {
        return response.data.data;
      } else {
        toast.error(response.data.message || "Failed to fetch product details");
        return null;
      }
    } catch (error: any) {
      console.error("Error fetching product details:", error);
      toast.error("Failed to load product details. Please try again later.");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update product
  const updateProduct = useCallback(
    async (id: number, formData: ProductFormData) => {
      try {
        const csrfToken = getCsrfTokenFromCookie();
        console.log("Updating product:", id, formData);

        if (!csrfToken) {
          await getCsrfToken();
        }

        const response = await axios.put(
          `${API_URL}/admin/barang/${id}`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "X-XSRF-TOKEN": decodeURIComponent(csrfToken || ""),
            },
            withCredentials: true,
          }
        );

        console.log("Update product response:", response.data);

        if (response.data.status === "success") {
          toast.success("Product updated successfully!");
          await fetchProducts();
          return true;
        } else {
          toast.error(response.data.message || "Failed to update product");
          return false;
        }
      } catch (error: any) {
        console.error("Error updating product:", error);
        toast.error(
          error.response?.data?.message ||
            "Failed to update product. Please try again."
        );
        return false;
      }
    },
    [fetchProducts]
  );

  // Soft delete product
  const softDeleteProduct = useCallback(
    async (id: number) => {
      try {
        console.log("Soft deleting product:", id);

        // Get CSRF token
        const csrfToken = getCsrfTokenFromCookie();
        if (!csrfToken) {
          await getCsrfToken();
        }

        const response = await axios.put(
          `${API_URL}/admin/barang/${id}/soft-delete`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "X-XSRF-TOKEN": decodeURIComponent(csrfToken || ""),
            },
            withCredentials: true,
          }
        );

        console.log("Soft delete response:", response.data);

        if (response.data.status === "success") {
          toast.success("Product deleted successfully!");
          await fetchProducts();
          return true;
        } else {
          toast.error(response.data.message || "Failed to delete product");
          return false;
        }
      } catch (error: any) {
        console.error("Error soft deleting product:", error);
        toast.error("Failed to delete product. Please try again.");
        return false;
      }
    },
    [fetchProducts]
  );

  // Restore deleted product
  const restoreProduct = useCallback(
    async (id: number) => {
      try {
        console.log("Restoring product:", id);

        // Get CSRF token
        const csrfToken = getCsrfTokenFromCookie();
        if (!csrfToken) {
          await getCsrfToken();
        }

        const response = await axios.put(
          `${API_URL}/admin/barang/${id}/restore`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "X-XSRF-TOKEN": decodeURIComponent(csrfToken || ""),
            },
            withCredentials: true,
          }
        );

        console.log("Restore product response:", response.data);

        if (response.data.status === "success") {
          toast.success("Product restored successfully!");
          await fetchProducts();
          return true;
        } else {
          toast.error(response.data.message || "Failed to restore product");
          return false;
        }
      } catch (error: any) {
        console.error("Error restoring product:", error);
        toast.error("Failed to restore product. Please try again.");
        return false;
      }
    },
    [fetchProducts]
  );

  // Permanently delete product
  const deleteProduct = useCallback(
    async (id: number) => {
      try {
        console.log("Permanently deleting product:", id);

        // Get CSRF token
        const csrfToken = getCsrfTokenFromCookie();
        if (!csrfToken) {
          await getCsrfToken();
        }

        const response = await axios.delete(`${API_URL}/admin/barang/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-XSRF-TOKEN": decodeURIComponent(csrfToken || ""),
          },
          withCredentials: true,
        });

        console.log("Delete product response:", response.data);

        if (response.data.status === "success") {
          toast.success("Product permanently deleted!");
          await fetchProducts();
          return true;
        } else {
          toast.error(
            response.data.message || "Failed to permanently delete product"
          );
          return false;
        }
      } catch (error: any) {
        console.error("Error permanently deleting product:", error);
        toast.error("Failed to permanently delete product. Please try again.");
        return false;
      }
    },
    [fetchProducts]
  );

  return {
    products,
    loading,
    selectedProduct,
    categories,
    setSelectedProduct,
    fetchProducts,
    fetchCategories,
    getProductDetails,
    updateProduct,
    softDeleteProduct,
    restoreProduct,
    deleteProduct,
  };
};
