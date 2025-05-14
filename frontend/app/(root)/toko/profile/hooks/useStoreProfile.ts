import { useState, useEffect } from "react";
import { StoreProfile } from "../types";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";

export const useStoreProfile = () => {
  const [profile, setProfile] = useState<StoreProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        setLoading(true);
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

        const response = await axiosInstance.get(`${apiUrl}/toko/my-store`, {
          withCredentials: true,
        });

        if (response.data.success) {
          setProfile(response.data.data);
        } else {
          throw new Error("Failed to fetch store data");
        }
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || "Error loading store profile";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreData();
  }, []);

  return {
    profile,
    loading,
    error,
  };
};
