"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
// Replace standard axios with your custom instance
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { formatRupiah } from "@/lib/utils";

interface InvoiceDetails {
  id_tagihan: number;
  kode_tagihan: string;
  total_harga: number;
  biaya_kirim: number;
  opsi_pengiriman: string;
  biaya_admin: number;
  total_tagihan: number;
  metode_pembayaran: string;
  status_pembayaran: string;
  deadline_pembayaran: string;
  midtrans_transaction_id?: string;
  midtrans_payment_type?: string;
  pembelian: {
    kode_pembelian: string;
    status_pembelian: string;
    catatan_pembeli?: string;
    detailPembelian: Array<{
      id_detail_pembelian: number;
      id_detail: number;
      id_barang: number;
      harga_satuan: number;
      jumlah: number;
      subtotal: number;
      barang: {
        nama_barang: string;
        gambarBarang?: Array<{
          url_gambar: string;
        }>;
      };
    }>;
    alamat: {
      nama_penerima: string;
      no_telp: string;
      alamat_lengkap: string;
      kode_pos: string;
      district: { name: string };
      regency: { name: string };
      province: { name: string };
    };
  };
}

// Add Midtrans Snap interface for TypeScript
declare global {
  interface Window {
    snap?: {
      pay: (token: string, options: any) => void;
    };
  }
}

