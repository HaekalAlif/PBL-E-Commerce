"use client";

import { ProductHeader } from "./components/ProductHeader";
import { ProductList } from "./components/ProductList";
import { ProductSkeleton } from "./components/ProductSkeleton";
import { useProducts } from "./hooks/useProducts";
import { useState } from "react";

export default function ProductPage() {
  const {
    products,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    pagination,
    handlePageChange,
    handleDelete,
    refetchProducts,
  } = useProducts();

  // Add loading state during deletion
  const [isDeletingProduct, setIsDeletingProduct] = useState(false);

  // Wrap handleDelete to manage loading state
  const handleDeleteWithLoading = async (id: number) => {
    setIsDeletingProduct(true);
    try {
      await handleDelete(id);
      await refetchProducts(); // Ensure data is refreshed after deletion
    } finally {
      setIsDeletingProduct(false);
    }
  };

  if (loading) {
    return <ProductSkeleton />;
  }

  return (
    <div className="container mx-auto space-y-6">
      <ProductHeader />

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-200 text-sm">
          {error}
        </div>
      )}

      <ProductList
        products={products}
        searchQuery={searchQuery}
        activeFilter={activeFilter}
        pagination={pagination}
        onSearch={setSearchQuery}
        onFilterChange={setActiveFilter}
        onPageChange={handlePageChange}
        onDelete={handleDeleteWithLoading}
        refetchProducts={refetchProducts}
      />
    </div>
  );
}
