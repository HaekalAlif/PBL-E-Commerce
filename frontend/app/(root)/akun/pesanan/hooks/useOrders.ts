import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";
import { OrderItem } from "../types";

export const useOrders = () => {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/purchases`
      );

      if (response.data.status === "success") {
        if (Array.isArray(response.data.data)) {
          const nonDraftOrders = response.data.data.filter(
            (order: OrderItem) => order.status_pembelian !== "Draft"
          );

          nonDraftOrders.sort(
            (a: OrderItem, b: OrderItem) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          );

          setOrders(nonDraftOrders);
        } else {
          setOrders([]);
          setError("Invalid data format received from server");
        }
      } else {
        throw new Error("Failed to load orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    orders,
    loading,
    error,
    refetchOrders: fetchOrders,
  };
};
