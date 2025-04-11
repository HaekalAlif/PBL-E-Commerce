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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { formatRupiah } from "@/lib/formatter";
import { useEffect } from "react";

interface RefundDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  reason: string;
  setReason: (reason: string) => void;
  amount: number | null;
  setAmount: (amount: number | null) => void;
  isFullRefund: boolean;
  setIsFullRefund: (isFullRefund: boolean) => void;
  totalAmount: number;
  onProcessRefund: () => void;
}

export default function RefundDialog({
  isOpen,
  setIsOpen,
  reason,
  setReason,
  amount,
  setAmount,
  isFullRefund,
  setIsFullRefund,
  totalAmount,
  onProcessRefund,
}: RefundDialogProps) {
  // Set the amount to the total amount when full refund is selected
  useEffect(() => {
    if (isFullRefund) {
      setAmount(totalAmount);
    }
  }, [isFullRefund, totalAmount, setAmount]);

  // When dialog opens, reset form if needed
  useEffect(() => {
    if (isOpen && isFullRefund) {
      setAmount(totalAmount);
    }
  }, [isOpen, isFullRefund, totalAmount, setAmount]);

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Process Refund</AlertDialogTitle>
          <AlertDialogDescription>
            You are processing a refund for payment of {formatRupiah(totalAmount)}.
            This action will mark the payment as refunded.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4 space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="full-refund" 
              checked={isFullRefund}
              onCheckedChange={(checked) => setIsFullRefund(checked as boolean)}
            />
            <Label htmlFor="full-refund" className="text-base cursor-pointer">
              Full refund ({formatRupiah(totalAmount)})
            </Label>
          </div>

          {!isFullRefund && (
            <div className="space-y-2">
              <Label htmlFor="refund-amount">Refund Amount</Label>
              <Input
                id="refund-amount"
                type="number"
                value={amount || ""}
                onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : null)}
                placeholder="Enter refund amount"
                min={1}
                max={totalAmount}
              />
              {amount && amount > totalAmount && (
                <p className="text-sm text-red-500">
                  Refund amount cannot exceed the total payment amount.
                </p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="refund-reason" className="font-medium">
              Refund Reason (required)
            </Label>
            <Textarea
              id="refund-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why this payment is being refunded..."
              rows={3}
              required
            />
          </div>

          <div className="bg-yellow-50 p-3 rounded-md text-sm text-yellow-800">
            <p className="font-medium mb-1">Note:</p>
            <p>
              This will record the refund in the system. Depending on your payment 
              gateway, you may need to process the actual refund separately in the 
              payment provider's dashboard.
            </p>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onProcessRefund}
            disabled={!reason.trim() || (isFullRefund ? false : !amount || amount <= 0 || amount > totalAmount)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Process Refund
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
