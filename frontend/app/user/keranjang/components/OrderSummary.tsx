import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { formatRupiah } from "@/lib/utils";

interface OrderSummaryProps {
  subTotal: number;
  total: number;
  itemCount: number;
  processingCheckout: boolean;
  onCheckout: () => void;
  onMakeOffer: () => void;
}

export function OrderSummary({
  subTotal,
  total,
  itemCount,
  processingCheckout,
  onCheckout,
  onMakeOffer,
}: OrderSummaryProps) {
  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-500">Subtotal ({itemCount} items)</span>
            <span>{formatRupiah(subTotal)}</span>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>{formatRupiah(total)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-3">
        <Button
          className="w-full"
          disabled={processingCheckout || itemCount === 0}
          onClick={onCheckout}
        >
          {processingCheckout ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Checkout"
          )}
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={onMakeOffer}
          disabled={itemCount === 0}
        >
          Make an Offer
        </Button>
      </CardFooter>
    </Card>
  );
}
