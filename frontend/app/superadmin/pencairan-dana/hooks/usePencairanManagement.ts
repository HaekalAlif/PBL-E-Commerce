import { useState, useCallback } from "react";
import axios from "@/lib/axios";
import { toast } from "sonner";
import { getCsrfTokenFromCookie } from "@/lib/axios";
import type {
  PengajuanPencairan,
  PencairanStats,
  PencairanFilterValues,
} from "../types";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const usePencairanManagement = () => {
  const router = useRouter();
  const [pencairans, setPencairans] = useState<PengajuanPencairan[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPencairans, setTotalPencairans] = useState(0);
  const [selectedPencairan, setSelectedPencairan] =
    useState<PengajuanPencairan | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [stats, setStats] = useState<PencairanStats | null>(null);

  const fetchPencairans = useCallback(
    async (filters: Partial<PencairanFilterValues> = {}) => {
      setLoading(true);
      try {
        await getCsrfTokenFromCookie();

        // Remove empty string values from filters
        const cleanFilters = Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v != null && v !== "")
        );

        const response = await axios.get(`${API_URL}/admin/pencairan`, {
          params: cleanFilters,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: true,
        });

        if (response.data.status === "success") {
          setPencairans(response.data.data.data || []);
          setTotalPages(response.data.data.last_page || 1);
          setTotalPencairans(response.data.data.total || 0);
        } else {
          toast.error(
            response.data.message || "Failed to fetch withdrawal requests"
          );
          setPencairans([]);
        }
      } catch (error: any) {
        console.error("Error fetching withdrawal requests:", error);
        toast.error(
          error.response?.data?.message || "Failed to load withdrawal requests"
        );
        if (error.response?.status === 401) {
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  const fetchStats = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/pencairan/stats`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        withCredentials: true,
      });

      if (response.data.status === "success") {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching withdrawal stats:", error);
    }
  }, []);

  const getPencairanDetails = useCallback(async (id: number) => {
    try {
      setLoading(true);
      await getCsrfTokenFromCookie();

      const response = await axios.get(`${API_URL}/admin/pencairan/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        withCredentials: true,
      });

      if (response.data.status === "success" && response.data.data) {
        setSelectedPencairan(response.data.data);
        setIsDetailOpen(true);
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to fetch details");
      }
    } catch (error: any) {
      console.error("Error fetching withdrawal details:", error);
      toast.error(
        error.response?.data?.message || "Failed to load withdrawal details"
      );
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const processPencairan = useCallback(
    async (id: number, action: string, notes: string) => {
      try {
        const token = getCsrfTokenFromCookie();

        const response = await axios.post(
          `${API_URL}/admin/pencairan/${id}/process`,
          {
            action: action,
            catatan_admin: notes,
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
          setSelectedPencairan(response.data.data);
          return true;
        }
        return false;
      } catch (error: any) {
        console.error("Error processing withdrawal:", error);
        toast.error(
          error.response?.data?.message || "Gagal memproses pencairan"
        );
        return false;
      }
    },
    []
  );

  const addComment = useCallback(async (id: number, notes: string) => {
    try {
      const token = getCsrfTokenFromCookie();

      const response = await axios.post(
        `${API_URL}/admin/pencairan/${id}/comment`,
        {
          catatan_admin: notes,
        },
        {
          headers: {
            "X-XSRF-TOKEN": token || "",
          },
          withCredentials: true,
        }
      );

      if (response.data.status === "success") {
        toast.success("Comment added successfully");
        setSelectedPencairan(response.data.data);
        return true;
      }
      return false;
    } catch (error: any) {
      console.error("Error adding comment:", error);
      toast.error(error.response?.data?.message || "Failed to add comment");
      return false;
    }
  }, []);

  const bulkProcess = useCallback(
    async (withdrawalIds: number[], action: string, notes: string) => {
      try {
        const token = getCsrfTokenFromCookie();

        const response = await axios.post(
          `${API_URL}/admin/pencairan/bulk-process`,
          {
            withdrawal_ids: withdrawalIds,
            action: action,
            catatan_admin: notes,
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
        }
        return false;
      } catch (error: any) {
        console.error("Error bulk processing:", error);
        toast.error(
          error.response?.data?.message || "Failed to process withdrawals"
        );
        return false;
      }
    },
    []
  );

  return {
    pencairans,
    loading,
    totalPages,
    totalPencairans,
    selectedPencairan,
    isDetailOpen,
    stats,
    setIsDetailOpen,
    fetchPencairans,
    fetchStats,
    getPencairanDetails,
    processPencairan,
    addComment,
    bulkProcess,
  };
};
