"use client";

import { useState, useEffect, useMemo } from "react";
import { Store } from "../types";

const ITEMS_PER_PAGE = 10;

export const useStoreFilters = (stores: Store[]) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<boolean | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Apply filters
  const filteredStores = useMemo(() => {
    let result = [...stores];

    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter((store) => {
        const storeName = String(store.nama_toko)
          .replace(/0+$/, "")
          .toLowerCase();
        return (
          storeName.includes(term) ||
          store.alamat?.toLowerCase().includes(term) ||
          store.kontak?.toLowerCase().includes(term) ||
          store.user?.name?.toLowerCase().includes(term)
        );
      });
    }

    // Apply status filter
    if (statusFilter !== null) {
      result = result.filter((store) => store.is_active === statusFilter);
    }

    return result;
  }, [stores, searchTerm, statusFilter]);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(filteredStores.length / ITEMS_PER_PAGE);
  }, [filteredStores]);

  // Get current page items
  const paginatedStores = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredStores.slice(startIndex, endIndex);
  }, [filteredStores, currentPage]);

  // Reset to first page when filters change
  useEffect(() => {
    if (currentPage > Math.max(1, totalPages)) {
      setCurrentPage(1);
    }
  }, [filteredStores, totalPages, currentPage]);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter(null);
  };

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    currentPage,
    setCurrentPage,
    totalPages,
    totalStores: filteredStores.length,
    filteredStores,
    paginatedStores,
    clearFilters,
  };
};
