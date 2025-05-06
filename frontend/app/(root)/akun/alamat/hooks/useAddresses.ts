import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";
import { Address } from "../types";

export const useAddresses = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSettingPrimary, setIsSettingPrimary] = useState(false);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/api/user/addresses");
        if (response.data.status === "success") {
          setAddresses(response.data.data);
        } else {
          throw new Error(response.data.message || "Failed to fetch addresses");
        }
      } catch (err) {
        console.error("Error fetching addresses:", err);
        setError("Gagal memuat alamat.");
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  const handleSetPrimaryAddress = async (id: number) => {
    setIsSettingPrimary(true);
    try {
      const response = await axiosInstance.put(
        `/api/user/addresses/${id}/primary`
      );
      if (response.data.status === "success") {
        setAddresses((prev) =>
          prev.map((address) => ({
            ...address,
            is_primary: address.id_alamat === id,
          }))
        );
      } else {
        throw new Error(
          response.data.message || "Failed to set primary address"
        );
      }
    } catch (err) {
      console.error("Error setting primary address:", err);
      setError("Gagal mengatur alamat utama.");
    } finally {
      setIsSettingPrimary(false);
    }
  };

  const handleDeleteAddress = async (id: number) => {
    setIsDeleting(true);
    try {
      const response = await axiosInstance.delete(`/api/user/addresses/${id}`);
      if (response.data.status === "success") {
        setAddresses((prev) =>
          prev.filter((address) => address.id_alamat !== id)
        );
      } else {
        throw new Error(response.data.message || "Failed to delete address");
      }
    } catch (err) {
      console.error("Error deleting address:", err);
      setError("Gagal menghapus alamat.");
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    addresses,
    loading,
    error,
    isDeleting,
    isSettingPrimary,
    handleSetPrimaryAddress,
    handleDeleteAddress,
  };
};
