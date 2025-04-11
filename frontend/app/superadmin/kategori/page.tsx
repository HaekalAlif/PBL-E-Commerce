"use client";

import { useEffect, useState, useMemo } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Import custom components
import KategoriFilters from "./components/KategoriFilters";
import KategoriTable from "./components/KategoriTable";
import KategoriFormDialog from "./components/KategoriFormDialog";
import DeleteConfirmDialog from "./components/DeleteConfirmDialog";
import CategoryStats from "./components/CategoryStats";

// Import custom hooks
import { useKategoriManagement } from "./hooks/useKategoriManagement";
import { useKategoriFilters } from "./hooks/useKategoriFilters";

// Import types
import { Kategori, KategoriFormData } from "./types";

export default function KategoriPage() {
  // State untuk dialog
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(true);

  // Kategori management state and actions
  const {
    kategori,
    loading,
    selectedKategori,
    setSelectedKategori,
    fetchKategori,
    createKategori,
    updateKategori,
    deleteKategori,
  } = useKategoriManagement();

  // Filtering and pagination
  const {
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
  } = useKategoriFilters(kategori);

  // Calculate category statistics - simplified to just total and active
  const categoryStats = useMemo(() => {
    return {
      totalCategories: kategori.length,
      activeCategories: kategori.filter((cat) => !cat.is_deleted).length,
    };
  }, [kategori]);

  // Load kategori on initial render
  useEffect(() => {
    fetchKategori();
  }, [fetchKategori]);

  // Handlers untuk aksi kategori
  const handleOpenCreateDialog = () => {
    setIsCreateMode(true);
    setSelectedKategori(null);
    setIsFormDialogOpen(true);
  };

  const handleOpenEditDialog = (kategori: Kategori) => {
    setIsCreateMode(false);
    setSelectedKategori(kategori);
    setIsFormDialogOpen(true);
  };

  const handleOpenDeleteDialog = (kategori: Kategori) => {
    setSelectedKategori(kategori);
    setIsDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (formData: KategoriFormData) => {
    let success = false;

    if (isCreateMode) {
      success = await createKategori(formData);
    } else if (selectedKategori) {
      success = await updateKategori(selectedKategori.id_kategori, formData);
    }

    if (success) {
      setIsFormDialogOpen(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedKategori) {
      const success = await deleteKategori(selectedKategori.id_kategori);
      if (success) {
        setIsDeleteDialogOpen(false);
      }
    }
  };

  const hasActiveFilters = searchTerm !== "" || statusFilter !== null;

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">
            Category Management
          </CardTitle>
          <div className="flex space-x-2">
            <Button onClick={fetchKategori} size="sm" variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={handleOpenCreateDialog} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {/* Stats section */}
          <CategoryStats stats={categoryStats} />

          {/* Search and filter section */}
          <KategoriFilters
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            onSearchChange={setSearchTerm}
            onStatusFilterChange={setStatusFilter}
            onClearFilters={clearFilters}
          />

          {/* Kategori table with pagination */}
          <KategoriTable
            kategori={paginatedKategori}
            totalKategori={filteredKategori.length}
            currentPage={currentPage}
            totalPages={totalPages}
            isLoading={loading}
            onPageChange={setCurrentPage}
            onEdit={handleOpenEditDialog}
            onDelete={handleOpenDeleteDialog}
            onClearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </CardContent>
      </Card>

      {/* Create/Edit Kategori Dialog */}
      <KategoriFormDialog
        isOpen={isFormDialogOpen}
        isCreateMode={isCreateMode}
        kategori={selectedKategori}
        onClose={() => setIsFormDialogOpen(false)}
        onSubmit={handleFormSubmit}
      />

      {/* Delete confirmation dialog */}
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        kategori={selectedKategori}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
