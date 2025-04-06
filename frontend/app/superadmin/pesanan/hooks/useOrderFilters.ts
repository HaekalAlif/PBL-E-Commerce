import { useState, useCallback, useEffect } from "react";
import { OrderFilters } from "../types";
import { useOrderManagement } from "./useOrderManagement";

export const useOrderFilters = () => {
  // Initial filters state
  const [filters, setFilters] = useState<OrderFilters>({
    search: "",
    status: "",
    payment_status: "",
    date_from: "",
    date_to: "",
    page: 1,
    per_page: 10,
  });

  // Get order management functions
  const { orders, loading, totalPages, totalOrders, fetchOrders } =
    useOrderManagement();

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<OrderFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      // Reset to page 1 when changing filters unless page is explicitly set
      page: newFilters.hasOwnProperty("page") ? newFilters.page! : 1,
    }));
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilters({
      search: "",
      status: "",
      payment_status: "",
      date_from: "",
      date_to: "",
      page: 1,
      per_page: 10,
    });
  }, []);

  // Fetch orders when filters change
  useEffect(() => {
    fetchOrders(filters);
  }, [filters, fetchOrders]);

  return {
    filters,
    updateFilters,
    resetFilters,
    orders,
    loading,
    totalPages,
    totalOrders,
  };
};