export default function Payment() {
  const router = useRouter();
  const params = useParams();
  const kode = params.kode as string;

  const [invoice, setInvoice] = useState<InvoiceDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentProcessed, setPaymentProcessed] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load Midtrans Snap.js
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      process.env.NEXT_PUBLIC_MIDTRANS_SNAP_URL ||
      "https://app.sandbox.midtrans.com/snap/snap.js";

    // Get client key from environment variables
    const clientKey =
      process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ||
      "SB-Mid-client-_4NAZnUerQM6Sig8";

    // Set data-client-key attribute
    script.setAttribute("data-client-key", clientKey);

    // Set additional attributes
    script.type = "text/javascript";
    script.async = true;

    console.log("Loading Midtrans script with client key:", clientKey);

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Load invoice details and start countdown
  useEffect(() => {
    if (!kode) return;

    fetchInvoiceDetails();

    // Set up interval to check payment status
    const intervalId = setInterval(() => {
      checkPaymentStatus();
    }, 10000); // Check every 10 seconds

    return () => clearInterval(intervalId);
  }, [kode]);

  // Calculate countdown timer
  useEffect(() => {
    if (!invoice || !invoice.deadline_pembayaran) return;

    const calculateTimeLeft = () => {
      const now = new Date();
      const deadline = new Date(invoice.deadline_pembayaran);

      if (deadline <= now) {
        setTimeLeft("Expired");
        return;
      }

      const diffMs = deadline.getTime() - now.getTime();
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const diffSecs = Math.floor((diffMs % (1000 * 60)) / 1000);

      setTimeLeft(
        `${diffHrs.toString().padStart(2, "0")}:${diffMins
          .toString()
          .padStart(2, "0")}:${diffSecs.toString().padStart(2, "0")}`
      );
    };

    calculateTimeLeft();
    const intervalId = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(intervalId);
  }, [invoice]);

  // Fetch invoice details
  const fetchInvoiceDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      // Use axiosInstance with NEXT_PUBLIC_API_URL
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/payments/${kode}`
      );

      if (response.data.status === "success") {
        // Log the data structure to help debug
        console.log("Invoice data from API:", response.data.data);

        // Make sure the invoice data exists
        const invoiceData = response.data.data;
        if (!invoiceData) {
          console.error("No invoice data received");
          setError("Invoice data not found. Please try again.");
          setLoading(false);
          return;
        }

        // Store the invoice data even if it's incomplete
        setInvoice(invoiceData);
        setPaymentStatus(invoiceData.status_pembayaran);

        // Check if payment has already been processed
        if (invoiceData.status_pembayaran === "Dibayar") {
          setPaymentProcessed(true);
        }

        // Check if we're missing pembelian data and need to fetch it separately
        if (!invoiceData.pembelian) {
          console.log(
            "Missing pembelian data, attempting to fetch it separately"
          );
          await fetchPurchaseDetails(invoiceData.id_pembelian);
        } else if (!invoiceData.pembelian.detailPembelian) {
          console.log(
            "Missing detailPembelian data, pembelian relationship may not be fully loaded"
          );
          await fetchPurchaseDetails(invoiceData.id_pembelian);
        }
      } else {
        setError(
          "Failed to load payment details. Invalid response from server."
        );
      }
    } catch (error) {
      console.error("Error fetching invoice details:", error);
      setError("Failed to load payment details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch purchase details separately if they're missing from the invoice
  const fetchPurchaseDetails = async (purchaseId: number) => {
    if (!purchaseId) return;

    try {
      console.log(`Fetching purchase details for ID: ${purchaseId}`);
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/debug/purchases/by-id/${purchaseId}`
      );

      if (response.data.status === "success" && response.data.purchase) {
        console.log("Successfully fetched purchase data:", response.data);

        // Update the invoice with the purchase data
        setInvoice((prev) => {
          if (!prev) return prev;

          return {
            ...prev,
            pembelian: response.data.purchase,
            // Add detailPembelian if it exists in the response
            ...(response.data.details && {
              pembelian: {
                ...response.data.purchase,
                detailPembelian: response.data.details,
              },
            }),
          };
        });
      } else {
        console.error("Failed to fetch purchase details:", response.data);
      }
    } catch (error) {
      console.error("Error fetching purchase details:", error);
    }
  };

  // Check payment status
  const checkPaymentStatus = async () => {
    if (!kode || paymentProcessed) return;

    try {
      // Use axiosInstance with NEXT_PUBLIC_API_URL
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/payments/${kode}/status`
      );

      if (response.data.status === "success") {
        const paymentData = response.data.data;
        setPaymentStatus(paymentData.status_pembayaran);

        // If there was an error before, clear it now
        if (error) {
          setError(null);
        }

        // Update state based on payment status
        if (paymentData.status_pembayaran === "Dibayar") {
          setPaymentProcessed(true);
          toast.success("Payment completed successfully!");
        } else if (
          paymentData.status_pembayaran === "Expired" ||
          paymentData.status_pembayaran === "Gagal"
        ) {
          setPaymentProcessed(true);
        }

        // Log for debugging
        console.log("Payment status updated:", paymentData.status_pembayaran);
      }
    } catch (error) {
      console.error("Error checking payment status:", error);
    }
  };

  // Process payment with Midtrans
  const handlePayment = async () => {
    if (!invoice) return;

    setPaymentLoading(true);
    setError(null); // Clear any previous errors

    try {
      // Use axiosInstance with NEXT_PUBLIC_API_URL
      const response = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_URL}/payments/${kode}/process`
      );

      if (response.data.status === "success") {
        const { snap_token, redirect_url } = response.data.data;

        // Open Midtrans Snap payment page
        if (window.snap && snap_token) {
          window.snap.pay(snap_token, {
            onSuccess: function (result: any) {
              setPaymentProcessed(true);
              setPaymentStatus("Dibayar");
              toast.success("Payment completed successfully!");
              checkPaymentStatus(); // Refresh status from server
            },
            onPending: function (result: any) {
              toast.info("Waiting for your payment");
              checkPaymentStatus(); // Refresh status from server
            },
            onError: function (result: any) {
              console.error("Midtrans payment error:", result);
              toast.error("Payment failed, please try again");
              checkPaymentStatus(); // Refresh status from server
            },
            onClose: function () {
              toast.info("Payment window closed, you can try again");
              // Don't set payment as processed since user may want to retry
              checkPaymentStatus(); // Refresh status from server
            },
          });
        } else if (redirect_url) {
          // Fallback to redirect URL if Snap.js is not loaded
          window.location.href = redirect_url;
        }
      }
    } catch (error: any) {
      console.error("Error processing payment:", error);

      // Display a more helpful error message
      const errorMessage =
        error.response?.data?.message ||
        "Payment processing failed. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading payment details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={() => router.push("/user/orders")}>
          View My Orders
        </Button>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertTitle>Invoice Not Found</AlertTitle>
          <AlertDescription>
            The payment information could not be found. Please check your order
            history.
          </AlertDescription>
        </Alert>
        <Button onClick={() => router.push("/user/orders")}>
          View My Orders
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Payment Details</h1>

      {/* Payment Status Alert */}
      {paymentStatus && (
        <Alert
          variant={
            paymentStatus === "Dibayar"
              ? "default"
              : paymentStatus === "Menunggu"
              ? "default" // Fallback to a valid variant
              : "destructive"
          }
          className="mb-6"
        >
          {paymentStatus === "Dibayar" ? (
            <CheckCircle className="h-4 w-4 mr-2" />
          ) : paymentStatus === "Menunggu" ? (
            <Clock className="h-4 w-4 mr-2" />
          ) : (
            <AlertCircle className="h-4 w-4 mr-2" />
          )}
          <AlertTitle>
            {paymentStatus === "Dibayar"
              ? "Payment Completed"
              : paymentStatus === "Menunggu"
              ? "Payment Pending"
              : paymentStatus === "Expired"
              ? "Payment Expired"
              : "Payment Failed"}
          </AlertTitle>
          <AlertDescription>
            {paymentStatus === "Dibayar"
              ? "Your payment has been received successfully."
              : paymentStatus === "Menunggu"
              ? "Please complete your payment."
              : paymentStatus === "Expired"
              ? "The payment deadline has passed. Please create a new order."
              : "There was an issue with your payment. Please try again."}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Invoice Details */}
        <div className="md:col-span-2 space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Invoice Number</p>
                  <p className="font-medium">{invoice.kode_tagihan}</p>
                </div>
                <Badge
                  variant={
                    paymentStatus === "Dibayar"
                      ? "default"
                      : paymentStatus === "Menunggu"
                      ? "outline"
                      : "secondary"
                  }
                >
                  {paymentStatus === "Dibayar"
                    ? "Paid"
                    : paymentStatus === "Menunggu"
                    ? "Pending"
                    : paymentStatus === "Expired"
                    ? "Expired"
                    : "Failed"}
                </Badge>
              </div>

              {/* Time remaining for payment */}
              {paymentStatus === "Menunggu" &&
                timeLeft &&
                timeLeft !== "Expired" && (
                  <div className="bg-gray-100 p-3 rounded-md">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-500" />
                      <p className="text-sm text-gray-500">Time Remaining</p>
                    </div>
                    <p className="font-mono text-lg font-bold">{timeLeft}</p>
                  </div>
                )}

              <Separator />

              {/* Product list - Improved null checking and fallbacks */}
              <div className="space-y-3">
                {invoice?.pembelian?.detailPembelian &&
                Array.isArray(invoice.pembelian.detailPembelian) &&
                invoice.pembelian.detailPembelian.length > 0 ? (
                  // We have product details, display them
                  invoice.pembelian.detailPembelian.map((item) => (
                    <div
                      key={
                        item.id_detail ||
                        item.id_detail_pembelian ||
                        `item-${Math.random()}`
                      }
                      className="flex justify-between items-center"
                    >
                      <div className="flex-1">
                        <p className="font-medium">
                          {item.barang?.nama_barang || "Unknown Product"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {item.jumlah} x {formatRupiah(item.harga_satuan || 0)}
                        </p>
                      </div>
                      <p className="font-medium">
                        {formatRupiah(item.subtotal || 0)}
                      </p>
                    </div>
                  ))
                ) : (
                  // No product details available, show a simplified summary
                  <div className="py-3">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex-1">
                        <p className="font-medium">Order Items</p>
                        <p className="text-sm text-gray-500">
                          Details not available
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-500 text-sm">
                      This transaction contains products with a total value of{" "}
                      {formatRupiah(invoice?.total_harga || 0)}
                    </p>
                  </div>
                )}
              </div>

              <Separator />

              {/* Total calculation */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span>{formatRupiah(invoice?.total_harga || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Shipping ({invoice?.opsi_pengiriman || "Standard"})
                  </span>
                  <span>{formatRupiah(invoice?.biaya_kirim || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Admin Fee</span>
                  <span>{formatRupiah(invoice?.biaya_admin || 0)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatRupiah(invoice?.total_tagihan || 0)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Information - Improved null checking */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent>
              {invoice?.pembelian?.alamat ? (
                <div className="space-y-2">
                  <div>
                    <p className="font-medium">
                      {invoice.pembelian.alamat.nama_penerima || "N/A"}
                    </p>
                    <p className="text-sm">
                      {invoice.pembelian.alamat.no_telp || "N/A"}
                    </p>
                  </div>
                  <p className="text-sm">
                    {invoice.pembelian.alamat.alamat_lengkap || "N/A"},{" "}
                    {invoice.pembelian.alamat.district?.name || "N/A"},{" "}
                    {invoice.pembelian.alamat.regency?.name || "N/A"},{" "}
                    {invoice.pembelian.alamat.province?.name || "N/A"},{" "}
                    {invoice.pembelian.alamat.kode_pos || "N/A"}
                  </p>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Shipping Method</p>
                    <p>{invoice.opsi_pengiriman || "Standard Shipping"}</p>
                  </div>
                  {invoice.pembelian.catatan_pembeli && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">Notes</p>
                      <p>{invoice.pembelian.catatan_pembeli}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-gray-500">Shipping to:</p>
                  <p className="font-medium">
                    Shipping address details not available
                  </p>
                  <p className="text-sm">
                    Shipping method:{" "}
                    {invoice?.opsi_pengiriman || "Standard Shipping"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Payment Action */}
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                {invoice.metode_pembayaran === "midtrans"
                  ? "Midtrans Payment Gateway"
                  : invoice.metode_pembayaran}
              </p>
              {invoice.midtrans_payment_type && (
                <p className="text-sm text-gray-500 mt-1">
                  Payment type: {invoice.midtrans_payment_type}
                </p>
              )}
            </CardContent>
            <Separator />
            <CardFooter className="flex flex-col gap-4 pt-4">
              {paymentStatus === "Menunggu" &&
              timeLeft &&
              timeLeft !== "Expired" ? (
                <Button
                  className="w-full"
                  onClick={handlePayment}
                  disabled={paymentLoading}
                >
                  {paymentLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Pay Now"
                  )}
                </Button>
              ) : paymentStatus === "Dibayar" ? (
                <div className="w-full">
                  <Button className="w-full mb-3" variant="outline" asChild>
                    <Link href="/user/orders">View Orders</Link>
                  </Button>
                  <Button className="w-full" asChild>
                    <Link href="/user/katalog">Continue Shopping</Link>
                  </Button>
                </div>
              ) : (
                <div className="w-full">
                  <Button className="w-full mb-3" variant="outline" asChild>
                    <Link href="/user/orders">View Orders</Link>
                  </Button>
                  <Button className="w-full" variant="default" asChild>
                    <Link href="/user/katalog">Shop Again</Link>
                  </Button>
                </div>
              )}

              {/* Refresh button for payment status */}
              {paymentStatus === "Menunggu" && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    checkPaymentStatus();
                    toast.info("Refreshing payment status...");
                  }}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh Status
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
