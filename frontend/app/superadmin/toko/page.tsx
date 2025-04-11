"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStoreManagement } from "./hooks/useStoreManagement";
import { useStoreFilters } from "./hooks/useStoreFilters";
import { Store } from "./types";
import StoreTable from "./components/StoreTable";
import StoreFilters from "./components/StoreFilters";
import StoreFormDialog from "./components/StoreFormDialog";
import DeleteConfirmDialog from "./components/DeleteConfirmDialog";
import StoreStats from "./components/StoreStats";

export default function StoreManagementPage() {
  const {
    stores,
    loading,
    selectedStore,
    setSelectedStore,
    fetchStores,
    createStore,
    updateStore,
    deleteStore,
    restoreStore,
  } = useStoreManagement();

  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    currentPage,
    setCurrentPage,
    totalPages,
    totalStores,
    paginatedStores,
    clearFilters,
  } = useStoreFilters(stores);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Calculate store statistics
  const storeStats = useMemo(() => {
    return {
      totalStores: stores.length,
      activeStores: stores.filter((store) => !store.is_deleted).length,
      pendingStores: stores.filter(
        (store) => !store.is_verified && !store.is_deleted
      ).length,
      deletedStores: stores.filter((store) => store.is_deleted).length,
    };
  }, [stores]);

  // Fetch stores on component mount
  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  // Handle creating a new store
  const handleCreateStore = async (formData: any) => {
    const success = await createStore(formData);
    if (success) {
      setIsCreateDialogOpen(false);
    }
  };

  // Handle editing a store
  const handleEditStore = async (formData: any) => {
    if (!selectedStore) return;

    const success = await updateStore(selectedStore.id_toko, formData);
    if (success) {
      setIsEditDialogOpen(false);
    }
  };

  // Handle deleting a store
  const handleDeleteStore = async () => {
    if (!selectedStore) return;

    const success = await deleteStore(selectedStore.id_toko);
    if (success) {
      setIsDeleteDialogOpen(false);
    }
  };

  // Handle restoring a store
  const handleRestoreStore = async (store: Store) => {
    await restoreStore(store.id_toko);
  };

  // Check if any filters are active
  const hasActiveFilters = searchTerm !== "" || statusFilter !== null;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">Store Management</CardTitle>
          <div className="flex space-x-2">
            <Button onClick={fetchStores} size="sm" variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Stats section */}
          <StoreStats stats={storeStats} />

          <StoreFilters
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            onSearchChange={setSearchTerm}
            onStatusFilterChange={setStatusFilter}
            onClearFilters={clearFilters}
          />

          <StoreTable
            stores={paginatedStores}
            totalStores={totalStores}
            currentPage={currentPage}
            totalPages={totalPages}
            isLoading={loading}
            onPageChange={setCurrentPage}
            onEdit={(store) => {
              setSelectedStore(store);
              setIsEditDialogOpen(true);
            }}
            onDelete={(store) => {
              setSelectedStore(store);
              setIsDeleteDialogOpen(true);
            }}
            onRestore={handleRestoreStore}
            onClearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </CardContent>
      </Card>

      {/* Create Store Dialog */}
      <StoreFormDialog
        isOpen={isCreateDialogOpen}
        isCreateMode={true}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreateStore}
      />

      {/* Edit Store Dialog */}
      <StoreFormDialog
        isOpen={isEditDialogOpen}
        isCreateMode={false}
        store={selectedStore}
        onClose={() => setIsEditDialogOpen(false)}
        onSubmit={handleEditStore}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        store={selectedStore}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteStore}
      />
    </div>
  );
}
