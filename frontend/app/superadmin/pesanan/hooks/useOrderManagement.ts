import { useState, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import { getCsrfToken } from "@/lib/axios";
import { Order, OrderStats } from "../types";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const useOrderManagement = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [stats, setStats] = useState<OrderStats | null>(null);

  // Fetch orders with filters
  const fetchOrders = useCallback(
    async (filters: any = {}) => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/admin/pesanan`, {
          params: filters,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: true,
        });

        if (response.data.status === "success") {
          setOrders(response.data.data.data || []);
          setTotalPages(response.data.data.last_page || 1);
          setTotalOrders(response.data.data.total || 0);
        } else {
          toast.error(response.data.message || "Failed to fetch orders");
          setOrders([]);
        }
      } catch (error: any) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to load orders. Please try again later.");

        // Handle unauthorized access
        if (error.response?.status === 401) {
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  // Fetch order stats
  const fetchStats = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/pesanan/stats`, {
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
      console.error("Error fetching order stats:", error);
    }
  }, []);

  // Get order details
  const getOrderDetails = useCallback(async (kode: string) => {
    try {
      const response = await axios.get(`${API_URL}/admin/pesanan/${kode}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        withCredentials: true,
      });

      if (response.data.status === "success") {
        setSelectedOrder(response.data.data);
        setIsDetailOpen(true);
        return response.data.data;
      } else {
        toast.error(response.data.message || "Failed to fetch order details");
        return null;
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      toast.error("Failed to load order details");
      return null;
    }
  }, []);

  // Update order status
  const updateOrderStatus = useCallback(
    async (kode: string, status: string, adminNotes?: string) => {
      try {
        await getCsrfToken();

        const response = await axios.put(
          `${API_URL}/admin/pesanan/${kode}/status`,
          {
            status,
            admin_notes: adminNotes,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            withCredentials: true,
          }
        );

        if (response.data.status === "success") {
          toast.success("Order status updated successfully");
          // Refresh order details
          await getOrderDetails(kode);
          return true;
        } else {
          toast.error(response.data.message || "Failed to update order status");
          return false;
        }
      } catch (error: any) {
        console.error("Error updating order status:", error);
        toast.error(
          error.response?.data?.message || "Failed to update order status"
        );
        return false;
      }
    },
    [getOrderDetails]
  );

  // Add comment to order
  const addComment = useCallback(
    async (kode: string, comment: string) => {
      try {
        await getCsrfToken();

        const response = await axios.post(
          `${API_URL}/admin/pesanan/${kode}/comment`,
          {
            comment,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            withCredentials: true,
          }
        );

        if (response.data.status === "success") {
          toast.success("Comment added successfully");
          // Refresh order details
          await getOrderDetails(kode);
          return true;
        } else {
          toast.error(response.data.message || "Failed to add comment");
          return false;
        }
      } catch (error: any) {
        console.error("Error adding comment:", error);
        toast.error(error.response?.data?.message || "Failed to add comment");
        return false;
      }
    },
    [getOrderDetails]
  );

  return {
    orders,
    loading,
    totalPages,
    totalOrders,
    selectedOrder,
    isDetailOpen,
    stats,
    setIsDetailOpen,
    fetchOrders,
    fetchStats,
    getOrderDetails,
    updateOrderStatus,
    addComment,
  };
};
