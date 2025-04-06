import React, { useState } from "react";

import { Order, OrderStatus, PaymentStatus } from "../../types";
import { format } from "date-fns";
import { formatRupiah } from "@/lib/formatter";
import ImageModal from "../ImageModal";

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
  Truck,
  Clock,
  Check,
  X,
  MessageCircle,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderDetailsDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedOrder: Order | null;
  onUpdateStatus: (status: string) => void;
  onAddComment: () => void;
}

export default function OrderDetailsDialog({
  isOpen,
  setIsOpen,
  selectedOrder,
  onUpdateStatus,
  onAddComment,
}: OrderDetailsDialogProps) {
  // Add state for image modal
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  // Format date for display
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd MMM yyyy, HH:mm");
  };

  // Get status badge color based on order status
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Menunggu Pembayaran":
        return "bg-yellow-100 text-yellow-800";
      case "Dibayar":
        return "bg-blue-100 text-blue-800";
      case "Diproses":
        return "bg-indigo-100 text-indigo-800";
      case "Dikirim":
        return "bg-purple-100 text-purple-800";
      case "Selesai":
        return "bg-green-100 text-green-800";
      case "Dibatalkan":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get payment status badge color
  const getPaymentStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Menunggu":
        return "bg-yellow-100 text-yellow-800";
      case "Dibayar":
        return "bg-green-100 text-green-800";
      case "Expired":
        return "bg-gray-100 text-gray-800";
      case "Gagal":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Generate valid status options for current order
  const getValidStatusOptions = () => {
    if (!selectedOrder) return [];

    const currentStatus = selectedOrder.status_pembelian;

    // Define valid transitions between statuses
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      "Menunggu Pembayaran": ["Dibayar", "Dibatalkan"],
      Dibayar: ["Diproses", "Dibatalkan"],
      Diproses: ["Dikirim"],
      Dikirim: ["Selesai"],
      Selesai: [], // Terminal state
      Dibatalkan: [], // Terminal state
    };

    return validTransitions[currentStatus] || [];
  };

  // Add debugging - log the entire order object when it changes
  React.useEffect(() => {
    if (selectedOrder) {
      console.log("Selected Order:", selectedOrder);
      console.log("Detail Pembelian:", selectedOrder.detail_pembelian);
      if (
        selectedOrder.detail_pembelian &&
        selectedOrder.detail_pembelian.length > 0
      ) {
        console.log("First detail item:", selectedOrder.detail_pembelian[0]);
        console.log(
          "Shipping info:",
          selectedOrder.detail_pembelian[0].pengiriman_pembelian
        );
      }
    }
  }, [selectedOrder]);

  // Add more detailed debugging to understand the data structure
  React.useEffect(() => {
    if (selectedOrder) {
      console.log("Selected Order:", selectedOrder);
      console.log("Detail Pembelian:", selectedOrder.detail_pembelian);
      if (
        selectedOrder.detail_pembelian &&
        selectedOrder.detail_pembelian.length > 0
      ) {
        console.log("First detail item:", selectedOrder.detail_pembelian[0]);
        console.log("First barang:", selectedOrder.detail_pembelian[0].barang);
        console.log(
          "Has gambar_barang?",
          !!selectedOrder.detail_pembelian[0].barang.gambar_barang
        );
        console.log(
          "Has pengiriman_pembelian?",
          !!selectedOrder.detail_pembelian[0].pengiriman_pembelian
        );

        // Log all keys to help identify what's available
        console.log(
          "Detail pembelian keys:",
          Object.keys(selectedOrder.detail_pembelian[0])
        );
      }
    }
  }, [selectedOrder]);

  // Function to handle image click
  const handleImageClick = (imageUrl: string) => {
    if (!imageUrl) return;

    // Make sure URL is complete
    const fullUrl = getFullImageUrl(imageUrl);

    console.log("Opening image:", fullUrl);
    setSelectedImage(fullUrl);
    setImageModalOpen(true);
  };

  // Helper function to get full image URL
  const getFullImageUrl = (relativeUrl: string) => {
    if (!relativeUrl) return "";

    // If it's already a full URL, return it
    if (relativeUrl.startsWith("http")) {
      return relativeUrl;
    }

    // Create base URL without the /api part
    // This ensures we get http://localhost:8000/ instead of http://localhost:8000/api/
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const baseUrl = apiUrl.replace(/\/api\/?$/, ""); // Remove /api/ at the end if present

    // Remove any leading slash from relative URL to avoid double slashes
    const cleanRelativeUrl = relativeUrl.startsWith("/")
      ? relativeUrl.substring(1)
      : relativeUrl;

    return `${baseUrl}/${cleanRelativeUrl}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        {selectedOrder ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>Order #{selectedOrder.kode_pembelian}</span>
                <div className="flex items-center gap-2">
                  <Badge
                    className={getStatusBadgeColor(
                      selectedOrder.status_pembelian
                    )}
                  >
                    {selectedOrder.status_pembelian}
                  </Badge>
                </div>
              </DialogTitle>
              <DialogDescription className="flex justify-between">
                <span>Ordered on {formatDate(selectedOrder.created_at)}</span>
                <span className="font-medium">
                  Customer: {selectedOrder.pembeli.name}
                </span>
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="details">
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="payment">Payment</TabsTrigger>
                <TabsTrigger value="shipping">Shipping</TabsTrigger>
                <TabsTrigger value="actions">Actions</TabsTrigger>
              </TabsList>

              {/* Content tabs */}
              {/* Details tab */}
              <TabsContent value="details" className="space-y-4">
                {/* Order items */}
                <div>
                  <h3 className="font-semibold mb-2">Order Items</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Store</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Qty</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder &&
                      selectedOrder.detail_pembelian &&
                      Array.isArray(selectedOrder.detail_pembelian) &&
                      selectedOrder.detail_pembelian.length > 0 ? (
                        selectedOrder.detail_pembelian.map((item, index) => (
                          <TableRow
                            key={item.id_detail_pembelian || `detail-${index}`}
                          >
                            <TableCell className="flex items-center gap-3">
                              {item.barang &&
                              item.barang.gambar_barang && // Make sure this matches the API field name
                              Array.isArray(item.barang.gambar_barang) &&
                              item.barang.gambar_barang.length > 0 ? (
                                <img
                                  src={item.barang.gambar_barang[0].url_gambar}
                                  alt={item.barang.nama_barang}
                                  className="h-10 w-10 rounded object-cover"
                                />
                              ) : (
                                <div className="h-10 w-10 rounded bg-muted" />
                              )}
                              <span>
                                {item.barang
                                  ? item.barang.nama_barang
                                  : "Unknown Product"}
                              </span>
                            </TableCell>
                            <TableCell>
                              {item.toko
                                ? item.toko.nama_toko
                                : "Unknown Store"}
                            </TableCell>
                            <TableCell className="text-right">
                              {formatRupiah(item.harga_satuan || 0)}
                            </TableCell>
                            <TableCell className="text-right">
                              {item.jumlah || 0}
                            </TableCell>
                            <TableCell className="text-right">
                              {formatRupiah(item.subtotal || 0)}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4">
                            No items found in this order
                            <div className="text-xs text-muted-foreground mt-1">
                              (detail_pembelian:{" "}
                              {JSON.stringify(
                                selectedOrder?.detail_pembelian?.length || 0
                              )}{" "}
                              items)
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Order summary */}
                <div className="mt-6 bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Order Summary</h3>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>
                        {formatRupiah(selectedOrder.tagihan?.total_harga || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping fee</span>
                      <span>
                        {formatRupiah(selectedOrder.tagihan?.biaya_kirim || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Admin fee</span>
                      <span>
                        {formatRupiah(selectedOrder.tagihan?.biaya_admin || 0)}
                      </span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>
                        {formatRupiah(
                          selectedOrder.tagihan?.total_tagihan || 0
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Customer notes */}
                {selectedOrder.catatan_pembeli && (
                  <div className="mt-4 bg-yellow-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-yellow-800 mb-2">
                      Customer Notes
                    </h3>
                    <p className="text-sm text-yellow-700">
                      {selectedOrder.catatan_pembeli}
                    </p>
                  </div>
                )}

                {/* Admin notes */}
                {selectedOrder.admin_notes && (
                  <div className="mt-4 bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-2">
                      Admin Notes
                    </h3>
                    <p className="text-sm text-blue-700">
                      {selectedOrder.admin_notes}
                    </p>
                  </div>
                )}
              </TabsContent>

              {/* Payment tab */}
              <TabsContent value="payment" className="space-y-4">
                {selectedOrder.tagihan ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <h3 className="font-semibold">Payment Information</h3>
                        <div className="text-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <span className="text-muted-foreground">
                              Method:
                            </span>
                            <span>
                              {selectedOrder.tagihan.metode_pembayaran}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <span className="text-muted-foreground">
                              Status:
                            </span>
                            <Badge
                              className={getPaymentStatusBadgeColor(
                                selectedOrder.tagihan.status_pembayaran
                              )}
                            >
                              {selectedOrder.tagihan.status_pembayaran}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <span className="text-muted-foreground">
                              Invoice Code:
                            </span>
                            <span>{selectedOrder.tagihan.kode_tagihan}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <span className="text-muted-foreground">
                              Total Amount:
                            </span>
                            <span className="font-medium">
                              {formatRupiah(
                                selectedOrder.tagihan.total_tagihan
                              )}
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
                            <span>{formatDate(selectedOrder.created_at)}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <span className="text-muted-foreground">
                              Deadline:
                            </span>
                            <span>
                              {selectedOrder.tagihan.deadline_pembayaran
                                ? formatDate(
                                    selectedOrder.tagihan.deadline_pembayaran
                                  )
                                : "N/A"}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <span className="text-muted-foreground">
                              Last Updated:
                            </span>
                            <span>{formatDate(selectedOrder.updated_at)}</span>
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
                              {formatRupiah(selectedOrder.tagihan.total_harga)}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Shipping Fee</TableCell>
                            <TableCell className="text-right">
                              {formatRupiah(selectedOrder.tagihan.biaya_kirim)}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Admin Fee</TableCell>
                            <TableCell className="text-right">
                              {formatRupiah(selectedOrder.tagihan.biaya_admin)}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Total</TableCell>
                            <TableCell className="font-medium text-right">
                              {formatRupiah(
                                selectedOrder.tagihan.total_tagihan
                              )}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CreditCard className="h-12 w-12 text-muted-foreground mx-auto" />
                    <h3 className="mt-2 font-medium">
                      No payment information available
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      This order does not have any payment details
                    </p>
                  </div>
                )}
              </TabsContent>

              {/* Shipping tab */}
              <TabsContent value="shipping" className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h3 className="font-semibold">Shipping Address</h3>
                    {selectedOrder.alamat ? (
                      <div className="text-sm space-y-1">
                        <p className="font-medium">
                          {selectedOrder.pembeli.name}
                        </p>
                        <p>{selectedOrder.alamat.alamat}</p>
                        <p>
                          {selectedOrder.alamat.village?.name},{" "}
                          {selectedOrder.alamat.district?.name}
                        </p>
                        <p>
                          {selectedOrder.alamat.regency?.name},{" "}
                          {selectedOrder.alamat.province?.name}{" "}
                          {selectedOrder.alamat.kode_pos}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No shipping address available
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold">Shipping Method</h3>
                    {selectedOrder.tagihan ? (
                      <div className="text-sm space-y-1">
                        <p>
                          <span className="text-muted-foreground">
                            Service:
                          </span>{" "}
                          {selectedOrder.tagihan.opsi_pengiriman}
                        </p>
                        <p>
                          <span className="text-muted-foreground">Fee:</span>{" "}
                          {formatRupiah(selectedOrder.tagihan.biaya_kirim)}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No shipping method details available
                      </p>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold">Shipping Status</h3>

                  {selectedOrder &&
                  selectedOrder.detail_pembelian &&
                  Array.isArray(selectedOrder.detail_pembelian) &&
                  selectedOrder.detail_pembelian.some(
                    (detail) => detail.pengiriman_pembelian // Make sure this matches the API field name
                  ) ? (
                    selectedOrder.detail_pembelian
                      .filter((detail) => detail.pengiriman_pembelian)
                      .map((detail, index) => (
                        <div
                          key={
                            detail.id_detail_pembelian || `shipping-${index}`
                          } // Use id_detail instead of id_detail_pembelian
                          className="bg-muted/50 p-4 rounded-lg space-y-2"
                        >
                          <div className="flex justify-between">
                            <div>
                              <p className="font-medium">
                                Store:{" "}
                                {detail.toko?.nama_toko || "Unknown Store"}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                <strong>Tracking Number:</strong>{" "}
                                {detail.pengiriman_pembelian?.nomor_resi ||
                                  "Not available"}
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">
                                <strong>Shipping ID:</strong>{" "}
                                {detail.pengiriman_pembelian?.id_pengiriman ||
                                  "N/A"}
                              </p>
                            </div>
                            <Badge variant="outline">
                              Shipped on{" "}
                              {detail.pengiriman_pembelian?.tanggal_pengiriman
                                ? formatDate(
                                    detail.pengiriman_pembelian
                                      .tanggal_pengiriman
                                  )
                                : "Unknown date"}
                            </Badge>
                          </div>

                          {detail.pengiriman_pembelian?.catatan_pengiriman && (
                            <div className="text-sm">
                              <p className="font-medium">Shipping Notes:</p>
                              <p className="text-muted-foreground">
                                {detail.pengiriman_pembelian.catatan_pengiriman}
                              </p>
                            </div>
                          )}

                          {detail.pengiriman_pembelian?.bukti_pengiriman && (
                            <div className="mt-3">
                              <p className="text-sm font-medium mb-2">
                                Proof of Shipment:
                              </p>
                              <div
                                className="cursor-pointer hover:opacity-90 transition-opacity inline-block"
                                onClick={() =>
                                  handleImageClick(
                                    detail.pengiriman_pembelian
                                      ?.bukti_pengiriman ?? ""
                                  )
                                }
                              >
                                <img
                                  src={getFullImageUrl(
                                    detail.pengiriman_pembelian.bukti_pengiriman
                                  )}
                                  alt="Shipping proof"
                                  className="w-40 h-40 object-cover rounded border border-muted-foreground/20 shadow-sm"
                                  onError={(e) => {
                                    // Fallback if image fails to load
                                    console.error("Image failed to load:", e);
                                    e.currentTarget.src =
                                      "/placeholder-image.png";
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                  ) : (
                    <div className="text-center py-8">
                      <Truck className="h-12 w-12 text-muted-foreground mx-auto" />
                      <h3 className="mt-2 font-medium">
                        No shipping information yet
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        This order has not been shipped by the seller
                      </p>
                      {selectedOrder?.status_pembelian === "Diproses" ? (
                        <p className="mt-2 text-sm text-amber-600">
                          The seller is currently processing this order and will
                          ship it soon.
                        </p>
                      ) : selectedOrder?.status_pembelian ===
                          "Menunggu Pembayaran" ||
                        selectedOrder?.status_pembelian === "Dibayar" ? (
                        <p className="mt-2 text-sm text-blue-600">
                          This order is awaiting processing before it can be
                          shipped.
                        </p>
                      ) : selectedOrder?.status_pembelian === "Dibatalkan" ? (
                        <p className="mt-2 text-sm text-red-600">
                          This order has been cancelled and will not be shipped.
                        </p>
                      ) : (
                        <p className="mt-2 text-sm text-gray-600">
                          No shipping information available for this order.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Actions tab */}
              <TabsContent value="actions" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Update order status section */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Update Order Status</h3>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Current status:{" "}
                        <Badge>{selectedOrder.status_pembelian}</Badge>
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
                              status === "Dibatalkan"
                                ? "destructive"
                                : "outline"
                            }
                            className="justify-start"
                          >
                            {status === "Dibatalkan" ? (
                              <X className="mr-2 h-4 w-4" />
                            ) : status === "Selesai" ? (
                              <Check className="mr-2 h-4 w-4" />
                            ) : (
                              <Clock className="mr-2 h-4 w-4" />
                            )}
                            Change to {status}
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm bg-muted p-4 rounded-lg">
                        <p>
                          This order is in a final state (
                          {selectedOrder.status_pembelian}) and cannot be
                          updated further.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Add comments section */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Admin Actions</h3>
                    <div className="space-y-2">
                      <Button
                        onClick={onAddComment}
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Add Comment/Note
                      </Button>

                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download Invoice
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="font-semibold">Order Timeline</h3>
                  <div className="space-y-4">
                    <div className="flex gap-4 items-start">
                      <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-500"></div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="font-medium">Order Created</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(selectedOrder.created_at)}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Order was placed by {selectedOrder.pembeli.name}
                        </p>
                      </div>
                    </div>

                    {selectedOrder.status_pembelian !==
                      "Menunggu Pembayaran" && (
                      <div className="flex gap-4 items-start">
                        <div className="w-2 h-2 mt-1.5 rounded-full bg-yellow-500"></div>
                        <div className="flex-1">
                          <p className="font-medium">Waiting for Payment</p>
                          <p className="text-sm text-muted-foreground">
                            Order status changed to Waiting for Payment
                          </p>
                        </div>
                      </div>
                    )}

                    {selectedOrder.tagihan?.status_pembayaran === "Dibayar" && (
                      <div className="flex gap-4 items-start">
                        <div className="w-2 h-2 mt-1.5 rounded-full bg-green-500"></div>
                        <div className="flex-1">
                          <p className="font-medium">Payment Received</p>
                          <p className="text-sm text-muted-foreground">
                            Payment was received via{" "}
                            {selectedOrder.tagihan.metode_pembayaran}
                          </p>
                        </div>
                      </div>
                    )}

                    {selectedOrder.status_pembelian === "Diproses" && (
                      <div className="flex gap-4 items-start">
                        <div className="w-2 h-2 mt-1.5 rounded-full bg-indigo-500"></div>
                        <div className="flex-1">
                          <p className="font-medium">Processing</p>
                          <p className="text-sm text-muted-foreground">
                            Order is being processed by the seller
                          </p>
                        </div>
                      </div>
                    )}

                    {selectedOrder.status_pembelian === "Dikirim" && (
                      <div className="flex gap-4 items-start">
                        <div className="w-2 h-2 mt-1.5 rounded-full bg-purple-500"></div>
                        <div className="flex-1">
                          <p className="font-medium">Shipped</p>
                          <p className="text-sm text-muted-foreground">
                            Order has been shipped to the customer
                          </p>
                        </div>
                      </div>
                    )}

                    {selectedOrder.status_pembelian === "Selesai" && (
                      <div className="flex gap-4 items-start">
                        <div className="w-2 h-2 mt-1.5 rounded-full bg-green-600"></div>
                        <div className="flex-1">
                          <p className="font-medium">Completed</p>
                          <p className="text-sm text-muted-foreground">
                            Order has been completed successfully
                          </p>
                        </div>
                      </div>
                    )}

                    {selectedOrder.status_pembelian === "Dibatalkan" && (
                      <div className="flex gap-4 items-start">
                        <div className="w-2 h-2 mt-1.5 rounded-full bg-red-500"></div>
                        <div className="flex-1">
                          <p className="font-medium">Cancelled</p>
                          <p className="text-sm text-muted-foreground">
                            Order was cancelled
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
                            {formatDate(selectedOrder.updated_at)}
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

      {/* Add the image modal component */}
      <ImageModal
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        imageUrl={selectedImage}
        title="Shipping Proof"
      />
    </Dialog>
  );
}
