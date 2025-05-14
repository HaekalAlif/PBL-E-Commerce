import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "@/lib/axios";
import { toast } from "sonner";
import { Barang, GambarBarang } from "../types";

export const useBarangDetail = () => {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as string) || "";

  const [barang, setBarang] = useState<Barang | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchBarang = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/barang/slug/${slug}`);

        if (response.data.status === "success") {
          setBarang(response.data.data);
          if (response.data.data.gambar_barang?.length > 0) {
            const primaryImage = response.data.data.gambar_barang.find(
              (img: GambarBarang) => img.is_primary
            );
            setSelectedImage(
              primaryImage?.url_gambar ||
                response.data.data.gambar_barang[0].url_gambar
            );
          }
        } else {
          setError("Gagal memuat data produk");
        }
      } catch (error: any) {
        console.error("Error fetching product:", error);
        setError(
          error.response?.data?.message || "Terjadi kesalahan saat memuat data"
        );
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchBarang();
    }
  }, [slug]);

  const handleDelete = async () => {
    if (!barang) return;

    try {
      await axios.delete(`/api/barang/${barang.id_barang}`);
      toast.success("Produk berhasil dihapus");
      router.push("/toko/barang");
    } catch (error: any) {
      console.error("Error deleting product:", error);
      toast.error(error.response?.data?.message || "Gagal menghapus produk");
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return {
    barang,
    loading,
    error,
    selectedImage,
    setSelectedImage,
    handleDelete,
    formatCurrency,
  };
};
