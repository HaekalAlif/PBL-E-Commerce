"use client";

import { useState, useEffect, useMemo } from "react";
import { Product, ITEMS_PER_PAGE } from "../types";

export const useProductFilters = (products: Product[]) => {
  // Filter states
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [priceSort, setPriceSort] = useState<string | null>(null);
  const [showDeleted, setShowDeleted] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Apply filters client-side
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by active/deleted status
    result = result.filter((product) => product.is_deleted === showDeleted);

    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (product) =>
          product.nama_barang.toLowerCase().includes(term) ||
          (product.deskripsi_barang && product.deskripsi_barang.toLowerCase().includes(term)) ||
          (product.slug && product.slug.toLowerCase().includes(term))
      );
    }

    // Apply category filter
    if (categoryFilter !== null) {
      result = result.filter((product) => product.id_kategori === categoryFilter);
    }

    // Apply status filter
    if (statusFilter !== null) {
      result = result.filter((product) => product.status_barang === statusFilter);
    }

    // Apply price sort
    if (priceSort !== null) {
      result.sort((a, b) => {
        if (priceSort === "highest") {
          return b.harga - a.harga;
        } else {
          return a.harga - b.harga;
        }
      });
    }

    return result;
  }, [products, searchTerm, categoryFilter, statusFilter, priceSort, showDeleted]);

  // Reset to first page when filters change
  useEffect(() => {
    if (currentPage > 1) {
      setCurrentPage(1);
    }
  }, [searchTerm, categoryFilter, statusFilter, priceSort, showDeleted]);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  }, [filteredProducts]);

  // Get current page items
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage]);

  // Clear all filters except showDeleted
  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter(null);
    setStatusFilter(null);
    setPriceSort(null);
    setCurrentPage(1);
  };

  // Check if any filter is active
  const hasActiveFilters = searchTerm !== "" || 
    categoryFilter !== null || 
    statusFilter !== null || 
    priceSort !== null;

  return {
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    statusFilter,
    setStatusFilter,
    priceSort, 
    setPriceSort,
    showDeleted,
    setShowDeleted,
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems: filteredProducts.length,
    filteredProducts,
    paginatedProducts,
    hasActiveFilters,
    clearFilters,
  };
};
