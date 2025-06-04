import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, MessageSquare } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface BulkActionsBarProps {
  selectedCount: number;
  onBulkAction: (action: string, notes: string) => Promise<void>;
  onClearSelection: () => void;
}

export default function BulkActionsBar({
  selectedCount,
  onBulkAction,
  onClearSelection,
}: BulkActionsBarProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<string>("");
  const [notes, setNotes] = useState("");

  if (selectedCount === 0) return null;

  const handleBulkAction = (action: string) => {
    setActionType(action);
    setIsDialogOpen(true);
  };

  const confirmBulkAction = async () => {
    await onBulkAction(actionType, notes);
    setIsDialogOpen(false);
    setActionType("");
    setNotes("");
    onClearSelection();
  };

  const getActionTitle = () => {
    switch (actionType) {
      case "approve":
        return "Approve Selected Withdrawals";
      case "reject":
        return "Reject Selected Withdrawals";
      default:
        return "Bulk Action";
    }
  };

  const getActionDescription = () => {
    switch (actionType) {
      case "approve":
        return `Are you sure you want to approve ${selectedCount} withdrawal request(s)?`;
      case "reject":
        return `Are you sure you want to reject ${selectedCount} withdrawal request(s)?`;
      default:
        return "";
    }
  };

  return (
    <>
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{selectedCount} selected</Badge>
            <span className="text-sm text-gray-600">withdrawal requests</span>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => handleBulkAction("approve")}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Approve
            </Button>

            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleBulkAction("reject")}
            >
              <XCircle className="h-4 w-4 mr-1" />
              Reject
            </Button>

            <Button size="sm" variant="outline" onClick={onClearSelection}>
              Clear
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{getActionTitle()}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-gray-600">{getActionDescription()}</p>

            <div className="space-y-2">
              <label className="text-sm font-medium">Notes</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes for this bulk action..."
                className="min-h-[80px]"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={confirmBulkAction}
                disabled={!notes.trim()}
                className={
                  actionType === "approve"
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-red-600 hover:bg-red-700 text-white"
                }
              >
                Confirm {actionType === "approve" ? "Approval" : "Rejection"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
