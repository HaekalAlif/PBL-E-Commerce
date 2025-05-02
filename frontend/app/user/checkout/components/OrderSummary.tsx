import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatRupiah } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface OrderSummaryProps {
  subtotal: number;
  totalShipping: number;
  adminFee: number;
  total: number;
  processingCheckout: boolean;
  allStoresReadyForCheckout: () => boolean;
  handleCheckout: () => Promise<void>;
}

export const OrderSummary = ({
  subtotal,
  totalShipping,
  adminFee,
  total,
  processingCheckout,
  allStoresReadyForCheckout,
  handleCheckout,
}: OrderSummaryProps) => {
  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-500">Products Subtotal</span>
            <span>{formatRupiah(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Total Shipping</span>
            <span>{formatRupiah(totalShipping)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Admin Fee</span>
            <span>{formatRupiah(adminFee)}</span>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>{formatRupiah(total)}</span>
          </div>
        </div>

        <div className="text-sm text-gray-500 mt-2">
          <p>Payment method: Midtrans Payment Gateway</p>
          <p className="mt-1">
            You can choose your preferred payment method (Credit Card, Bank
            Transfer, E-Wallet, etc.) on the payment page.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          disabled={processingCheckout || !allStoresReadyForCheckout()}
          onClick={handleCheckout}
        >
          {processingCheckout ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Proceed to Payment"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
