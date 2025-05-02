import { useState } from "react";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useAddToCart() {
  const [addingToCart, setAddingToCart] = useState<number | null>(null);
  const router = useRouter();

  const handleAddToCart = async (productId: number, productName: string) => {
    setAddingToCart(productId);

    try {
      const response = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_URL}/cart`,
        {
          id_barang: productId,
          jumlah: 1,
        }
      );

      if (response.data.status === "success") {
        toast.success(`${productName} added to cart`);
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error("Please login to add items to cart");
        router.push("/login");
      } else {
        toast.error("Failed to add item to cart");
      }
    } finally {
      setAddingToCart(null);
    }
  };

  return {
    addingToCart,
    handleAddToCart,
  };
}
