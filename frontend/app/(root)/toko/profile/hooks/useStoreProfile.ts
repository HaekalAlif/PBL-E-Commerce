import { useState, useEffect } from "react";
import { StoreProfile, StoreAddress, StoreFormData } from "../types";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";

export const useStoreProfile = () => {
  const [profile, setProfile] = useState<StoreProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [storeAddresses, setStoreAddresses] = useState<StoreAddress[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchStoreData();
  }, []);

  const fetchStoreData = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

      const response = await axiosInstance.get(`${apiUrl}/toko/my-store`, {
        withCredentials: true,
      });

      if (response.data.success) {
        setProfile(response.data.data);
        await fetchStoreAddresses();
      } else {
        setProfile(null);
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        setProfile(null);
      } else {
        const errorMessage =
          err.response?.data?.message || "Error loading store profile";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchStoreAddresses = async () => {
    try {
      setLoadingAddresses(true);
      setAddressError(null);

      const response = await axiosInstance.get(`/api/toko/addresses`, {
        withCredentials: true,
      });

      if (response.data.status === "success") {
        setStoreAddresses(response.data.data);
      } else {
        throw new Error(response.data.message || "Failed to fetch addresses");
      }
    } catch (err: any) {
      setAddressError(
        err.response?.data?.message || "Failed to load store addresses"
      );
    } finally {
      setLoadingAddresses(false);
    }
  };

  const updateStoreProfile = async (formData: StoreFormData) => {
    try {
      setIsUpdating(true);

      const tempUpdatedProfile = { ...profile, ...formData };
      setProfile(tempUpdatedProfile as StoreProfile);

      const response = await axiosInstance.put("/api/toko", formData);

      if (response.data.success) {
        setProfile(response.data.data);
        toast.success("Toko berhasil diperbarui");
        return true;
      } else {
        setProfile(profile);
        toast.error(response.data.message || "Gagal memperbarui toko");
        return false;
      }
    } catch (error: any) {
      setProfile(profile);
      toast.error(
        error.response?.data?.message ||
          "Terjadi kesalahan saat memperbarui toko"
      );
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteStore = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.delete("/api/toko");

      if (response.data.success) {
        toast.success("Toko berhasil dihapus");
        setProfile(null);
        return true;
      } else {
        toast.error(response.data.message || "Gagal menghapus toko");
        return false;
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Terjadi kesalahan saat menghapus toko"
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const copyStoreLink = () => {
    if (!profile) return;

    const baseUrl = window.location.origin;
    const storeUrl = `${baseUrl}/toko/${profile.slug}`;

    navigator.clipboard.writeText(storeUrl).then(() => {
      toast.success("Link toko berhasil disalin ke clipboard");
    });
  };

  return {
    profile,
    loading,
    error,
    storeAddresses,
    loadingAddresses,
    addressError,
    isUpdating,
    fetchStoreData,
    fetchStoreAddresses,
    updateStoreProfile,
    deleteStore,
    copyStoreLink,
  };
};
