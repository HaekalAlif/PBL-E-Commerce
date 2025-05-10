"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import Link from "next/link";

// UI Components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Loader2,
  ArrowLeft,
  CheckCircle,
  Clock,
  Ban,
  Package,
  AlertCircle,
  Truck,
  CircleCheck,
  CreditCard,
  ExternalLink,
  Home,
  PackageCheck,
  ThumbsUp,
} from "lucide-react";
import { formatRupiah } from "@/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface OrderDetail {
  id_pembelian: number;
  kode_pembelian: string;
  status_pembelian: string;
  catatan_pembeli?: string;
  created_at: string;
  updated_at: string;
  alamat: {
    nama_penerima: string;
    no_telp: string;
    alamat_lengkap: string;
    kode_pos: string;
    district: { name: string };
    regency: { name: string };
    province: { name: string };
  };
  detailPembelian: Array<{
    id_detail_pembelian: number;
    jumlah: number;
    harga_satuan: number;
    subtotal: number;
    barang: {
      nama_barang: string;
      slug: string;
      gambar_barang?: Array<{ url_gambar: string }>;
    };
  }>;
  tagihan?: {
    id_tagihan: number;
    kode_tagihan: string;
    total_harga: number;
    biaya_kirim: number;
    biaya_admin: number;
    total_tagihan: number;
    status_pembayaran: string;
    metode_pembayaran: string;
    deadline_pembayaran?: string;
    tanggal_pembayaran?: string;
    midtrans_payment_type?: string;
    opsi_pengiriman?: string; // Added property
  };
  tracking_info?: {
    resi?: string;
    courier?: string;
  };
}

// Define tracking steps based on order status
const trackingSteps = [
  {
    status: "Order Placed",
    icon: Package,
    description: "Your order has been received",
  },
  {
    status: "Payment",
    icon: CreditCard,
    description: "Payment has been confirmed",
  },
  {
    status: "Processing",
    icon: PackageCheck,
    description: "Your order is being processed",
  },
  {
    status: "Shipped",
    icon: Truck,
    description: "Your order has been shipped",
  },
  {
    status: "Delivered",
    icon: Home,
    description: "Package has been delivered",
  },
  { status: "Completed", icon: ThumbsUp, description: "Order completed" },
];

