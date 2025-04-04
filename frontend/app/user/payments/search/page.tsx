"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

export default function SearchPayment() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderCode = searchParams.get("order");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderCode) {
      toast.error("No order code provided");
      router.push("/user/orders");
      return;
    }

    findPaymentForOrder(orderCode);
  }, [orderCode]);

  const findPaymentForOrder = async (code: string) => {
    try {
      setLoading(true);
      setError(null);

      // First get the order details
      const orderResponse = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/purchases/${code}`
      );

      console.log("Order data:", orderResponse.data);

      if (orderResponse.data.status === "success") {
        const orderData = orderResponse.data.data;

        // Check if the order has an associated tagihan
        if (orderData.tagihan?.kode_tagihan) {
          console.log("Found tagihan:", orderData.tagihan.kode_tagihan);
          // Redirect to the payment page
          router.push(`/user/payments/${orderData.tagihan.kode_tagihan}`);
          return;
        }

        // If no tagihan found but status is awaiting payment, try to create one
        if (orderData.status_pembelian === "Menunggu Pembayaran") {
          toast.info("Creating payment for your order...");

          // Call an endpoint to create a payment for this order
          try {
            const createResponse = await axiosInstance.post(
              `${process.env.NEXT_PUBLIC_API_URL}/purchases/${code}/create-payment`,
              {
                metode_pembayaran: "midtrans",
                biaya_kirim: 15000, // Default shipping cost
                opsi_pengiriman: "Standard Shipping",
              }
            );

            console.log("Create payment response:", createResponse.data);

            if (createResponse.data.status === "success") {
              const kodeTagihan = createResponse.data.data.kode_tagihan;
              router.push(`/user/payments/${kodeTagihan}`);
              return;
            } else {
              setError(
                "Failed to create payment: " +
                  (createResponse.data.message || "Unknown error")
              );
              toast.error("Failed to create payment");
            }
          } catch (error: any) {
            console.error("Error creating payment:", error);
            setError(
              "Error creating payment: " +
                (error.response?.data?.message || error.message)
            );
            toast.error("Failed to create payment");
          }
        } else {
          // Order doesn't need payment
          setError(
            `This order (status: ${orderData.status_pembelian}) doesn't require payment`
          );
          toast.info(
            `This order (status: ${orderData.status_pembelian}) doesn't require payment`
          );
          setTimeout(() => router.push(`/user/orders/${code}`), 3000);
        }
      } else {
        setError("Order not found: " + (orderResponse.data.message || ""));
        toast.error("Order not found");
      }
    } catch (error: any) {
      console.error("Error finding payment:", error);
      setError(
        "Failed to find payment for order: " +
          (error.response?.data?.message || error.message)
      );
      toast.error("Failed to find payment for order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-12 flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Finding payment for your order</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          {loading ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin" />
              <p>Looking up payment details for order #{orderCode}...</p>
            </>
          ) : error ? (
            <>
              <AlertCircle className="h-8 w-8 text-red-500" />
              <p className="text-center text-red-500">{error}</p>
            </>
          ) : null}
        </CardContent>
        <CardFooter className="flex justify-center gap-2">
          <Button variant="outline" onClick={() => router.push("/user/orders")}>
            Back to Orders
          </Button>
          {error && (
            <Button onClick={() => findPaymentForOrder(orderCode || "")}>
              Try Again
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
