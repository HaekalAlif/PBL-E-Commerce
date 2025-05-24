"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaymentComponent } from "./components/PaymentComponent";
import { OrderSummary } from "./components/OrderSummary";
import { ShippingInfo } from "./components/ShippingInfo";
import { usePayment } from "./hooks/usePayment";
import { useCountdown } from "./hooks/useCountdown";
import { PaymentSkeleton } from "./components/PaymentSkeleton";
import { motion } from "framer-motion";

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
    return <PaymentSkeleton />;
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50/40 to-white py-12">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-lg mx-auto"
          >
            <Alert
              variant="destructive"
              className="mb-4 bg-white/50 backdrop-blur-sm border-none"
            >
              <AlertCircle className="h-4 w-4 mr-2" />
              <AlertTitle>
                {!invoice ? "Invoice Not Found" : "Error"}
              </AlertTitle>
              <AlertDescription>
                {error || "The payment information could not be found."}
              </AlertDescription>
            </Alert>
            <Button
              onClick={() => router.push("/user/orders")}
              className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white"
            >
              View My Orders
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/40 to-white">
      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-orange-200/20 rounded-full blur-3xl" />
        <div className="absolute inset-0 opacity-[0.015]" />
      </div>

      <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-center bg-gradient-to-r from-[#F79E0E] to-[#FFB648] bg-clip-text text-transparent">
            Payment Details
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <OrderSummary
                invoice={invoice}
                paymentStatus={paymentStatus}
                timeLeft={timeLeft}
              />
              <ShippingInfo invoice={invoice} />
            </div>
            <div className="lg:w-full">
              <PaymentComponent
                invoice={invoice}
                paymentStatus={paymentStatus}
                timeLeft={timeLeft}
                paymentLoading={paymentLoading}
                onPayment={handlePayment}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
