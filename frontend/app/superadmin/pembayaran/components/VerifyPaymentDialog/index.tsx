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
import { Check } from "lucide-react";

interface VerifyPaymentDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  notes: string;
  setNotes: (notes: string) => void;
  onVerifyPayment: () => void;
}

export default function VerifyPaymentDialog({
  isOpen,
  setIsOpen,
  notes,
  setNotes,
  onVerifyPayment,
}: VerifyPaymentDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Check className="w-5 h-5 text-green-600" />
            Manually Verify Payment
          </AlertDialogTitle>
          <AlertDialogDescription>
            You are about to manually mark this payment as successful. This will update the order status to allow processing to begin.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4">
          <div className="bg-amber-50 p-3 rounded-md text-sm text-amber-800 mb-4">
            <p className="font-medium">Important:</p>
            <p>Only verify payments when you have confirmed the payment was successful through other means (e.g., bank statement, payment gateway dashboard).</p>
          </div>
          
          <label htmlFor="verify-notes" className="block text-sm font-medium mb-1">
            Admin Notes (required)
          </label>
          <Textarea
            id="verify-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Explain why you're manually verifying this payment..."
            className="mt-1"
            rows={3}
            required
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onVerifyPayment}
            disabled={!notes.trim()}
            className="bg-green-600 hover:bg-green-700"
          >
            Verify Payment
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
