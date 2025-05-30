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
import { Loader2, Receipt } from "lucide-react";

interface OrderSummaryProps {
  subtotal: number;
  totalShipping: number;
  adminFee: number;
  total: number;
  totalSavings: number;
  isFromOffer: boolean;
  processingCheckout: boolean;
  allStoresReadyForCheckout: () => boolean;
  handleCheckout: () => Promise<void>;
}

export const OrderSummary = ({ ...props }: OrderSummaryProps) => {
  return (
    <div className="w-full lg:w-[380px]">
      <Card className="border-amber-100/50 shadow-md bg-white/60 backdrop-blur-sm">
        <CardHeader className="border-b border-amber-100/30">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-[#F79E0E] to-[#FFB648] rounded-full">
              <Receipt className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
              Order Summary
            </span>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 px-4">
          <div className="space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Products Subtotal</span>
              <span>{formatRupiah(props.subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Total Shipping</span>
              <span>{formatRupiah(props.totalShipping)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Admin Fee</span>
              <span>{formatRupiah(props.adminFee)}</span>
            </div>
            {props.isFromOffer && props.totalSavings > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Total Savings</span>
                <span>-{formatRupiah(props.totalSavings)}</span>
              </div>
            )}
            <Separator className="my-2 bg-amber-100" />
            <div className="flex justify-between font-semibold">
              <span className="text-gray-800">Total</span>
              <span className="text-amber-500">
                {formatRupiah(props.total)}
              </span>
            </div>
          </div>

          <div className="text-sm text-gray-500 pt-4 border-t border-amber-100/30">
            <p>Payment method: Midtrans Payment Gateway</p>
            <p className="mt-1">
              You can choose your preferred payment method on the payment page.
            </p>
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0">
          <Button
            className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 
                     text-white font-medium shadow-sm"
            disabled={
              props.processingCheckout || !props.allStoresReadyForCheckout()
            }
            onClick={props.handleCheckout}
          >
            {props.processingCheckout ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </span>
            ) : (
              "Proceed to Payment"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
