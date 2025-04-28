import { useState, useEffect } from "react";
import axios from "@/lib/axios";

export interface FeaturedProduct {
  id_barang: number;
  nama_barang: string;
  slug: string;
  harga: number;
  gambarBarang?: Array<{
    url_gambar: string;
    is_primary: boolean;
  }>;
  gambar_barang?: Array<{
    url_gambar: string;
    is_primary: boolean;
  }>;
}

export function useFeaturedProducts() {
  const [products, setProducts] = useState<FeaturedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        console.log("Fetching featured products...");
        const response = await axios.get("/api/featured-products");
        console.log("Full API Response:", response.data);

        if (response.data.status === "success") {
          const productsData = response.data.data;
          console.log("Products data:", productsData);
          console.log(
            "First product images:",
            productsData[0]?.gambarBarang || productsData[0]?.gambar_barang
          );
          setProducts(productsData || []);
        } else {
          setError("Failed to load featured products");
        }
      } catch (err: any) {
        console.error("Error details:", err);
        setError(err.response?.data?.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return { products, loading, error };
}
