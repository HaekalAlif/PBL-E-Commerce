import React from "react";
import { PaymentWithOrder, PaymentStatus } from "../../types";
import { format } from "date-fns";
import { formatRupiah } from "@/lib/formatter";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CreditCard,
  Clock,
  Check,
  X,
  ArrowRight,
  ExternalLink,
  DollarSign,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaymentDetailsDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedPayment: PaymentWithOrder | null;
  onUpdateStatus: (status: string) => void;
  onVerifyPayment: () => void;
  onRefundPayment: () => void;
}

export default function PaymentDetailsDialog({
  isOpen,
  setIsOpen,
  selectedPayment,
  onUpdateStatus,
  onVerifyPayment,
  onRefundPayment,
}: PaymentDetailsDialogProps) {
  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "dd MMM yyyy, HH:mm");
  };

  // Get status badge color based on payment status
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Menunggu":
        return "bg-yellow-100 text-yellow-800";
      case "Dibayar":
        return "bg-green-100 text-green-800";
      case "Expired":
        return "bg-gray-100 text-gray-800";
      case "Gagal":
        return "bg-red-100 text-red-800";
      case "Refund":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Generate valid status options for current payment
  const getValidStatusOptions = () => {
    if (!selectedPayment) return [];

    const currentStatus = selectedPayment.status_pembayaran;

    // Define valid transitions between statuses
    const validTransitions: Record<PaymentStatus, PaymentStatus[]> = {
      "Menunggu": ["Dibayar", "Gagal", "Expired"],
      "Dibayar": ["Refund"],
      "Expired": ["Menunggu"],
      "Gagal": ["Menunggu"],
      "Refund": []
    };

    return validTransitions[currentStatus] || [];
  };

  // Is payment eligible for manual verification?
  const canVerifyManually = () => {
    return selectedPayment?.status_pembayaran === "Menunggu";
  };

  // Is payment eligible for refund?
  const canRefund = () => {
    return selectedPayment?.status_pembayaran === "Dibayar";
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        {selectedPayment ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>Payment #{selectedPayment.kode_tagihan}</span>
                <div className="flex items-center gap-2">
                  <Badge
                    className={getStatusBadgeColor(
                      selectedPayment.status_pembayaran
                    )}
                  >
                    {selectedPayment.status_pembayaran}
                  </Badge>
                </div>
              </DialogTitle>
              <DialogDescription className="flex justify-between">
                <span>Created on {formatDate(selectedPayment.created_at)}</span>
                <span className="font-medium">
                  Order: {selectedPayment.pembelian?.kode_pembelian || "N/A"}
                </span>
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="details">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="details">Payment Details</TabsTrigger>
                <TabsTrigger value="order">Order Information</TabsTrigger>
                <TabsTrigger value="actions">Actions</TabsTrigger>
              </TabsList>

              {/* Content tabs */}
              {/* Details tab */}
              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <h3 className="font-semibold">Payment Information</h3>
                    <div className="text-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <span className="text-muted-foreground">
                          Method:
                        </span>
                        <span className="font-medium">
                          {selectedPayment.metode_pembayaran || "Not specified"}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <span className="text-muted-foreground">
                          Status:
                        </span>
                        <Badge
                          className={getStatusBadgeColor(
                            selectedPayment.status_pembayaran
                          )}
                        >
                          {selectedPayment.status_pembayaran}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <span className="text-muted-foreground">
                          Invoice Code:
                        </span>
                        <span>{selectedPayment.kode_tagihan}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <span className="text-muted-foreground">
                          Transaction ID:
                        </span>
                        <span>{selectedPayment.midtrans_transaction_id || "N/A"}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <span className="text-muted-foreground">
                          Total Amount:
                        </span>
                        <span className="font-medium">
                          {formatRupiah(selectedPayment.total_tagihan)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-semibold">Payment Timeline</h3>
                    <div className="text-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <span className="text-muted-foreground">
                          Created On:
                        </span>
                        <span>{formatDate(selectedPayment.created_at)}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <span className="text-muted-foreground">
                          Deadline:
                        </span>
                        <span>
                          {selectedPayment.deadline_pembayaran
                            ? formatDate(selectedPayment.deadline_pembayaran)
                            : "N/A"}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <span className="text-muted-foreground">
                          Payment Date:
                        </span>
                        <span>
                          {selectedPayment.tanggal_pembayaran
                            ? formatDate(selectedPayment.tanggal_pembayaran)
                            : "Not paid yet"}
                        </span>
                      </div>
                      {selectedPayment.refund_date && (
                        <div className="grid grid-cols-2 gap-2">
                          <span className="text-muted-foreground">
                            Refund Date:
                          </span>
                          <span>{formatDate(selectedPayment.refund_date)}</span>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-2">
                        <span className="text-muted-foreground">
                          Last Updated:
                        </span>
                        <span>{formatDate(selectedPayment.updated_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="font-semibold">Payment Breakdown</h3>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>Subtotal</TableCell>
                        <TableCell className="text-right">
                          {formatRupiah(selectedPayment.total_harga)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Shipping Fee ({selectedPayment.opsi_pengiriman})</TableCell>
                        <TableCell className="text-right">
                          {formatRupiah(selectedPayment.biaya_kirim)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Admin Fee</TableCell>
                        <TableCell className="text-right">
                          {formatRupiah(selectedPayment.biaya_admin)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Total</TableCell>
                        <TableCell className="font-medium text-right">
                          {formatRupiah(selectedPayment.total_tagihan)}
                        </TableCell>
                      </TableRow>
                      {selectedPayment.refund_amount && (
                        <TableRow>
                          <TableCell className="font-medium text-purple-700">Refund Amount</TableCell>
                          <TableCell className="font-medium text-right text-purple-700">
                            - {formatRupiah(selectedPayment.refund_amount)}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {selectedPayment.refund_reason && (
                  <div className="mt-4 bg-purple-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-purple-800 mb-2">
                      Refund Reason
                    </h3>
                    <p className="text-sm text-purple-700">
                      {selectedPayment.refund_reason}
                    </p>
                  </div>
                )}

                {selectedPayment.midtrans_status && (
                  <div className="mt-4 bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-2">
                      Payment Gateway Information
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <span className="text-blue-700">Gateway Status:</span>
                      <span className="text-blue-700">{selectedPayment.midtrans_status}</span>
                      
                      <span className="text-blue-700">Payment Type:</span>
                      <span className="text-blue-700">{selectedPayment.midtrans_payment_type || "N/A"}</span>
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Order tab */}
              <TabsContent value="order" className="space-y-4">
                {selectedPayment.pembelian ? (
                  <>
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">Order #{selectedPayment.pembelian.kode_pembelian}</h3>
                      <Badge>
                        {selectedPayment.pembelian.status_pembelian}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <h3 className="font-semibold text-sm">Customer Information</h3>
                        <div className="text-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <span className="text-muted-foreground">Name:</span>
                            <span>{selectedPayment.pembelian.pembeli?.name || "N/A"}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <span className="text-muted-foreground">Email:</span>
                            <span>{selectedPayment.pembelian.pembeli?.email || "N/A"}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <h3 className="font-semibold text-sm">Shipping Information</h3>
                        {selectedPayment.pembelian.alamat ? (
                          <div className="text-sm">
                            <p>
                              {selectedPayment.pembelian.alamat.alamat}{" "}
                              {selectedPayment.pembelian.alamat.village?.name},{" "}
                              {selectedPayment.pembelian.alamat.district?.name},{" "}
                              {selectedPayment.pembelian.alamat.regency?.name},{" "}
                              {selectedPayment.pembelian.alamat.province?.name}
                            </p>
                            <p className="text-muted-foreground">
                              Postal Code: {selectedPayment.pembelian.alamat.kode_pos}
                            </p>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">No shipping address available</p>
                        )}
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <h3 className="font-semibold">Ordered Items</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>Store</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                            <TableHead className="text-right">Qty</TableHead>
                            <TableHead className="text-right">Subtotal</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedPayment.pembelian.detail_pembelian && 
                          selectedPayment.pembelian.detail_pembelian.length > 0 ? (
                            selectedPayment.pembelian.detail_pembelian.map((item) => (
                              <TableRow key={item.id_detail_pembelian}>
                                <TableCell>
                                  {item.barang ? item.barang.nama_barang : "Unknown Product"}
                                </TableCell>
                                <TableCell>
                                  {item.toko ? item.toko.nama_toko : "Unknown Store"}
                                </TableCell>
                                <TableCell className="text-right">
                                  {formatRupiah(item.harga_satuan)}
                                </TableCell>
                                <TableCell className="text-right">
                                  {item.jumlah}
                                </TableCell>
                                <TableCell className="text-right">
                                  {formatRupiah(item.subtotal)}
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center text-muted-foreground">
                                No items found
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>

                    {selectedPayment.pembelian.admin_notes && (
                      <div className="mt-4 bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-blue-800 mb-2">
                          Admin Notes
                        </h3>
                        <p className="text-sm text-blue-700">
                          {selectedPayment.pembelian.admin_notes}
                        </p>
                      </div>
                    )}

                    {selectedPayment.pembelian.catatan_pembeli && (
                      <div className="mt-4 bg-yellow-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-yellow-800 mb-2">
                          Customer Notes
                        </h3>
                        <p className="text-sm text-yellow-700">
                          {selectedPayment.pembelian.catatan_pembeli}
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto" />
                    <h3 className="mt-2 font-medium">
                      No order information available
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      This payment is not linked to any order
                    </p>
                  </div>
                )}
              </TabsContent>

              {/* Actions tab */}
              <TabsContent value="actions" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Update payment status section */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Update Payment Status</h3>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Current status:{" "}
                        <Badge className={getStatusBadgeColor(selectedPayment.status_pembayaran)}>
                          {selectedPayment.status_pembayaran}
                        </Badge>
                      </p>
                    </div>

                    {getValidStatusOptions().length > 0 ? (
                      <div className="flex flex-col gap-2">
                        <p className="text-sm">Available status changes:</p>
                        {getValidStatusOptions().map((status) => (
                          <Button
                            key={status}
                            onClick={() => onUpdateStatus(status)}
                            variant={
                              status === "Gagal" || status === "Expired"
                                ? "destructive"
                                : status === "Refund"
                                ? "outline"
                                : "default"
                            }
                            className="justify-start"
                          >
                            {status === "Gagal" || status === "Expired" ? (
                              <X className="mr-2 h-4 w-4" />
                            ) : status === "Dibayar" ? (
                              <Check className="mr-2 h-4 w-4" />
                            ) : status === "Menunggu" ? (
                              <Clock className="mr-2 h-4 w-4" />
                            ) : (
                              <ArrowRight className="mr-2 h-4 w-4" />
                            )}
                            Change to {status}
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm bg-muted p-4 rounded-lg">
                        <p>
                          This payment is in a {selectedPayment.status_pembayaran === "Refund" || 
                            selectedPayment.status_pembayaran === "Dibayar" ? "final" : "current"} state and 
                          cannot be updated further.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Special actions section */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Special Actions</h3>
                    <div className="space-y-2">
                      {canVerifyManually() && (
                        <Button
                          onClick={onVerifyPayment}
                          variant="outline"
                          className="w-full justify-start"
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Manually Verify Payment
                        </Button>
                      )}

                      {canRefund() && (
                        <Button
                          onClick={onRefundPayment}
                          variant="outline"
                          className="w-full justify-start"
                        >
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Process Refund
                        </Button>
                      )}

                      {selectedPayment.payment_url && (
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => window.open(selectedPayment.payment_url!, '_blank')}
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View Payment Page
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="font-semibold">Payment Timeline</h3>
                  <div className="space-y-4">
                    <div className="flex gap-4 items-start">
                      <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-500"></div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="font-medium">Payment Created</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(selectedPayment.created_at)}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Invoice was generated for order #{selectedPayment.pembelian?.kode_pembelian || "N/A"}
                        </p>
                      </div>
                    </div>

                    {selectedPayment.status_pembayaran !== "Menunggu" && (
                      <div className="flex gap-4 items-start">
                        <div className="w-2 h-2 mt-1.5 rounded-full bg-yellow-500"></div>
                        <div className="flex-1">
                          <p className="font-medium">Waiting for Payment</p>
                          <p className="text-sm text-muted-foreground">
                            Payment was awaiting customer action
                          </p>
                        </div>
                      </div>
                    )}

                    {selectedPayment.status_pembayaran === "Dibayar" && (
                      <div className="flex gap-4 items-start">
                        <div className="w-2 h-2 mt-1.5 rounded-full bg-green-500"></div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <p className="font-medium">Payment Completed</p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(selectedPayment.tanggal_pembayaran)}
                            </p>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Payment was successfully processed via {selectedPayment.metode_pembayaran || "payment provider"}
                          </p>
                        </div>
                      </div>
                    )}

                    {selectedPayment.status_pembayaran === "Expired" && (
                      <div className="flex gap-4 items-start">
                        <div className="w-2 h-2 mt-1.5 rounded-full bg-gray-500"></div>
                        <div className="flex-1">
                          <p className="font-medium">Payment Expired</p>
                          <p className="text-sm text-muted-foreground">
                            Payment deadline passed without action
                          </p>
                        </div>
                      </div>
                    )}

                    {selectedPayment.status_pembayaran === "Gagal" && (
                      <div className="flex gap-4 items-start">
                        <div className="w-2 h-2 mt-1.5 rounded-full bg-red-500"></div>
                        <div className="flex-1">
                          <p className="font-medium">Payment Failed</p>
                          <p className="text-sm text-muted-foreground">
                            The payment attempt was unsuccessful
                          </p>
                        </div>
                      </div>
                    )}

                    {selectedPayment.status_pembayaran === "Refund" && (
                      <div className="flex gap-4 items-start">
                        <div className="w-2 h-2 mt-1.5 rounded-full bg-purple-500"></div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <p className="font-medium">Payment Refunded</p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(selectedPayment.refund_date)}
                            </p>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {selectedPayment.refund_amount 
                              ? `${formatRupiah(selectedPayment.refund_amount)} was refunded to the customer` 
                              : "Payment was refunded to the customer"}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-4 items-start">
                      <div className="w-2 h-2 mt-1.5 rounded-full bg-gray-400"></div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="font-medium">Last Updated</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(selectedPayment.updated_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
