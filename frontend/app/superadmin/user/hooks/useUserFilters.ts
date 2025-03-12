"use client";

import { useState, useEffect, useMemo } from "react";
import { User, ITEMS_PER_PAGE } from "../types";

export const useUserFilters = (users: User[]) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<boolean | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Apply filters
  const filteredUsers = useMemo(() => {
    let result = [...users];

    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (user) =>
          user.username.toLowerCase().includes(term) ||
          user.name.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term)
      );
    }

    // Apply role filter
    if (roleFilter !== null) {
      result = result.filter((user) => user.role === roleFilter);
    }

    // Apply status filter
    if (statusFilter !== null) {
      result = result.filter((user) => user.is_active === statusFilter);
    }

    // Always exclude superadmin users (role 0)
    result = result.filter((user) => user.role !== 0);

    return result;
  }, [users, searchTerm, roleFilter, statusFilter]);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  }, [filteredUsers]);

  // Get current page items
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredUsers.slice(startIndex, endIndex);
  }, [filteredUsers, currentPage]);

  // Reset to first page when filters change
  useEffect(() => {
    if (currentPage > Math.max(1, totalPages)) {
      setCurrentPage(1);
    }
  }, [filteredUsers, totalPages, currentPage]);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setRoleFilter(null);
    setStatusFilter(null);
  };

  return {
    searchTerm,
    setSearchTerm,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    currentPage,
    setCurrentPage,
    totalPages,
    filteredUsers,
    paginatedUsers,
    clearFilters,
  };
};
