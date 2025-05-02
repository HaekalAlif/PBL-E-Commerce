import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, RefreshCw } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { PaymentComponentProps } from "../types";

export const PaymentComponent = ({
  invoice,
  paymentStatus,
  timeLeft,
  paymentLoading,
  onPayment,
}: PaymentComponentProps) => {
  return (
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
        {paymentStatus === "Menunggu" && timeLeft && timeLeft !== "Expired" ? (
          <Button
            className="w-full"
            onClick={onPayment}
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

        {paymentStatus === "Menunggu" && (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              toast.info("Refreshing payment status...");
            }}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Status
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
