"use client";

import { ProductContent } from "./components/ProductContent";
import { ProductSkeleton } from "./components/ProductSkeleton";
import { useProducts } from "./hooks/useProducts";

export default function ProductPage() {
  const {
    products,
    loading,
    error,
    pagination,
    handlePageChange,
    handleDelete,
  } = useProducts();

  if (loading) {
    return <ProductSkeleton />;
  }

  return (
    <div className="container mx-auto">
      <ProductContent
        products={products}
        error={error}
        pagination={pagination}
        onPageChange={handlePageChange}
        onDelete={handleDelete}
      />
    </div>
  );
}
