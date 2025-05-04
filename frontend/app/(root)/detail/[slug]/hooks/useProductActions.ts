import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios";
import { ProductDetail } from "./useProductDetail";

export const useProductActions = (product: ProductDetail | null) => {
  const router = useRouter();
  const [addingToCart, setAddingToCart] = useState(false);

  const handleBuyNow = async (quantity: number) => {
    if (!product) return;

    if (quantity > (product.stok || 0)) {
      toast.error("Jumlah melebihi stok yang tersedia");
      return;
    }

    toast.info("Processing your purchase...");

    try {
      // Get the user's primary address
      const addressResponse = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/addresses`
      );

      if (addressResponse.data.status !== "success" || !addressResponse.data.data.length) {
        toast.error("Please add a shipping address first");
        router.push("/user/alamat");
        return;
      }

      const addresses = addressResponse.data.data;
      const primaryAddress = addresses.find((addr: any) => addr.is_primary) || addresses[0];

      const response = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/buy-now`,
        {
          product_slug: product.slug,
          jumlah: quantity,
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
      } else {
        toast.error(error.response?.data?.message || "Failed to process purchase");
      }
    }
  };

  const handleMakeOffer = async (quantity: number) => {
    if (!product) return;
    toast.info("Fitur penawaran akan segera hadir!");
    // Implementasi penawaran nantinya
  };

  const handleAddToCart = async (quantity: number) => {
    if (!product) return;

    if (quantity > (product.stok || 0)) {
      toast.error("Jumlah melebihi stok yang tersedia");
      return;
    }

    setAddingToCart(true);
    try {
      const response = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_URL}/cart`,
        {
          id_barang: product.id_barang,
          jumlah: quantity,
        }
      );

      if (response.data.status === "success") {
        toast.success("Successfully added to cart");
      }
    } catch (error: any) {
      console.error("Error adding to cart:", error);
      if (error.response?.status === 401) {
        toast.error("Please log in to continue");
        router.push("/login");
      } else {
        toast.error("Failed to add item to cart");
      }
    } finally {
      setAddingToCart(false);
    }
  };

  return {
    addingToCart,
    handleBuyNow,
    handleMakeOffer,
    handleAddToCart,
  };
};