export default function OrderDetail() {
  const router = useRouter();
  const params = useParams();
  const kode = params?.kode as string | undefined;

  if (!kode) {
    throw new Error("Invalid order code. Please try again.");
  }

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isConfirmDeliveryOpen, setIsConfirmDeliveryOpen] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isComplaintDialogOpen, setIsComplaintDialogOpen] = useState(false);

  useEffect(() => {
    fetchOrderDetail();
  }, [kode]);

  // Set the current tracking step based on order status
  useEffect(() => {
    if (order) {
      let step = 0;

      switch (order.status_pembelian) {
        case "Draft":
          step = 0; // Order Created
          break;
        case "Menunggu Pembayaran":
          step = 0; // Order Placed
          break;
        case "Dibayar":
          step = 1; // Payment Confirmed
          break;
        case "Diproses":
          step = 2; // Processing
          break;
        case "Dikirim":
          step = 3; // Shipped
          break;
        case "Selesai":
          step = 5; // Completed
          break;
        case "Dibatalkan":
          step = -1; // Special case for canceled orders
          break;
        default:
          step = 0;
      }

      setCurrentStep(step);
    }
  }, [order]);

  const fetchOrderDetail = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/purchases/${kode}`
      );

      if (response.data.status === "success") {
        // Add debugging to check data structure
        console.log("Order data received:", response.data.data);

        // Check if detailPembelian exists before setting the order
        const orderData = response.data.data;

        // Set the order data
        setOrder(orderData);

        // If detailPembelian is missing, try to fetch it separately
        if (
          !orderData.detailPembelian ||
          !Array.isArray(orderData.detailPembelian) ||
          orderData.detailPembelian.length === 0
        ) {
          console.log(
            "Missing or empty detailPembelian, attempting to fetch separately"
          );
          fetchOrderItems(orderData.id_pembelian);
        }
      } else {
        setError("Failed to load order details");
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      setError("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  // Add a new function to fetch order items separately
  const fetchOrderItems = async (purchaseId: number) => {
    try {
      console.log(`Fetching order items for purchase ID: ${purchaseId}`);
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/purchases/${kode}/items`
      );

      if (response.data.status === "success" && response.data.data) {
        console.log("Successfully fetched order items:", response.data.data);

        // Update the order with the items data
        setOrder((prevOrder) => {
          if (!prevOrder) return prevOrder;

          return {
            ...prevOrder,
            detailPembelian: response.data.data,
          };
        });
      }
    } catch (error) {
      console.error("Error fetching order items:", error);
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
            Draft
          </Badge>
        );
      case "Dibayar":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
            Paid
          </Badge>
        );
      case "Diproses":
        return (
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
            Processing
          </Badge>
        );
      case "Dikirim":
        return (
          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">
            Shipped
          </Badge>
        );
      case "Diterima":
        return (
          <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-200">
            Delivered
          </Badge>
        );
      case "Selesai":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            Completed
          </Badge>
        );
      case "Dibatalkan":
        return (
          <Badge variant="secondary" className="bg-gray-200">
            Cancelled
          </Badge>
        );
      case "Menunggu Pembayaran":
        return (
          <Badge
            variant="outline"
            className="border-yellow-500 text-yellow-600"
          >
            Awaiting Payment
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Draft":
        return <Package className="h-5 w-5 text-gray-500" />;  
      case "Dibayar":
        return <CheckCircle className="h-5 w-5 text-blue-600" />;
      case "Diproses":
        return <Package className="h-5 w-5 text-purple-600" />;
      case "Dikirim":
        return <Truck className="h-5 w-5 text-orange-600" />;
      case "Diterima":
        return <Home className="h-5 w-5 text-teal-600" />;
      case "Selesai":
        return <CircleCheck className="h-5 w-5 text-green-600" />;
      case "Dibatalkan":
        return <Ban className="h-5 w-5 text-gray-500" />;
      case "Menunggu Pembayaran":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      default:
        return <Package className="h-5 w-5 text-gray-600" />;
    }
  };

  const canPayNow = () => {
    return (
      order?.tagihan &&
      order.tagihan.status_pembayaran === "Menunggu" &&
      order.status_pembelian === "Menunggu Pembayaran"
    );
  };

  const handlePayNow = () => {
    if (order?.tagihan?.kode_tagihan) {
      router.push(`/user/payments/${order.tagihan.kode_tagihan}`);
    }
  };

  const handleConfirmDelivery = () => {
    setIsConfirmDeliveryOpen(true);
  };
  
  const submitDeliveryConfirmation = async () => {
    if (!order) return;
    
    setIsConfirming(true);
    try {
      const response = await axiosInstance.put(
        `${process.env.NEXT_PUBLIC_API_URL}/purchases/${order.kode_pembelian}/confirm-delivery`
      );

      if (response.data.status === "success") {
        toast.success("Delivery confirmed successfully!");
        // Update the local order state
        setOrder({
          ...order,
          status_pembelian: "Selesai"
        });
        setCurrentStep(5); // Set to completed step
      } else {
        toast.error("Failed to confirm delivery");
      }
    } catch (error: any) {
      console.error("Error confirming delivery:", error);
      toast.error(error.response?.data?.message || "Error confirming delivery");
    } finally {
      setIsConfirming(false);
      setIsConfirmDeliveryOpen(false);
    }
  };
  
  const handleComplaint = () => {
    setIsComplaintDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading order details...</span>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto py-12 px-4">
        <Button
          variant="outline"
          onClick={() => router.push("/user/orders")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to orders
        </Button>

        <Card className="border-red-200">
          <CardHeader>
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <CardTitle>Error Loading Order</CardTitle>
            </div>
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
        onClick={() => router.push("/user/orders")}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to orders
      </Button>

      {/* Order Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            {getStatusIcon(order.status_pembelian)}
            Order #{order.kode_pembelian}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Placed on {formatDate(order.created_at)}
          </p>
        </div>
        <div>{getStatusBadge(order.status_pembelian)}</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main order content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order tracking timeline */}
          {order.status_pembelian !== "Dibatalkan" && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Order Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {/* Vertical tracking timeline with modern UI */}
                  <div className="ml-6 mt-3 space-y-8">
                    {trackingSteps.map((step, idx) => {
                      const isActive = idx <= currentStep;
                      const isCurrent = idx === currentStep;

                      return (
                        <div key={step.status} className="relative pb-1">
                          {/* Connecting line */}
                          {idx < trackingSteps.length - 1 && (
                            <div
                              className={`absolute left-[-24px] top-6 w-0.5 h-full ${
                                idx < currentStep ? "bg-primary" : "bg-gray-200"
                              }`}
                            />
                          )}

                          {/* Step icon */}
                          <div className="flex items-start mb-1">
                            <div
                              className={`absolute left-[-30px] rounded-full w-[30px] h-[30px] flex items-center justify-center ${
                                isActive
                                  ? "bg-primary text-white"
                                  : "bg-gray-200 text-gray-400"
                              } ${isCurrent ? "ring-4 ring-primary/20" : ""}`}
                            >
                              <step.icon className="h-4 w-4" />
                            </div>

                            <div className="ml-2 flex-1">
                              <h4
                                className={`font-medium ${
                                  isActive ? "text-primary" : "text-gray-400"
                                }`}
                              >
                                {step.status}
                              </h4>

                              <p className="text-sm text-gray-500">
                                {step.description}
                              </p>

                              {/* Show estimated dates or actual date if step is active */}
                              {isActive && (
                                <p className="text-xs text-gray-400 mt-1">
                                  {idx === 0 && formatDate(order.created_at)}
                                  {idx === 1 &&
                                    order.tagihan?.tanggal_pembayaran &&
                                    formatDate(
                                      order.tagihan.tanggal_pembayaran
                                    )}
                                  {idx === 3 && order.tracking_info?.resi && (
                                    <span>
                                      Tracking: {order.tracking_info.resi}(
                                      {order.tracking_info.courier})
                                    </span>
                                  )}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Display tracking information if available */}
                {order.status_pembelian === "Dikirim" &&
                  order.tracking_info?.resi && (
                    <div className="mt-6 p-4 border rounded-lg bg-gray-50">
                      <h4 className="font-medium mb-1">Tracking Information</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-sm text-gray-500">Courier</p>
                          <p className="font-medium">
                            {order.tracking_info.courier}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            Tracking Number
                          </p>
                          <p className="font-medium">
                            {order.tracking_info.resi}
                          </p>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        className="mt-3 text-sm h-8"
                        asChild
                      >
                        <a href="#" target="_blank" rel="noopener noreferrer">
                          Track Package{" "}
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </Button>
                    </div>
                  )}

                {/* Show cancel messages for canceled orders */}
                {order.status_pembelian === "Dibatalkan" && (
                  <div className="p-4 border rounded-lg border-gray-200 bg-gray-50 flex items-start">
                    <Ban className="text-gray-400 h-5 w-5 mt-0.5 mr-2" />
                    <div>
                      <h4 className="font-medium">Order Cancelled</h4>
                      <p className="text-sm text-gray-500">
                        This order has been cancelled.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Order Items */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Items in Your Order</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.detailPembelian &&
              Array.isArray(order.detailPembelian) &&
              order.detailPembelian.length > 0 ? (
                // Map through order items if they exist
                order.detailPembelian.map((item) => (
                  <div
                    key={item.id_detail_pembelian}
                    className="flex gap-4 pb-4 last:pb-0 last:border-0 border-b"
                  >
                    <div className="w-16 h-16 bg-gray-100 relative overflow-hidden rounded-md">
                      {item.barang?.gambar_barang &&
                      Array.isArray(item.barang.gambar_barang) &&
                      item.barang.gambar_barang.length > 0 ? (
                        <img
                          src={item.barang.gambar_barang[0].url_gambar}
                          alt={item.barang.nama_barang}
                          className="object-cover w-full h-full"
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

                    <div className="flex-1">
                      <Link
                        href={`/user/katalog/detail/${
                          item.barang?.slug || "#"
                        }`}
                        className="hover:underline"
                      >
                        <h3 className="font-medium">
                          {item.barang?.nama_barang || "Unknown Product"}
                        </h3>
                      </Link>
                      <div className="flex justify-between mt-1">
                        <div className="text-sm text-gray-500">
                          {item.jumlah} × {formatRupiah(item.harga_satuan || 0)}
                        </div>
                        <div className="font-medium">
                          {formatRupiah(item.subtotal || 0)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                // Fallback when order details aren't available
                <div className="py-8 text-center">
                  <p className="text-gray-500">
                    Order item details not available
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => fetchOrderItems(order.id_pembelian)}
                  >
                    Try loading items
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Shipping Information */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Shipping Address</h3>
                  <p className="font-medium">{order.alamat.nama_penerima}</p>
                  <p className="text-sm">{order.alamat.no_telp}</p>
                  <p className="text-sm mt-1">
                    {order.alamat.alamat_lengkap}, {order.alamat.district.name},{" "}
                    {order.alamat.regency.name}, {order.alamat.province.name},{" "}
                    {order.alamat.kode_pos}
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Shipping Method</h3>
                  <p>{order.tagihan?.opsi_pengiriman || "Standard Shipping"}</p>

                  {order.catatan_pembeli && (
                    <div className="mt-4">
                      <h3 className="font-medium mb-2">Order Notes</h3>
                      <p className="text-sm text-gray-700">
                        {order.catatan_pembeli}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order summary and actions */}
        <div className="space-y-6">
          {/* Payment Summary - remove sticky positioning */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span>{formatRupiah(order.tagihan?.total_harga || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping</span>
                  <span>{formatRupiah(order.tagihan?.biaya_kirim || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Admin Fee</span>
                  <span>{formatRupiah(order.tagihan?.biaya_admin || 0)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>{formatRupiah(order.tagihan?.total_tagihan || 0)}</span>
                </div>
              </div>

              {/* Payment information */}
              <div className="mt-4 space-y-2 bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">Payment Status</span>
                  <span className="text-sm font-medium">
                    {order.tagihan?.status_pembayaran || "Not Available"}
                  </span>
                </div>

                {order.tagihan?.metode_pembayaran && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 text-sm">
                      Payment Method
                    </span>
                    <span className="text-sm">
                      {order.tagihan.metode_pembayaran === "midtrans"
                        ? `Midtrans${
                            order.tagihan.midtrans_payment_type
                              ? ` (${order.tagihan.midtrans_payment_type})`
                              : ""
                          }`
                        : order.tagihan.metode_pembayaran}
                    </span>
                  </div>
                )}

                {order.tagihan?.tanggal_pembayaran && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 text-sm">Payment Date</span>
                    <span className="text-sm">
                      {formatDate(order.tagihan.tanggal_pembayaran)}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              {/* Dynamic action buttons based on order status */}
              {order.status_pembelian === "Menunggu Pembayaran" &&
                canPayNow() && (
                  <Button className="w-full" onClick={handlePayNow}>
                    Pay Now
                  </Button>
                )}

              {order.status_pembelian === "Dikirim" && (
                <>
                  <Button className="w-full" onClick={handleConfirmDelivery}>
                    <CheckCircle className="h-4 w-4 mr-2" /> 
                    Confirm Delivery
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={handleComplaint}
                  >
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Report Issue
                  </Button>
                </>
              )}

              {order.status_pembelian === "Selesai" && (
                <Button className="w-full" variant="outline">
                  Give Review
                </Button>
              )}

              {order.status_pembelian === "Dibatalkan" && (
                <div className="w-full border border-gray-200 rounded-md p-3 bg-gray-50 text-center text-sm text-gray-500">
                  This order has been cancelled
                </div>
              )}

              <Button variant="outline" className="w-full" asChild>
                <Link href={`/user/katalog`}>Continue Shopping</Link>
              </Button>

              {order.status_pembelian !== "Menunggu Pembayaran" && (
                <Button variant="outline" className="w-full">
                  Download Invoice
                </Button>
              )}
            </CardFooter>
          </Card>

          {/* Help and contact */}
          <Card className="mb-6">
            {" "}
            {/* Added margin-bottom */}
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">
                If you have any questions or issues with your order, please
                contact our customer support.
              </p>
              <Button variant="outline" className="w-full">
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirm Delivery Alert Dialog */}
      <AlertDialog open={isConfirmDeliveryOpen} onOpenChange={setIsConfirmDeliveryOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delivery</AlertDialogTitle>
            <AlertDialogDescription>
              By confirming, you verify that you have received your order and the products match the seller's description.
              <p className="mt-2 font-medium">This action cannot be undone.</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={submitDeliveryConfirmation}
              disabled={isConfirming}
              className="bg-green-600 hover:bg-green-700"
            >
              {isConfirming ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Confirming...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Yes, I've Received My Order
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Complaint Feature Dialog - Feature in development */}
      <Dialog open={isComplaintDialogOpen} onOpenChange={setIsComplaintDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report an Issue</DialogTitle>
            <DialogDescription>
              This feature is currently under development.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <div className="flex items-center justify-center">
              <div className="p-4 bg-orange-50 text-orange-700 rounded-lg border border-orange-200 text-center">
                <AlertCircle className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                <h3 className="font-medium text-lg">Coming Soon</h3>
                <p className="text-sm mt-2">
                  Our complaint system is currently being developed. 
                  If you have issues with your order, please contact customer support.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
