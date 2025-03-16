"use client";

import { useState, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import { getCsrfToken, getCsrfTokenFromCookie } from "@/lib/axios";
import { Kategori, KategoriFormData } from "../types";

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
      const response = await axios.get(`${API_URL}/admin/kategori`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        withCredentials: true,
      });

      if (response.data.status === "success") {
        setKategori(response.data.data);
      } else {
        toast.error(response.data.message || "Gagal mengambil data kategori");
      }
    } catch (error: any) {
      console.error("Error fetching kategori:", error);
      toast.error("Gagal memuat data kategori. Silakan coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new kategori
  const createKategori = useCallback(
    async (formData: KategoriFormData) => {
      try {
        // Selalu dapatkan CSRF token baru sebelum request POST
        await getCsrfToken();

        const response = await axios.post(
          `${API_URL}/admin/kategori`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "X-XSRF-TOKEN": getCsrfTokenFromCookie() || "",
            },
            withCredentials: true,
          }
        );

        if (response.data.status === "success") {
          toast.success("Kategori berhasil dibuat!");
          await fetchKategori();
          return true;
        } else {
          toast.error(response.data.message || "Gagal membuat kategori");
          return false;
        }
      } catch (error: any) {
        console.error("Error creating kategori:", error);
        toast.error(
          error.response?.data?.message ||
            "Gagal membuat kategori. Silakan coba lagi."
        );
        return false;
      }
    },
    [fetchKategori]
  );

  // Update an existing kategori
  const updateKategori = useCallback(
    async (kategoriId: number, formData: KategoriFormData) => {
      try {
        // Periksa jika token CSRF sudah ada
        const csrfToken = getCsrfTokenFromCookie();

        // Jika tidak ada, dapatkan token CSRF baru
        if (!csrfToken) {
          await getCsrfToken();
        }

        const response = await axios.put(
          `${API_URL}/admin/kategori/${kategoriId}`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "X-XSRF-TOKEN": getCsrfTokenFromCookie() || "",
            },
            withCredentials: true,
          }
        );

        if (response.data.status === "success") {
          toast.success("Kategori berhasil diperbarui!");
          await fetchKategori();
          return true;
        } else {
          toast.error(response.data.message || "Gagal memperbarui kategori");
          return false;
        }
      } catch (error: any) {
        console.error("Error updating kategori:", error);
        toast.error(
          error.response?.data?.message ||
            "Gagal memperbarui kategori. Silakan coba lagi."
        );
        return false;
      }
    },
    [fetchKategori]
  );

  // Delete a kategori
  const deleteKategori = useCallback(
    async (kategoriId: number) => {
      try {
        // Periksa jika token CSRF sudah ada
        const csrfToken = getCsrfTokenFromCookie();

        // Jika tidak ada, dapatkan token CSRF baru
        if (!csrfToken) {
          await getCsrfToken();
        }

        const response = await axios.delete(
          `${API_URL}/admin/kategori/${kategoriId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "X-XSRF-TOKEN": getCsrfTokenFromCookie() || "",
            },
            withCredentials: true,
          }
        );

        if (response.data.status === "success") {
          toast.success("Kategori berhasil dihapus!");
          await fetchKategori();
          return true;
        } else {
          toast.error(response.data.message || "Gagal menghapus kategori");
          return false;
        }
      } catch (error: any) {
        console.error("Error deleting kategori:", error);
        toast.error("Gagal menghapus kategori. Silakan coba lagi.");
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
