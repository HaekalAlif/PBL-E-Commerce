"use client";

import { useState, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import { getCsrfTokenFromCookie, getCsrfToken } from "@/lib/axios";
import { Kategori } from "../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const useKategoriManagement = () => {
  const [kategori, setKategori] = useState<Kategori[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedKategori, setSelectedKategori] = useState<Kategori | null>(
    null
  );

  // Fetch all kategori
  const fetchKategori = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Fetching categories from:", `${API_URL}/admin/kategori`);

      const response = await axios.get(`${API_URL}/admin/kategori`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        withCredentials: true,
      });

      console.log("API Response:", response.data);

      if (response.data.status === "success") {
        setKategori(response.data.data);
      } else {
        toast.error(response.data.message || "Failed to fetch categories");
        setKategori([]);
      }
    } catch (error: any) {
      console.error("Error fetching categories:", error);
      toast.error(error.response?.data?.message || "Failed to load categories");
      setKategori([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new kategori
  const createKategori = useCallback(
    async (formData: FormData) => {
      try {
        // Ensure CSRF token is present
        await getCsrfToken();
        const csrfToken = getCsrfTokenFromCookie();
        
        console.log("Creating category with data:", Object.fromEntries(formData));

        const response = await axios.post(`${API_URL}/admin/kategori`, formData, {
          headers: {
            Accept: "application/json",
            "X-XSRF-TOKEN": decodeURIComponent(csrfToken || ""),
          },
          withCredentials: true,
        });

        if (response.data.status === "success") {
          toast.success("Category created successfully!");
          await fetchKategori();
          return true;
        }
        
        toast.error(response.data.message || "Failed to create category");
        return false;
      } catch (error: any) {
        console.error("Error creating category:", {
          error: error.message,
          response: error.response?.data
        });

        // Improved error handling with proper type checking
        if (error.response?.data?.errors) {
          const errors = error.response.data.errors;
          Object.values(errors).forEach((errorMessages: unknown) => {
            if (Array.isArray(errorMessages)) {
              errorMessages.forEach((message: unknown) => {
                if (typeof message === 'string') {
                  toast.error(message);
                }
              });
            } else if (typeof errorMessages === 'string') {
              toast.error(errorMessages);
            }
          });
        } else {
          toast.error(error.response?.data?.message || "Failed to create category");
        }
        return false;
      }
    },
    [fetchKategori]
  );

  // Update an existing kategori
  const updateKategori = useCallback(
    async (kategoriId: number, formData: FormData) => {
      try {
        const csrfToken = getCsrfTokenFromCookie();
        console.log("Updating category:", kategoriId, Object.fromEntries(formData));

        formData.append('_method', 'PUT');

        const response = await axios.post(
          `${API_URL}/admin/kategori/${kategoriId}`,
          formData,
          {
            headers: {
              Accept: "application/json",
              "X-XSRF-TOKEN": decodeURIComponent(csrfToken || ""),
            },
            withCredentials: true,
          }
        );

        console.log("Update category response:", response.data);

        if (response.data.status === "success") {
          toast.success("Category updated successfully!");
          await fetchKategori();
          return true;
        } else {
          toast.error(response.data.message || "Failed to update category");
          return false;
        }
      } catch (error: any) {
        console.error("Error updating category:", error);
        toast.error(error.response?.data?.message || "Failed to update category");
        return false;
      }
    },
    [fetchKategori]
  );

  // Delete a kategori
  const deleteKategori = useCallback(
    async (kategoriId: number) => {
      try {
        console.log("Deleting category:", kategoriId);

        const csrfToken = getCsrfTokenFromCookie();
        if (!csrfToken) {
          await getCsrfToken();
        }

        const response = await axios.delete(
          `${API_URL}/admin/kategori/${kategoriId}`,
          {
            headers: {
              Accept: "application/json",
              "X-XSRF-TOKEN": decodeURIComponent(csrfToken || ""),
            },
            withCredentials: true,
          }
        );

        console.log("Delete category response:", response.data);

        if (response.data.status === "success") {
          toast.success("Category deleted successfully!");
          await fetchKategori();
          return true;
        } else {
          toast.error(response.data.message || "Failed to delete category");
          return false;
        }
      } catch (error: any) {
        console.error("Error deleting category:", error);
        toast.error("Failed to delete category");
        return false;
      }
    },
    [fetchKategori]
  );

  return {
    kategori,
    loading,
    selectedKategori,
    setSelectedKategori,
    fetchKategori,
    createKategori,
    updateKategori,
    deleteKategori,
  };
};
