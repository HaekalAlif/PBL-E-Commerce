import { useState, useEffect, useRef } from "react";
import axios from "axios";

interface UseStoreProductsParams {
  slug: string;
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  grade?: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  page: number;
}

interface StoreProduct {
  id_barang: number;
  nama_barang: string;
  slug: string;
  harga: number;
  grade: string;
  status_barang: string;
  stok: number;
  kategori: {
    id_kategori: number;
    nama_kategori: string;
    slug: string;
  };
  gambarBarang: Array<{
    url_gambar: string;
    is_primary: boolean;
  }>;
}

export function useStoreProducts(params: UseStoreProductsParams) {
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  // Use ref to track the current request
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastRequestRef = useRef<string>("");

  useEffect(() => {
    if (!params.slug) return;

    // Create a unique key for this request
    const requestKey = JSON.stringify(params);

    // If this is the same request as the last one, skip it
    if (lastRequestRef.current === requestKey) {
      return;
    }

    const fetchProducts = async () => {
      try {
        // Cancel any existing request
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        // Create new abort controller
        abortControllerRef.current = new AbortController();

        setLoading(true);
        setError(null);

        // Build query parameters
        const queryParams = new URLSearchParams();
        if (params.category) queryParams.append("category", params.category);
        if (params.search) queryParams.append("search", params.search);
        if (params.minPrice)
          queryParams.append("min_price", params.minPrice.toString());
        if (params.maxPrice)
          queryParams.append("max_price", params.maxPrice.toString());
        if (params.grade) queryParams.append("grade", params.grade);
        queryParams.append("sort_by", params.sortBy);
        queryParams.append("sort_order", params.sortOrder);
        queryParams.append("page", params.page.toString());
        queryParams.append("per_page", "12");

        const url = `${process.env.NEXT_PUBLIC_API_URL}/store/${params.slug}/products?${queryParams}`;

        console.log("Fetching products from:", url);

        const response = await axios.get(url, {
          signal: abortControllerRef.current.signal,
        });

        if (response.data.status === "success") {
          const data = response.data.data;
          setProducts(data.data || []);
          setTotalPages(data.last_page || 1);
          lastRequestRef.current = requestKey; // Mark this request as completed
        } else {
          setError("Failed to fetch products");
        }
      } catch (err: any) {
        if (err.name === "AbortError") {
          // Request was cancelled, don't set error
          return;
        }

        console.error("Error fetching store products:", err);
        setError(err.response?.data?.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    // Debounce the request slightly
    const timeoutId = setTimeout(fetchProducts, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [
    params.slug,
    params.category,
    params.search,
    params.minPrice,
    params.maxPrice,
    params.grade,
    params.sortBy,
    params.sortOrder,
    params.page,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return { products, loading, error, totalPages };
}
