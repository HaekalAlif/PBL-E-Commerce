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
import { Badge } from "@/components/ui/badge";

interface StatusUpdateDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  status: string;
  notes: string;
  setNotes: (notes: string) => void;
  onUpdateStatus: () => void;
}

export default function StatusUpdateDialog({
  isOpen,
  setIsOpen,
  status,
  notes,
  setNotes,
  onUpdateStatus,
}: StatusUpdateDialogProps) {
  // Get status badge color based on status
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Menunggu":
        return "bg-yellow-100 text-yellow-800";
      case "Dibayar":
        return "bg-green-100 text-green-800";
      case "Expired":
        return "bg-gray-100 text-gray-800";
      case "Gagal":
        return "bg-red-100 text-red-800";
      case "Refund":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Update Payment Status</AlertDialogTitle>
          <AlertDialogDescription>
            You are about to change the payment status to{" "}
            <Badge className={getStatusBadgeColor(status)}>{status}</Badge>. 
            This action will update both the payment and related order status.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4">
          <label htmlFor="notes" className="block text-sm font-medium mb-1">
            Admin Notes (optional)
          </label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes about this status change..."
            className="mt-1"
            rows={3}
          />
          
          {status === "Dibayar" && (
            <div className="mt-4 p-3 bg-green-50 text-green-800 rounded-md text-sm">
              This will update the order status to <strong>Dibayar</strong> and record the payment as successful.
            </div>
          )}
          
          {(status === "Gagal" || status === "Expired") && (
            <div className="mt-4 p-3 bg-red-50 text-red-800 rounded-md text-sm">
              This will mark the payment as failed and may cancel the related order.
            </div>
          )}
          
          {status === "Refund" && (
            <div className="mt-4 p-3 bg-purple-50 text-purple-800 rounded-md text-sm">
              You'll be asked to provide additional refund details in the next step.
            </div>
          )}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onUpdateStatus}
            className={status === "Refund" || status === "Dibayar" ? "bg-green-600 hover:bg-green-700" : 
                      (status === "Gagal" || status === "Expired") ? "bg-red-600 hover:bg-red-700" : ""}
          >
            Update Status
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
