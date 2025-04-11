"use client";

import { useState, useEffect } from "react";
import { useOrderManagement } from "./hooks/useOrderManagement";
import { useOrderFilters } from "./hooks/useOrderFilters";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

// Import the components
import OrderFilters from "./components/OrderFilters";
import OrderTable from "./components/OrderTable";
import OrderDetailsDialog from "./components/OrderDetailsDialog";
import StatusUpdateDialog from "./components/StatusUpdateDialog";
import CommentDialog from "./components/CommentDialog";
import OrderStats from "./components/OrderStats";

const OrderManagementPage = () => {
  const {
    selectedOrder,
    isDetailOpen,
    setIsDetailOpen,
    fetchOrders,
    getOrderDetails,
    updateOrderStatus,
    addComment,
    fetchStats,
    stats,
  } = useOrderManagement();

  const { 
    filters, 
    updateFilters, 
    resetFilters,
    orders,
    loading,
    totalPages,
    totalOrders,
  } = useOrderFilters();

  const [statusUpdateDialogOpen, setStatusUpdateDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [comment, setComment] = useState("");

  // Fetch stats when page loads
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Handle status update
  const handleUpdateStatus = async () => {
    if (!selectedOrder || !newStatus) return;
    
    const success = await updateOrderStatus(
      selectedOrder.kode_pembelian,
      newStatus,
      adminNotes
    );
    
    if (success) {
      setStatusUpdateDialogOpen(false);
      setNewStatus("");
      setAdminNotes("");
      fetchOrders(filters); // Refresh the order list
    }
  };

  // Handle comment submission
  const handleAddComment = async () => {
    if (!selectedOrder || !comment) return;
    
    const success = await addComment(selectedOrder.kode_pembelian, comment);
    
    if (success) {
      setCommentDialogOpen(false);
      setComment("");
    }
  };

  // Handler for opening status update dialog
  const handleOpenStatusUpdateDialog = (status: string) => {
    setNewStatus(status);
    setStatusUpdateDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">Order Management</CardTitle>
            <CardDescription>
              Manage and monitor customer orders
            </CardDescription>
          </div>
          <Button onClick={() => fetchOrders(filters)} size="sm" variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {/* Order stats component */}
          {stats && <OrderStats stats={stats} />}

          {/* Order filters component */}
          <OrderFilters
            filters={filters}
            updateFilters={updateFilters}
            resetFilters={resetFilters}
          />

          {/* Orders table component */}
          <OrderTable
            orders={orders}
            loading={loading}
            totalPages={totalPages}
            totalOrders={totalOrders}
            filters={filters}
            updateFilters={updateFilters}
            resetFilters={resetFilters}
            onViewDetails={getOrderDetails}
          />
        </CardContent>
      </Card>

      {/* Order details dialog component */}
      <OrderDetailsDialog
        isOpen={isDetailOpen}
        setIsOpen={setIsDetailOpen}
        selectedOrder={selectedOrder}
        onUpdateStatus={handleOpenStatusUpdateDialog}
        onAddComment={() => setCommentDialogOpen(true)}
      />

      {/* Status update dialog component */}
      <StatusUpdateDialog
        isOpen={statusUpdateDialogOpen}
        setIsOpen={setStatusUpdateDialogOpen}
        status={newStatus}
        notes={adminNotes}
        setNotes={setAdminNotes}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Comment dialog component */}
      <CommentDialog
        isOpen={commentDialogOpen}
        setIsOpen={setCommentDialogOpen}
        comment={comment}
        setComment={setComment}
        onAddComment={handleAddComment}
      />
    </div>
  );
};

export default OrderManagementPage;
