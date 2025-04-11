"use client";

import { useEffect, useState, useMemo } from "react";
import { RefreshCw, Archive, Inbox } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import components
import ProductFilters from "./components/ProductFilters";
import ProductTable from "./components/ProductTable";
import ProductFormDialog from "./components/ProductFormDialog";
import DeleteConfirmDialog from "./components/DeleteConfirmDialog";
import ProductDetailDialog from "./components/ProductDetailDialog";
import ProductStats from "./components/ProductStats";

// Import hooks
import { useProductManagement } from "./hooks/useProductManagement";
import { useProductFilters } from "./hooks/useProductFilters";

export default function ProductManagementPage() {
  const {
    products,
    loading,
    categories,
    selectedProduct,
    setSelectedProduct,
    fetchProducts,
    fetchCategories,
    getProductDetails,
    updateProduct,
    softDeleteProduct,
    restoreProduct,
    deleteProduct,
  } = useProductManagement();

  // Apply filters using the user management pattern (client-side)
  const {
    searchTerm,
    categoryFilter,
    statusFilter,
    priceSort,
    showDeleted,
    setShowDeleted,
    currentPage,
    totalPages,
    totalItems,
    paginatedProducts,
    hasActiveFilters,
    setSearchTerm,
    setCategoryFilter,
    setStatusFilter,
    setPriceSort,
    setCurrentPage,
    clearFilters,
  } = useProductFilters(products);

  // Dialog states
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isHardDelete, setIsHardDelete] = useState(false);

  // Calculate product statistics
  const productStats = useMemo(() => {
    return {
      totalProducts: products.length,
      activeProducts: products.filter((product) => !product.is_deleted).length,
      deletedProducts: products.filter((product) => product.is_deleted).length,
      totalCategories: categories.length,
    };
  }, [products, categories]);

  // Load initial data
  useEffect(() => {
    const initData = async () => {
      await fetchCategories();
      await fetchProducts();
    };

    initData();
  }, [fetchCategories, fetchProducts]);

  // Action handlers
  const handleRefresh = () => fetchProducts();

  const handleOpenEditDialog = (product: any) => {
    setSelectedProduct(product);
    setIsFormDialogOpen(true);
  };

  const handleOpenDetailDialog = async (product: any) => {
    const fullProduct = await getProductDetails(product.id_barang);
    if (fullProduct) {
      setSelectedProduct(fullProduct);
      setIsDetailDialogOpen(true);
    }
  };

  const handleOpenDeleteDialog = (product: any, hardDelete = false) => {
    setSelectedProduct(product);
    setIsHardDelete(hardDelete);
    setIsDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (formData: any) => {
    if (selectedProduct) {
      const success = await updateProduct(selectedProduct.id_barang, formData);
      if (success) {
        setIsFormDialogOpen(false);
        await fetchProducts();
      }
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedProduct) {
      let success;
      if (isHardDelete) {
        success = await deleteProduct(selectedProduct.id_barang);
      } else if (selectedProduct.is_deleted) {
        success = await restoreProduct(selectedProduct.id_barang);
      } else {
        success = await softDeleteProduct(selectedProduct.id_barang);
      }

      if (success) {
        setIsDeleteDialogOpen(false);
        await fetchProducts();
      }
    }
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">
            Product Management
          </CardTitle>
          <div className="flex space-x-2">
            <Tabs
              value={showDeleted ? "deleted" : "active"}
              onValueChange={(value) => setShowDeleted(value === "deleted")}
              className="mr-4"
            >
              <TabsList>
                <TabsTrigger value="active" className="flex items-center gap-1">
                  <Inbox className="h-4 w-4" />
                  Active Products
                </TabsTrigger>
                <TabsTrigger
                  value="deleted"
                  className="flex items-center gap-1"
                >
                  <Archive className="h-4 w-4" />
                  Deleted Products
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <Button onClick={handleRefresh} size="sm" variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {/* Stats section */}
          <ProductStats stats={productStats} />

          {/* Search and filter section */}
          <ProductFilters
            searchTerm={searchTerm}
            categoryFilter={categoryFilter}
            statusFilter={statusFilter}
            priceSort={priceSort}
            categories={categories}
            onSearchChange={setSearchTerm}
            onCategoryFilterChange={setCategoryFilter}
            onStatusFilterChange={setStatusFilter}
            onPriceSortChange={setPriceSort}
            onClearFilters={clearFilters}
            onRefresh={handleRefresh}
          />

          {/* Product table with pagination */}
          <ProductTable
            products={paginatedProducts}
            totalProducts={totalItems}
            currentPage={currentPage}
            totalPages={totalPages}
            isLoading={loading}
            onPageChange={setCurrentPage}
            onEdit={handleOpenEditDialog}
            onDelete={handleOpenDeleteDialog}
            onRestore={handleOpenDeleteDialog}
            onView={handleOpenDetailDialog}
            onPermanentDelete={(product) =>
              handleOpenDeleteDialog(product, true)
            }
            onClearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
            showDeleted={showDeleted}
          />
        </CardContent>
      </Card>

      {/* Edit Product Dialog */}
      <ProductFormDialog
        isOpen={isFormDialogOpen}
        product={selectedProduct}
        categories={categories}
        onClose={() => setIsFormDialogOpen(false)}
        onSubmit={handleFormSubmit}
      />

      {/* Product Detail Dialog */}
      {isDetailDialogOpen && (
        <ProductDetailDialog
          isOpen={isDetailDialogOpen}
          product={selectedProduct}
          onClose={() => setIsDetailDialogOpen(false)}
          onEdit={() => {
            setIsDetailDialogOpen(false);
            setIsFormDialogOpen(true);
          }}
        />
      )}

      {/* Delete confirmation dialog */}
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        product={selectedProduct}
        isHardDelete={isHardDelete}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
