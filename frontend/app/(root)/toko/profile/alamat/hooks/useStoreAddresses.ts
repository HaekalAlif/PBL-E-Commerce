import { useState, useEffect } from "react";
import { StoreAddress } from "../types";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";

export const useStoreAddresses = () => {
  const [addresses, setAddresses] = useState<StoreAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get(`/api/toko/addresses`, {
        withCredentials: true,
      });

      if (response.data.status === "success") {
        setAddresses(response.data.data);
      } else {
        throw new Error(response.data.message || "Failed to fetch addresses");
      }
    } catch (err: any) {
      console.error("Error fetching addresses:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "An error occurred while fetching addresses"
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteAddress = async (id: number) => {
    try {
      setActionLoading(id);

      const response = await axiosInstance.delete(`/api/toko/addresses/${id}`, {
        withCredentials: true,
      });

      if (response.data.status === "success") {
        setAddresses((prev) =>
          prev.filter((address) => address.id_alamat_toko !== id)
        );

        toast.success("Alamat berhasil dihapus");
        return true;
      } else {
        throw new Error(
          response.data.message || "Failed to delete the address"
        );
      }
    } catch (err: any) {
      console.error("Error deleting address:", err);
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Terjadi kesalahan saat menghapus alamat"
      );
      return false;
    } finally {
      setActionLoading(null);
    }
  };

  const setAsPrimary = async (id: number) => {
    try {
      setActionLoading(id);

      const response = await axiosInstance.patch(
        `/api/toko/addresses/${id}/primary`,
        {},
        {
          withCredentials: true,
        }
      );

      if (response.data.status === "success") {
        setAddresses((prev) =>
          prev.map((address) => ({
            ...address,
            is_primary: address.id_alamat_toko === id,
          }))
        );

        toast.success("Alamat berhasil dijadikan alamat utama");
        return true;
      } else {
        throw new Error(
          response.data.message || "Failed to set address as primary"
        );
      }
    } catch (err: any) {
      console.error("Error setting address as primary:", err);
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Terjadi kesalahan saat mengatur alamat utama"
      );
      return false;
    } finally {
      setActionLoading(null);
    }
  };

  return {
    addresses,
    loading,
    error,
    actionLoading,
    fetchAddresses,
    deleteAddress,
    setAsPrimary,
  };
};
