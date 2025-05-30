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

      if (
        addressResponse.data.status !== "success" ||
        !addressResponse.data.data.length
      ) {
        toast.error("Please add a shipping address first");
        router.push("/user/alamat");
        return;
      }

      const addresses = addressResponse.data.data;
      const primaryAddress =
        addresses.find((addr: any) => addr.is_primary) || addresses[0];

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
        // Use the correct route pattern with code parameter
        router.push(`/checkout?code=${kode_pembelian}`);
      } else {
        toast.error(response.data.message || "Failed to create purchase");
      }
    } catch (error: any) {
      console.error("Error processing buy now:", error);
      if (error.response?.status === 401) {
        toast.error("Please log in to continue");
        router.push("/login");
      } else {
        toast.error(
          error.response?.data?.message || "Failed to process purchase"
        );
      }
    }
  };

  const handleMakeOffer = async (quantity: number) => {
    if (!product) return;

    try {
      toast.info("Creating chat room...");

      // Create or find existing chat room with the seller
      const response = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_URL}/chat`,
        {
          id_penjual: product.toko.id_user, // Get seller ID from store owner
          id_barang: product.id_barang,
        }
      );

      if (response.data.success) {
        const chatRoom = response.data.data;

        // Redirect to chat page with the room ID
        router.push(
          `/chat?room=${chatRoom.id_ruang_chat}&offer=true&quantity=${quantity}&product=${product.slug}`
        );
        toast.success("Chat room created! You can now make your offer.");
      } else {
        toast.error(response.data.message || "Failed to create chat room");
      }
    } catch (error: any) {
      console.error("Error creating chat room:", error);
      if (error.response?.status === 401) {
        toast.error("Please log in to make an offer");
        router.push("/login");
      } else {
        toast.error(
          error.response?.data?.message || "Failed to create chat room"
        );
      }
    }
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
