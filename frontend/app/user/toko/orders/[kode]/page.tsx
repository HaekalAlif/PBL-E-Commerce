"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { formatRupiah } from "@/lib/utils";

// UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  Clock,
  FileText,
  Loader2,
  Package,
  PackageOpen,
  Printer,
  Truck,
  UploadCloud,
  User,
  MapPin,
  Phone,
} from "lucide-react";

interface OrderItem {
  id_detail_pembelian: number;
  id_barang: number;
  jumlah: number;
  harga_satuan: number;
  subtotal: number;
  barang: {
    id_barang: number;
    nama_barang: string;
    slug: string;
    gambar_barang?: Array<{ url_gambar: string }>;
  };
}

interface Order {
  id_pembelian: number;
  kode_pembelian: string;
  status_pembelian: string;
  created_at: string;
  updated_at: string;
  catatan_pembeli?: string;
  total: number;
  alamat: {
    nama_penerima: string;
    no_telp: string;
    alamat_lengkap: string;
    kode_pos: string;
    district: { name: string };
    regency: { name: string };
    province: { name: string };
  };
  pembeli: {
    id_user: number;
    name: string;
    email: string;
  };
  items: OrderItem[];
  pengiriman?: {
    id_pengiriman: number;
    nomor_resi: string;
    tanggal_pengiriman: string;
    bukti_pengiriman?: string;
    catatan_pengiriman?: string;
  };
}

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const kode = params.kode as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [isShippingDialogOpen, setIsShippingDialogOpen] = useState(false);
  const [isConfirmReceiptOpen, setIsConfirmReceiptOpen] = useState(false);

  // Form state
  const [nomor_resi, setNomorResi] = useState("");
  const [catatan_pengiriman, setCatatanPengiriman] = useState("");
  const [bukti_pengiriman, setBuktiPengiriman] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchOrderDetail();
  }, [kode]);

  const fetchOrderDetail = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/seller/orders/${kode}`
      );

      if (response.data.status === "success") {
        setOrder(response.data.data);
      } else {
        setError("Failed to load order details");
      }
    } catch (error: any) {
      console.error("Error fetching order detail:", error);
      setError(error.response?.data?.message || "Error loading order");
    } finally {
      setLoading(false);
    }
  };

  // Handle confirming receipt of the order (new step)
  const handleConfirmReceipt = async () => {
    if (!order) return;

    try {
      setIsProcessingOrder(true);

      const response = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_URL}/seller/orders/${order.kode_pembelian}/confirm`
      );

      if (response.data.status === "success") {
        toast.success("Order is now being processed");
        setIsConfirmReceiptOpen(false);

        // Update local state directly to "Diproses"
        setOrder({
          ...order,
          status_pembelian: "Diproses",
        });
      } else {
        toast.error("Failed to process order");
      }
    } catch (error: any) {
      console.error("Error processing order:", error);
      toast.error(error.response?.data?.message || "Error processing order");
    } finally {
      setIsProcessingOrder(false);
    }
  };

  const handleShipOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!order || !bukti_pengiriman) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setIsSubmitting(true);
      console.log("Preparing to ship order:", {
        orderCode: order.kode_pembelian,
        nomor_resi,
        catatan_pengiriman: catatan_pengiriman || "Not provided",
        hasFile: !!bukti_pengiriman,
      });

      // Create form data - remove kurir field
      const formData = new FormData();
      formData.append("nomor_resi", nomor_resi);
      if (catatan_pengiriman) {
        formData.append("catatan_pengiriman", catatan_pengiriman);
      }
      formData.append("bukti_pengiriman", bukti_pengiriman);

      const response = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_URL}/seller/orders/${order.kode_pembelian}/ship`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Ship order response:", response.data);

      if (response.data.status === "success") {
        toast.success("Order has been marked as shipped");
        setIsShippingDialogOpen(false);

        // Update local state
        setOrder({
          ...order,
          status_pembelian: "Dikirim",
          pengiriman: response.data.data.pengiriman,
        });

        // Reset form
        setNomorResi("");
        setCatatanPengiriman("");
        setBuktiPengiriman(null);
        setPreviewUrl(null);
      } else {
        toast.error("Failed to ship order");
      }
    } catch (error: any) {
      console.error("Error shipping order:", error);
      toast.error(error.response?.data?.message || "Error shipping order");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBuktiPengiriman(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Draft":
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
            <Clock className="w-3 h-3 mr-1" /> Draft
          </Badge>
        );
      case "Menunggu Pembayaran":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            <Clock className="w-3 h-3 mr-1" /> Waiting for Payment
          </Badge>
        );
      case "Dibayar":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
            <Clock className="w-3 h-3 mr-1" /> New Order
          </Badge>
        );
      case "Diproses":
        return (
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
            <Package className="w-3 h-3 mr-1" /> Processing
          </Badge>
        );
      case "Dikirim":
        return (
          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">
            <Truck className="w-3 h-3 mr-1" /> Shipped
          </Badge>
        );
      case "Selesai":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            <CheckCircle className="w-3 h-3 mr-1" /> Completed
          </Badge>
        );
      case "Dibatalkan":
        return (
          <Badge variant="secondary" className="bg-gray-200">
            <AlertTriangle className="w-3 h-3 mr-1" /> Canceled
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>Loading order details...</span>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto py-12 px-4">
        <Button
          variant="outline"
          onClick={() => router.push("/user/toko/orders")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to orders
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error || "Order not found"}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={fetchOrderDetail}>Try Again</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Button
        variant="outline"
        onClick={() => router.push("/user/toko/orders")}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to orders
      </Button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            Order #{order.kode_pembelian}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Received on {formatDate(order.created_at)}
          </p>
        </div>
        <div className="mt-2 md:mt-0 flex items-center">
          {getStatusBadge(order.status_pembelian)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content - Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Action Card */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-5 w-5" />
                Order Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                {order.status_pembelian === "Dibayar" && (
                  <Button
                    onClick={() => setIsConfirmReceiptOpen(true)}
                    className="flex-1"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Process Order
                  </Button>
                )}

                {order.status_pembelian === "Diproses" && (
                  <Button
                    onClick={() => setIsShippingDialogOpen(true)}
                    className="flex-1"
                  >
                    <Truck className="h-4 w-4 mr-2" /> Ship Order
                  </Button>
                )}

                {order.status_pembelian === "Dikirim" && (
                  <div className="text-sm text-gray-700 bg-gray-50 p-4 rounded-md w-full">
                    <p className="font-medium">Order has been shipped</p>
                    <p className="mt-1">
                      Waiting for customer to confirm delivery
                    </p>
                  </div>
                )}

                {order.status_pembelian === "Diterima" && (
                  <div className="text-sm text-green-700 bg-green-50 p-4 rounded-md w-full flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    <div>
                      <p className="font-medium">Order has been delivered</p>
                      <p className="mt-1">
                        Customer has confirmed receipt of the order
                      </p>
                    </div>
                  </div>
                )}

                {order.status_pembelian === "Selesai" && (
                  <div className="text-sm text-green-700 bg-green-50 p-4 rounded-md w-full flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    <div>
                      <p className="font-medium">Order completed</p>
                      <p className="mt-1">
                        This order has been completed successfully
                      </p>
                    </div>
                  </div>
                )}

                {order.status_pembelian === "Dibatalkan" && (
                  <div className="text-sm text-red-700 bg-red-50 p-4 rounded-md w-full flex items-start">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    <div>
                      <p className="font-medium">Order cancelled</p>
                      <p className="mt-1">This order has been cancelled</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Order Items</CardTitle>
              <CardDescription>
                Products ordered by the customer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.id_detail_pembelian}>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100 mr-3">
                            {item.barang?.gambar_barang &&
                            item.barang.gambar_barang.length > 0 ? (
                              <img
                                src={item.barang.gambar_barang[0].url_gambar}
                                alt={item.barang.nama_barang}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    "/placeholder-product.png";
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                No image
                              </div>
                            )}
                          </div>
                          <span className="line-clamp-2">
                            {item.barang.nama_barang}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {formatRupiah(item.harga_satuan)}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.jumlah}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatRupiah(item.subtotal)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-medium">
                      Total
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      {formatRupiah(order.total)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Shipping information when available */}
          {order.pengiriman && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <Truck className="mr-2 h-5 w-5" /> Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Tracking Number</Label>
                      <div className="mt-1 font-medium">
                        {order.pengiriman.nomor_resi}
                      </div>
                    </div>
                    <div>
                      <Label>Shipping Date</Label>
                      <div className="mt-1">
                        {formatDate(order.pengiriman.tanggal_pengiriman)}
                      </div>
                    </div>
                  </div>

                  {order.pengiriman.catatan_pengiriman && (
                    <div>
                      <Label>Shipping Notes</Label>
                      <div className="mt-1 text-gray-700">
                        {order.pengiriman.catatan_pengiriman}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar - Customer and order info */}
        <div className="space-y-6">
          {/* Customer information */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" /> Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium">{order.pembeli.name}</p>
                <p className="text-sm text-gray-500">{order.pembeli.email}</p>
              </div>
              <Separator />
              <div>
                <p className="font-medium flex items-center">
                  <MapPin className="h-4 w-4 mr-1" /> Shipping Address
                </p>
                <p className="mt-1 font-medium">{order.alamat.nama_penerima}</p>
                <p className="text-sm flex items-center mt-1">
                  <Phone className="h-3 w-3 mr-1" /> {order.alamat.no_telp}
                </p>
                <p className="text-sm mt-1">
                  {order.alamat.alamat_lengkap}, {order.alamat.district.name},{" "}
                  {order.alamat.regency.name}, {order.alamat.province.name},{" "}
                  {order.alamat.kode_pos}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" /> Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Order ID</span>
                  <span className="font-medium">{order.kode_pembelian}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Date</span>
                  <span>{formatDate(order.created_at).split(",")[0]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status</span>
                  <span>{getStatusBadge(order.status_pembelian)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>{formatRupiah(order.total)}</span>
                </div>
              </div>

              {order.catatan_pembeli && (
                <div className="bg-gray-50 rounded-md p-3">
                  <p className="font-medium text-sm">Customer Notes:</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {order.catatan_pembeli}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirm Receipt Dialog */}
      <Dialog
        open={isConfirmReceiptOpen}
        onOpenChange={setIsConfirmReceiptOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Process Order</DialogTitle>
            <DialogDescription>
              Confirm that you've received this order and will begin processing
              it.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-700 mb-2">
              By confirming, you acknowledge receipt of the order and commit to
              starting the preparation of the items.
            </p>
            <p className="text-sm text-gray-700">
              Order status will be updated to "Processing".
            </p>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsConfirmReceiptOpen(false)}
              className="mt-2 sm:mt-0"
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmReceipt} disabled={isProcessingOrder}>
              {isProcessingOrder ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4 mr-2" />
              )}
              Confirm & Process
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Shipping Dialog */}
      <Dialog
        open={isShippingDialogOpen}
        onOpenChange={setIsShippingDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Ship Order</DialogTitle>
            <DialogDescription>
              Enter shipping information and upload shipping receipt
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleShipOrder}>
            <div className="space-y-4 py-4">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="nomor_resi">
                    Tracking Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="nomor_resi"
                    value={nomor_resi}
                    onChange={(e) => setNomorResi(e.target.value)}
                    placeholder="Enter tracking number"
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="catatan_pengiriman">
                    Shipping Notes (optional)
                  </Label>
                  <Textarea
                    id="catatan_pengiriman"
                    value={catatan_pengiriman}
                    onChange={(e) => setCatatanPengiriman(e.target.value)}
                    placeholder="Any additional information"
                    className="resize-none mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="bukti_pengiriman">
                    Upload Receipt Image <span className="text-red-500">*</span>
                  </Label>
                  <div className="mt-1">
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="bukti_pengiriman"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                      >
                        {previewUrl ? (
                          <div className="w-full h-full flex items-center justify-center relative">
                            <img
                              src={previewUrl}
                              alt="Receipt preview"
                              className="max-h-28 rounded-lg object-contain"
                            />
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <UploadCloud className="w-8 h-8 mb-2 text-gray-500" />
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-semibold">
                                Click to upload
                              </span>{" "}
                              or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">
                              PNG, JPG (MAX. 2MB)
                            </p>
                          </div>
                        )}
                        <input
                          id="bukti_pengiriman"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleFileChange}
                          required
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsShippingDialogOpen(false)}
                className="mt-2 sm:mt-0"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Ship Order"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
