import { useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { Product } from "../types";

export function useBuyNow() {
  const [processingBuyNow, setProcessingBuyNow] = useState<number | null>(null);
  const router = useRouter();

  const handleBuyNow = async (product: Product) => {
    setProcessingBuyNow(product.id_barang);

    try {
      const addressResponse = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/addresses`
      );

      if (
        addressResponse.data.status !== "success" ||
        !addressResponse.data.data.length
      ) {
        toast.error("Please add a shipping address first");
        router.push("/akun/alamat");
        return;
      }

      const addresses = addressResponse.data.data;
      const primaryAddress =
        addresses.find((addr: any) => addr.is_primary) || addresses[0];

      const response = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/buy-now`,
        {
          id_barang: product.id_barang,
          jumlah: 1,
          id_alamat: primaryAddress.id_alamat,
        }
      );

      if (response.data.status === "success") {
        const { kode_pembelian } = response.data.data;
        router.push(`/checkout?code=${kode_pembelian}`);
      } else {
        toast.error(response.data.message || "Failed to process your purchase");
      }
    } catch (error: any) {
      console.error("Error processing buy now:", error);

      if (error.response?.status === 401) {
        toast.error("Please log in to continue");
        router.push("/login");
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to process your purchase. Please try again.");
      }
    } finally {
      setProcessingBuyNow(null);
    }
  };

  return {
    processingBuyNow,
    handleBuyNow,
  };
}
