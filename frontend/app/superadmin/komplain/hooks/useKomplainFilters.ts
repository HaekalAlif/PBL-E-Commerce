import { useState, useCallback, useEffect } from "react";
import { KomplainFilterValues } from "../types";
import { useKomplainManagement } from "./useKomplainManagement";

export const useKomplainFilters = () => {
  const [filters, setFilters] = useState<KomplainFilterValues>({
    search: "",
    status: "",
    date_from: "",
    date_to: "",
    page: 1,
    per_page: 10,
  });

  const { komplains, loading, totalPages, totalKomplains, fetchKomplains } =
    useKomplainManagement();

  const updateFilters = useCallback((newFilters: Partial<KomplainFilterValues>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: newFilters.hasOwnProperty("page") ? newFilters.page! : 1,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      search: "",
      status: "",
      date_from: "",
      date_to: "",
      page: 1,
      per_page: 10,
    });
  }, []);

  useEffect(() => {
    fetchKomplains(filters);
  }, [filters, fetchKomplains]);

  return {
    filters,
    updateFilters,
    resetFilters,
    komplains,
    loading,
    totalPages,
    totalKomplains,
  };
};
