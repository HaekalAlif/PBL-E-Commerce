import { useState, useEffect } from "react";
import axios from "axios";
import { StoreData } from "../types";

export function useStoreProfile(slug: string) {
  const [storeData, setStoreData] = useState<StoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchStoreProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/store/${slug}/profile`
        );

        if (response.data.status === "success") {
          setStoreData(response.data.data);
        } else {
          setError("Failed to fetch store profile");
        }
      } catch (err: any) {
        console.error("Error fetching store profile:", err);
        setError(
          err.response?.data?.message || "Failed to fetch store profile"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStoreProfile();
  }, [slug]);

  return { storeData, loading, error };
}
