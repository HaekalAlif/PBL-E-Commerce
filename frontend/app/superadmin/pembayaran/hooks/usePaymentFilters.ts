import { useState, useCallback, useEffect } from "react";
import { PaymentFilters } from "../types";
import { usePaymentManagement } from "./usePaymentManagement";

export const usePaymentFilters = () => {
  // Initial filters state
  const [filters, setFilters] = useState<PaymentFilters>({
    search: "",
    status: "",
    payment_method: "",
    date_from: "",
    date_to: "",
    min_amount: undefined,
    max_amount: undefined,
    page: 1,
    per_page: 10,
  });

  // Get payment management functions
  const { payments, loading, totalPages, totalPayments, fetchPayments } =
    usePaymentManagement();

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<PaymentFilters>) => {
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
      payment_method: "",
      date_from: "",
      date_to: "",
      min_amount: undefined,
      max_amount: undefined,
      page: 1,
      per_page: 10,
    });
  }, []);

  // Fetch payments when filters change
  useEffect(() => {
    fetchPayments(filters);
  }, [filters, fetchPayments]);

  return {
    filters,
    updateFilters,
    resetFilters,
    payments,
    loading,
    totalPages,
    totalPayments,
  };
};
