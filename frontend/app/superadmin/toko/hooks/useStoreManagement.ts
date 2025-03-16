"use client";

import { useState, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import { getCsrfToken, getCsrfTokenFromCookie } from "@/lib/axios";
import { Store } from "../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const useStoreManagement = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  // Fetch all stores
  const fetchStores = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Fetching stores from:", `${API_URL}/admin/toko`); // Debug log

      const response = await axios.get(`${API_URL}/admin/toko`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        withCredentials: true,
      });

      console.log("API response:", response.data); // Debug log

      // Check response structure
      if (response.data.status === "success") {
        // Handle case when data is directly in response.data.data (not paginated)
        if (Array.isArray(response.data.data)) {
          const cleanedStores = response.data.data.map((store: Store) => ({
            ...store,
            nama_toko: String(store.nama_toko || "").replace(/0+$/, ""),
            is_active: Boolean(store.is_active),
            is_deleted: Boolean(store.is_deleted),
          }));
          setStores(cleanedStores);
        }
        // Handle paginated response (data.data.data structure)
        else if (
          response.data.data &&
          response.data.data.data &&
          Array.isArray(response.data.data.data)
        ) {
          const cleanedStores = response.data.data.data.map((store: Store) => ({
            ...store,
            nama_toko: String(store.nama_toko || "").replace(/0+$/, ""),
            is_active: Boolean(store.is_active),
            is_deleted: Boolean(store.is_deleted),
          }));
          setStores(cleanedStores);
        }
        // Handle case when data is directly in response.data
        else if (
          response.data.data === null ||
          typeof response.data.data === "string"
        ) {
          setStores([]);
        }
      } else {
        toast.error(response.data.message || "Failed to fetch stores");
        setStores([]);
      }
    } catch (error: any) {
      console.error("Error fetching stores:", error);
      toast.error("Failed to load stores. Please try again later.");
      setStores([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new store
  const createStore = useCallback(
    async (formData: any) => {
      try {
        await getCsrfToken();

        const response = await axios.post(`${API_URL}/admin/toko`, formData, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: true,
        });

        if (response.data.status === "success") {
          toast.success("Store created successfully!");
          await fetchStores();
          return true;
        } else {
          toast.error(response.data.message || "Failed to create store");
          return false;
        }
      } catch (error: any) {
        console.error("Error creating store:", error);
        toast.error(
          error.response?.data?.message ||
            "Failed to create store. Please try again."
        );
        return false;
      }
    },
    [fetchStores]
  );

  // Update an existing store
  const updateStore = useCallback(
    async (storeId: number, formData: any) => {
      try {
        // Get CSRF token from cookies
        const csrfToken = getCsrfTokenFromCookie();

        if (!csrfToken) {
          await getCsrfToken();
        }

        const response = await axios.put(
          `${API_URL}/admin/toko/${storeId}`,
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
          toast.success("Store updated successfully!");
          await fetchStores();
          return true;
        } else {
          toast.error(response.data.message || "Failed to update store");
          return false;
        }
      } catch (error: any) {
        console.error("Error updating store:", error);
        toast.error(
          error.response?.data?.message ||
            "Failed to update store. Please try again."
        );
        return false;
      }
    },
    [fetchStores]
  );

  // Delete a store (soft delete)
  const deleteStore = useCallback(
    async (storeId: number) => {
      try {
        // Get CSRF token from cookies
        const csrfToken = getCsrfTokenFromCookie();

        if (!csrfToken) {
          await getCsrfToken();
        }

        const response = await axios.delete(
          `${API_URL}/admin/toko/${storeId}`,
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
          toast.success("Store deleted successfully!");
          await fetchStores();
          return true;
        } else {
          toast.error(response.data.message || "Failed to delete store");
          return false;
        }
      } catch (error: any) {
        console.error("Error deleting store:", error);
        toast.error("Failed to delete store. Please try again.");
        return false;
      }
    },
    [fetchStores]
  );

  // Restore a soft-deleted store
  const restoreStore = useCallback(
    async (storeId: number) => {
      try {
        // Get CSRF token from cookies
        const csrfToken = getCsrfTokenFromCookie();

        if (!csrfToken) {
          await getCsrfToken();
        }

        const response = await axios.put(
          `${API_URL}/admin/toko/${storeId}/restore`,
          {},
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
          toast.success("Store restored successfully!");
          await fetchStores();
          return true;
        } else {
          toast.error(response.data.message || "Failed to restore store");
          return false;
        }
      } catch (error: any) {
        console.error("Error restoring store:", error);
        toast.error("Failed to restore store. Please try again.");
        return false;
      }
    },
    [fetchStores]
  );

  return {
    stores,
    loading,
    selectedStore,
    setSelectedStore,
    fetchStores,
    createStore,
    updateStore,
    deleteStore,
    restoreStore,
  };
};
