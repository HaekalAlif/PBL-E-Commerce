"use client";

import { useState, useEffect, useMemo } from "react";
import { Kategori, ITEMS_PER_PAGE } from "../types";

export const useKategoriFilters = (kategori: Kategori[]) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<boolean | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Apply filters
  const filteredKategori = useMemo(() => {
    let result = [...kategori];

    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          item.nama_kategori.toLowerCase().includes(term) ||
          item.slug.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (statusFilter !== null) {
      result = result.filter((item) => item.is_active === statusFilter);
    }

    return result.filter((item) => !item.is_deleted);
  }, [kategori, searchTerm, statusFilter]);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(filteredKategori.length / ITEMS_PER_PAGE);
  }, [filteredKategori]);

  // Get current page items
  const paginatedKategori = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredKategori.slice(startIndex, endIndex);
  }, [filteredKategori, currentPage]);

  // Reset to first page when filters change
  useEffect(() => {
    if (currentPage > Math.max(1, totalPages)) {
      setCurrentPage(1);
    }
  }, [filteredKategori, totalPages, currentPage]);

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
    filteredKategori,
    paginatedKategori,
    clearFilters,
  };
};
