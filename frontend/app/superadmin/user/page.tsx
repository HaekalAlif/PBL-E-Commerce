"use client";

import { useEffect, useState, useMemo } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Import custom components
import UserFilters from "./components/UserFilters";
import UserTable from "./components/UserTable";
import UserFormDialog from "./components/UserFormDialog";
import DeleteConfirmDialog from "./components/DeleteConfirmDialog";
import UserStats from "./components/UserStats";

// Import custom hooks
import { useUserManagement } from "./hooks/useUserManagement";
import { useUserFilters } from "./hooks/useUserFilters";

// Import types
import { User, UserFormData } from "./types";

export default function UserManagementPage() {
  // User management state and actions
  const {
    users,
    loading,
    selectedUser,
    setSelectedUser,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  } = useUserManagement();

  // Filtering and pagination
  const {
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
  } = useUserFilters(users);

  // Dialog states
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(true);

  // Calculate user statistics
  const userStats = useMemo(() => {
    return {
      totalUsers: users.length,
      activeUsers: users.filter((user) => !user.is_deleted).length,
      adminCount: users.filter((user) =>
        ["admin", "superadmin"].includes(user.role_name)
      ).length,
      sellerCount: users.filter((user) => user.has_store).length,
    };
  }, [users]);

  // Load users on initial render
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handlers for user actions
  const handleOpenCreateDialog = () => {
    setIsCreateMode(true);
    setSelectedUser(null);
    setIsFormDialogOpen(true);
  };

  const handleOpenEditDialog = (user: User) => {
    setIsCreateMode(false);
    setSelectedUser(user);
    setIsFormDialogOpen(true);
  };

  const handleOpenDeleteDialog = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (formData: UserFormData) => {
    let success = false;

    if (isCreateMode) {
      success = await createUser(formData);
    } else if (selectedUser) {
      // Make sure we have a valid email string
      success = await updateUser(selectedUser.id_user, formData);
    }

    if (success) {
      setIsFormDialogOpen(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedUser) {
      const success = await deleteUser(selectedUser.id_user);
      if (success) {
        setIsDeleteDialogOpen(false);
      }
    }
  };

  const hasActiveFilters =
    searchTerm !== "" || roleFilter !== null || statusFilter !== null;

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">User Management</CardTitle>
          <div className="flex space-x-2">
            <Button onClick={fetchUsers} size="sm" variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={handleOpenCreateDialog} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {/* Stats section */}
          <UserStats stats={userStats} />

          {/* Search and filter section */}
          <UserFilters
            searchTerm={searchTerm}
            roleFilter={roleFilter}
            statusFilter={statusFilter}
            onSearchChange={setSearchTerm}
            onRoleFilterChange={setRoleFilter}
            onStatusFilterChange={setStatusFilter}
            onClearFilters={clearFilters}
          />

          {/* User table with pagination */}
          <UserTable
            users={paginatedUsers}
            totalUsers={filteredUsers.length}
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

      {/* Create/Edit User Dialog */}
      <UserFormDialog
        isOpen={isFormDialogOpen}
        isCreateMode={isCreateMode}
        user={selectedUser}
        onClose={() => setIsFormDialogOpen(false)}
        onSubmit={handleFormSubmit}
      />

      {/* Delete confirmation dialog */}
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        user={selectedUser}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
