"use client";

import { useState } from "react";
import { usePaymentManagement } from "./hooks/usePaymentManagement";
import { usePaymentFilters } from "./hooks/usePaymentFilters";
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
import PaymentFilters from "./components/PaymentFilters";
import PaymentTable from "./components/PaymentTable";
import PaymentDetailsDialog from "./components/PaymentDetailsDialog";
import StatusUpdateDialog from "./components/StatusUpdateDialog";
import VerifyPaymentDialog from "./components/VerifyPaymentDialog";
import RefundDialog from "./components/RefundDialog";
import PaymentStats from "./components/PaymentStats";

const PaymentManagementPage = () => {
  const {
    selectedPayment,
    isDetailOpen,
    setIsDetailOpen,
    isVerifyDialogOpen,
    setIsVerifyDialogOpen,
    isStatusUpdateDialogOpen,
    setIsStatusUpdateDialogOpen,
    isRefundDialogOpen,
    setIsRefundDialogOpen,
    fetchPayments,
    fetchStats,
    getPaymentDetails,
    updatePaymentStatus,
    verifyPaymentManually,
    processRefund,
    stats,
  } = usePaymentManagement();

  const { 
    filters, 
    updateFilters, 
    resetFilters,
    payments,
    loading,
    totalPages,
    totalPayments,
  } = usePaymentFilters();

  const [newStatus, setNewStatus] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [refundReason, setRefundReason] = useState("");
  const [refundAmount, setRefundAmount] = useState<number | null>(null);
  const [isFullRefund, setIsFullRefund] = useState(true);

  // Fetch stats when page loads
  useState(() => {
    fetchStats();
  });

  // Handle status update
  const handleUpdateStatus = async () => {
    if (!selectedPayment || !newStatus) return;
    
    const success = await updatePaymentStatus(
      selectedPayment.kode_tagihan,
      newStatus,
      adminNotes
    );
    
    if (success) {
      setIsStatusUpdateDialogOpen(false);
      setNewStatus("");
      setAdminNotes("");
      fetchPayments(filters); // Refresh the payment list
    }
  };

  // Handle manual verification
  const handleVerifyPayment = async () => {
    if (!selectedPayment) return;
    
    const success = await verifyPaymentManually(
      selectedPayment.kode_tagihan,
      adminNotes
    );
    
    if (success) {
      setIsVerifyDialogOpen(false);
      setAdminNotes("");
      fetchPayments(filters); // Refresh the payment list
    }
  };

  // Handle refund processing
  const handleProcessRefund = async () => {
    if (!selectedPayment || !refundReason) return;
    
    const success = await processRefund(
      selectedPayment.kode_tagihan,
      refundReason,
      isFullRefund ? null : refundAmount,
      isFullRefund
    );
    
    if (success) {
      setIsRefundDialogOpen(false);
      setRefundReason("");
      setRefundAmount(null);
      setIsFullRefund(true);
      fetchPayments(filters); // Refresh the payment list
    }
  };

  // Handler for opening status update dialog
  const handleOpenStatusUpdateDialog = (status: string) => {
    setNewStatus(status);
    setIsStatusUpdateDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">Payment Management</CardTitle>
            <CardDescription>
              Monitor and manage customer payments
            </CardDescription>
          </div>
          <Button onClick={() => fetchPayments(filters)} size="sm" variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {/* Payment stats component */}
          {stats && <PaymentStats stats={stats} />}

          {/* Payment filters component */}
          <PaymentFilters
            filters={filters}
            updateFilters={updateFilters}
            resetFilters={resetFilters}
          />

          {/* Payments table component */}
          <PaymentTable
            payments={payments}
            loading={loading}
            totalPages={totalPages}
            totalPayments={totalPayments}
            filters={filters}
            updateFilters={updateFilters}
            resetFilters={resetFilters}
            onViewDetails={getPaymentDetails}
          />
        </CardContent>
      </Card>

      {/* Payment details dialog component */}
      <PaymentDetailsDialog
        isOpen={isDetailOpen}
        setIsOpen={setIsDetailOpen}
        selectedPayment={selectedPayment}
        onUpdateStatus={handleOpenStatusUpdateDialog}
        onVerifyPayment={() => setIsVerifyDialogOpen(true)}
        onRefundPayment={() => setIsRefundDialogOpen(true)}
      />

      {/* Status update dialog component */}
      <StatusUpdateDialog
        isOpen={isStatusUpdateDialogOpen}
        setIsOpen={setIsStatusUpdateDialogOpen}
        status={newStatus}
        notes={adminNotes}
        setNotes={setAdminNotes}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Verify payment dialog component */}
      <VerifyPaymentDialog
        isOpen={isVerifyDialogOpen}
        setIsOpen={setIsVerifyDialogOpen}
        notes={adminNotes}
        setNotes={setAdminNotes}
        onVerifyPayment={handleVerifyPayment}
      />

      {/* Refund dialog component */}
      <RefundDialog
        isOpen={isRefundDialogOpen}
        setIsOpen={setIsRefundDialogOpen}
        reason={refundReason}
        setReason={setRefundReason}
        amount={refundAmount}
        setAmount={setRefundAmount}
        isFullRefund={isFullRefund}
        setIsFullRefund={setIsFullRefund}
        totalAmount={selectedPayment?.total_tagihan || 0}
        onProcessRefund={handleProcessRefund}
      />
    </div>
  );
};

export default PaymentManagementPage;
