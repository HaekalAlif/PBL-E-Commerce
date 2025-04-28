import { useState, useEffect } from "react";
import axios from "@/lib/axios";

export interface RecommendedProduct {
  id_barang: number;
  nama_barang: string;
  slug: string;
  harga: number;
  gambar_barang: Array<{
    url_gambar: string;
    is_primary: boolean;
  }>;
}

export function useRecommendedProducts() {
  const [products, setProducts] = useState<RecommendedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      try {
        const response = await axios.get("/api/recommended-products");
        if (response.data.status === "success") {
          setProducts(response.data.data || []);
        } else {
          setError("Failed to load recommended products");
        }
      } catch (err) {
        console.error("Error fetching recommended products:", err);
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedProducts();
  }, []);

  return { products, loading, error };
}
