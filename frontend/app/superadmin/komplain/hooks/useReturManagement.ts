import { useCallback } from "react";
import axios from "@/lib/axios";
import { toast } from "sonner";
import { getCsrfTokenFromCookie } from "@/lib/axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const useReturManagement = () => {
  const processRetur = useCallback(
    async (idRetur: number, status: string, adminNotes: string) => {
      try {
        const token = await getCsrfTokenFromCookie();

        const response = await axios.post(
          `${API_URL}/admin/retur/${idRetur}/process`,
          {
            status: status,
            admin_notes: adminNotes,
          },
          {
            headers: {
              "X-XSRF-TOKEN": token || "",
            },
            withCredentials: true,
          }
        );

        if (response.data.status === "success") {
          toast.success(response.data.message);
          return true;
        } else {
          toast.error(response.data.message || "Failed to process retur");
          return false;
        }
      } catch (error: any) {
        console.error("Error processing retur:", error);
        toast.error(error.response?.data?.message || "Gagal memproses retur");
        return false;
      }
    },
    []
  );

  return {
    processRetur,
  };
};
