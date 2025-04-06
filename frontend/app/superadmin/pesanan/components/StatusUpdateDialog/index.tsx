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
import { Label } from "@/components/ui/label";

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
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Update Order Status</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to change the status to{" "}
            <strong>{status}</strong>?
            {status === "Dibatalkan" && (
              <div className="mt-2 text-red-500">
                This action will cancel the order and cannot be undone.
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="my-4">
          <Label htmlFor="admin-notes">Admin Notes (optional)</Label>
          <Textarea
            id="admin-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes about this status change"
            className="mt-2"
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onUpdateStatus}
            className={
              status === "Dibatalkan" ? "bg-red-600 hover:bg-red-700" : ""
            }
          >
            Update Status
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
