"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaymentComponent } from "./components/PaymentComponent";
import { OrderSummary } from "./components/OrderSummary";
import { ShippingInfo } from "./components/ShippingInfo";
import { usePayment } from "./hooks/usePayment";
import { useCountdown } from "./hooks/useCountdown";

export default function Payment() {
  const router = useRouter();
  const params = useParams();
  const kode = params?.kode as string;

  const {
    loading,
    paymentLoading,
    paymentStatus,
    error,
    invoice,
    fetchInvoiceDetails,
    checkPaymentStatus,
    handlePayment,
  } = usePayment(kode);

  const timeLeft = useCountdown(invoice);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      process.env.NEXT_PUBLIC_MIDTRANS_SNAP_URL ||
      "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute(
      "data-client-key",
      process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ||
        "SB-Mid-client-_4NAZnUerQM6Sig8"
    );
    script.type = "text/javascript";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!kode) return;
    fetchInvoiceDetails();
    const intervalId = setInterval(checkPaymentStatus, 10000);
    return () => clearInterval(intervalId);
  }, [kode]);

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <OrderSummary
            invoice={invoice}
            paymentStatus={paymentStatus}
            timeLeft={timeLeft}
          />
          <ShippingInfo invoice={invoice} />
        </div>
        <div>
          <PaymentComponent
            invoice={invoice}
            paymentStatus={paymentStatus}
            timeLeft={timeLeft}
            paymentLoading={paymentLoading}
            onPayment={handlePayment}
          />
        </div>
      </div>
    </div>
  );
}
