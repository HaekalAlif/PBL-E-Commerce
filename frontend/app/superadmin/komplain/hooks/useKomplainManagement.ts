import { useState, useCallback } from "react";
import axios from "@/lib/axios"; // Import custom axios instance
import { toast } from "sonner";
import { getCsrfTokenFromCookie } from "@/lib/axios"; // Import helper function
import type { Komplain, KomplainStats, KomplainFilterValues } from "../types";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const useKomplainManagement = () => {
  const router = useRouter();
  const [komplains, setKomplains] = useState<Komplain[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalKomplains, setTotalKomplains] = useState(0);
  const [selectedKomplain, setSelectedKomplain] = useState<Komplain | null>(
    null
  );
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [stats, setStats] = useState<KomplainStats | null>(null);

  const fetchKomplains = useCallback(
    async (filters: Partial<KomplainFilterValues> = {}) => {
      setLoading(true);
      try {
        await getCsrfTokenFromCookie();

        // Remove empty string values from filters
        const cleanFilters = Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v != null && v !== "")
        );

        const response = await axios.get(`${API_URL}/admin/komplain`, {
          params: cleanFilters,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: true,
        });

        if (response.data.status === "success") {
          setKomplains(response.data.data.data || []);
          setTotalPages(response.data.data.last_page || 1);
          setTotalKomplains(response.data.data.total || 0);
        } else {
          toast.error(response.data.message || "Failed to fetch complaints");
          setKomplains([]);
        }
      } catch (error: any) {
        console.error("Error fetching complaints:", error);
        toast.error(
          error.response?.data?.message || "Failed to load complaints"
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
      const response = await axios.get(`${API_URL}/admin/komplain/stats`, {
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
      console.error("Error fetching complaint stats:", error);
    }
  }, []);

  const getKomplainDetails = useCallback(async (id: number) => {
    try {
      setLoading(true);
      await getCsrfTokenFromCookie();

      console.log("Fetching complaint details:", id); // Debug log

      const response = await axios.get(`${API_URL}/admin/komplain/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        withCredentials: true,
      });

      console.log("Complaint details response:", response.data); // Debug log

      if (response.data.status === "success" && response.data.data) {
        setSelectedKomplain(response.data.data);
        setIsDetailOpen(true);
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to fetch details");
      }
    } catch (error: any) {
      console.error("Error fetching complaint details:", error);
      console.error("Error response:", error.response?.data);

      toast.error(
        error.response?.data?.message || "Failed to load complaint details"
      );
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const processKomplain = useCallback(
    async (id: number, status: string, notes: string) => {
      try {
        const token = getCsrfTokenFromCookie();

        const response = await axios.post(
          `${API_URL}/admin/komplain/${id}/process`,
          {
            status: status,
            admin_notes: notes,
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
          setSelectedKomplain(response.data.data);
          return true;
        }
        return false;
      } catch (error: any) {
        console.error("Error processing complaint:", error);
        toast.error(
          error.response?.data?.message || "Gagal memproses komplain"
        );
        return false;
      }
    },
    []
  );

  return {
    komplains,
    loading,
    totalPages,
    totalKomplains,
    selectedKomplain,
    isDetailOpen,
    stats,
    setIsDetailOpen,
    fetchKomplains,
    fetchStats,
    getKomplainDetails,
    processKomplain,
  };
};
