import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios";

export const useStoreChatActions = () => {
  const router = useRouter();
  const [creatingChat, setCreatingChat] = useState(false);

  const handleStartChat = async (sellerId: number) => {
    setCreatingChat(true);
    
    try {
      toast.info("Menghubungkan ke toko...");

      // Create or find existing chat room with the seller (without specific product)
      const response = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_URL}/chat`,
        {
          id_penjual: sellerId,
        }
      );

      if (response.data.success) {
        const chatRoom = response.data.data;
        
        // Redirect to chat page with the room ID
        router.push(`/chat?room=${chatRoom.id_ruang_chat}`);
        toast.success("Berhasil terhubung! Anda dapat mulai chat dengan toko.");
      } else {
        toast.error(response.data.message || "Gagal membuat ruang chat");
      }
    } catch (error: any) {
      console.error("Error creating chat room:", error);
      if (error.response?.status === 401) {
        toast.error("Silakan login terlebih dahulu untuk chat dengan toko");
        router.push("/login");
      } else {
        toast.error(
          error.response?.data?.message || "Gagal terhubung ke toko"
        );
      }
    } finally {
      setCreatingChat(false);
    }
  };

  return {
    creatingChat,
    handleStartChat,
  };
};
