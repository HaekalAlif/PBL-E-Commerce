import { useState, useEffect, useRef } from "react";
import axios from "axios";

interface UseStoreReviewsParams {
  slug: string;
  rating?: number;
  page: number;
}

interface StoreReview {
  id_review: number;
  rating: number;
  komentar: string;
  image_review?: string;
  created_at: string;
  user: {
    id_user: number;
    name: string;
  };
  pembelian: {
    id_pembelian: number;
    kode_pembelian: string;
    detailPembelian?: Array<{
      barang: {
        id_barang: number;
        nama_barang: string;
        gambarBarang?: Array<{
          url_gambar: string;
          is_primary: boolean;
        }>;
        gambar_barang?: Array<{
          url_gambar: string;
          is_primary: boolean;
        }>;
      };
    }>;
    detail_pembelian?: Array<{
      barang: {
        id_barang: number;
        nama_barang: string;
        gambarBarang?: Array<{
          url_gambar: string;
          is_primary: boolean;
        }>;
        gambar_barang?: Array<{
          url_gambar: string;
          is_primary: boolean;
        }>;
      };
    }>;
  };
}

export function useStoreReviews(params: UseStoreReviewsParams) {
  const [reviews, setReviews] = useState<StoreReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  const abortControllerRef = useRef<AbortController | null>(null);
  const lastRequestRef = useRef<string>("");

  useEffect(() => {
    if (!params.slug) return;

    const requestKey = JSON.stringify(params);
    
    if (lastRequestRef.current === requestKey) {
      return;
    }

    const fetchReviews = async () => {
      try {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();
        
        setLoading(true);
        setError(null);
        
        const queryParams = new URLSearchParams();
        if (params.rating) queryParams.append('rating', params.rating.toString());
        queryParams.append('page', params.page.toString());
        queryParams.append('per_page', '10');

        const url = `${process.env.NEXT_PUBLIC_API_URL}/store/${params.slug}/reviews?${queryParams}`;
        
        const response = await axios.get(url, {
          signal: abortControllerRef.current.signal
        });

        if (response.data.status === 'success') {
          const data = response.data.data;
          // Ensure consistent data structure
          const normalizedReviews = (data.data || []).map((review: any) => {
            // Normalize the detail pembelian structure
            if (review.pembelian) {
              const detailPembelian = review.pembelian.detailPembelian || review.pembelian.detail_pembelian || [];
              review.pembelian.detailPembelian = detailPembelian;
              review.pembelian.detail_pembelian = detailPembelian;
            }
            return review;
          });
          
          setReviews(normalizedReviews);
          setTotalPages(data.last_page || 1);
          lastRequestRef.current = requestKey;
        } else {
          setError('Failed to fetch reviews');
        }
      } catch (err: any) {
        if (err.name === 'AbortError') {
          return;
        }
        
        console.error('Error fetching store reviews:', err);
        setError(err.response?.data?.message || 'Failed to fetch reviews');
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchReviews, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [params.slug, params.rating, params.page]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return { reviews, loading, error, totalPages };
}
