import { useState, useEffect } from "react";
import axios from "@/lib/axios";

export interface ProductDetail {
  id_barang: number;
  nama_barang: string;
  slug: string;
  deskripsi_barang: string;
  harga: number;
  grade: string;
  status_barang: string;
  stok: number;
  kondisi_detail: string;
  berat_barang: number;
  dimensi: string;
  kategori: {
    id_kategori: number;
    nama_kategori: string;
  };
  toko: {
    id_toko: number;
    id_user: number; // Add this field for seller ID
    nama_toko: string;
    slug: string;
    alamat_toko?: Array<{
      id_alamat_toko: number;
      nama_pengirim: string;
      no_telepon: string;
      alamat_lengkap: string;
      is_primary: boolean;
      province?: {
        name: string;
      };
      regency?: {
        name: string;
      };
    }>;
  };
  gambar_barang: Array<{
    id_gambar: number;
    url_gambar: string;
    is_primary: boolean;
  }>;
}

export function useProductDetail(slug: string) {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/products/${slug}`
        );
        if (response.data.status === "success") {
          setProduct(response.data.data);
        } else {
          setError("Failed to load product details");
        }
      } catch (err: any) {
        console.error("Error fetching product:", err);
        setError(err.response?.data?.message || "Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  return { product, loading, error };
}
