import { useState, useEffect } from "react";
import axios from "axios";

interface StoreCategory {
  id_kategori: number;
  nama_kategori: string;
  slug: string;
  product_count: number;
}

export function useStoreCategories(storeSlug: string) {
  const [categories, setCategories] = useState<StoreCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!storeSlug) return;

    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/store/${storeSlug}/categories`
        );

        if (response.data.status === "success") {
          setCategories(response.data.data || []);
        } else {
          setError("Failed to fetch categories");
        }
      } catch (err: any) {
        console.error("Error fetching store categories:", err);
        setError(err.response?.data?.message || "Failed to fetch categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [storeSlug]);

  return { categories, loading, error };
}
