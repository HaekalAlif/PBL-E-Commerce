import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";
import { Order, OrderStats } from "../types";

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderStats, setOrderStats] = useState<OrderStats>({
    new_orders: 0,
    processing_orders: 0,
    shipped_orders: 0,
    completed_orders: 0,
  });

  const fetchOrders = async (status = "all") => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/seller/orders`,
        { params: { status } }
      );

      if (response.data.status === "success") {
        // Sort orders by created_at in descending order (newest first)
        const sortedOrders = response.data.data.sort(
          (a: Order, b: Order) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setOrders(sortedOrders);
        setFilteredOrders(sortedOrders);
      } else {
        setError("Failed to load orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("An error occurred while fetching orders");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderStats = async () => {
    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/seller/orders/stats`
      );

      if (response.data.status === "success") {
        setOrderStats(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching order stats:", error);
    }
  };

  const refreshOrders = () => {
    fetchOrders();
    fetchOrderStats();
  };

  return {
    orders,
    filteredOrders,
    setFilteredOrders,
    loading,
    error,
    orderStats,
    fetchOrders,
    fetchOrderStats,
    refreshOrders,
  };
};
