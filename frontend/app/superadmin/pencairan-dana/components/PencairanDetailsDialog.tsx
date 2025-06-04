import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { CheckCircle, XCircle, Clock, MessageSquare } from "lucide-react";
import { PengajuanPencairan } from "../types";
import { Textarea } from "@/components/ui/textarea";
import { formatRupiah } from "@/lib/utils";

interface PencairanDetailsDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  pencairan: PengajuanPencairan | null;
  onProcessPencairan: (action: string, notes: string) => void;
  onAddComment: (notes: string) => void;
}

export default function PencairanDetailsDialog({
  isOpen,
  setIsOpen,
  pencairan,
  onProcessPencairan,
  onAddComment,
}: PencairanDetailsDialogProps) {
  const [notes, setNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionType, setActionType] = useState<string>("");

  if (!pencairan) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Menunggu":
        return "bg-yellow-100 text-yellow-800";
      case "Diproses":
        return "bg-blue-100 text-blue-800";
      case "Selesai":
        return "bg-green-100 text-green-800";
      case "Ditolak":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd MMMM yyyy, HH:mm", { locale: id });
  };

  const handleProcess = (action: string) => {
    setActionType(action);
    setIsProcessing(true);
  };

  const confirmProcess = () => {
    onProcessPencairan(actionType, notes);
    setIsProcessing(false);
    setActionType("");
    setNotes("");
  };

  const handleAddComment = () => {
    onAddComment(notes);
    setNotes("");
  };

  const canProcess =
    pencairan.status_pencairan === "Menunggu" ||
    pencairan.status_pencairan === "Diproses";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detail Pencairan #{pencairan.id_pencairan}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Date */}
          <div className="flex justify-between items-center">
            <Badge className={getStatusColor(pencairan.status_pencairan)}>
              {pencairan.status_pencairan}
            </Badge>
            <span className="text-sm text-gray-500">
              {formatDate(pencairan.tanggal_pengajuan)}
            </span>
          </div>

          {/* Seller Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-500">
                Seller Information
              </h4>
              <div className="space-y-1">
                <p className="font-medium">{pencairan.user?.name}</p>
                <p className="text-sm text-gray-600">{pencairan.user?.email}</p>
                <p className="text-sm text-gray-600">
                  @{pencairan.user?.username}
                </p>
              </div>
            </div>

            {/* Balance Info */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-500">
                Balance Information
              </h4>
              <div className="space-y-1">
                <p className="text-sm">
                  <span className="text-gray-600">Available: </span>
                  <span className="font-medium">
                    {formatRupiah(pencairan.saldo_penjual?.saldo_tersedia || 0)}
                  </span>
                </p>
                <p className="text-sm">
                  <span className="text-gray-600">Held: </span>
                  <span className="font-medium">
                    {formatRupiah(pencairan.saldo_penjual?.saldo_tertahan || 0)}
                  </span>
                </p>
                <p className="text-sm">
                  <span className="text-gray-600">Total: </span>
                  <span className="font-medium">
                    {formatRupiah(pencairan.saldo_penjual?.total_saldo || 0)}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Withdrawal Details */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Withdrawal Details</h4>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h5 className="text-sm font-medium text-gray-500 mb-1">
                  Amount
                </h5>
                <p className="text-2xl font-bold text-[#F79E0E]">
                  {formatRupiah(pencairan.jumlah_dana)}
                </p>
              </div>

              <div>
                <h5 className="text-sm font-medium text-gray-500 mb-1">Bank</h5>
                <p className="font-medium">{pencairan.nama_bank}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h5 className="text-sm font-medium text-gray-500 mb-1">
                  Account Number
                </h5>
                <p className="font-medium">{pencairan.nomor_rekening}</p>
              </div>

              <div>
                <h5 className="text-sm font-medium text-gray-500 mb-1">
                  Account Holder
                </h5>
                <p className="font-medium">{pencairan.nama_pemilik_rekening}</p>
              </div>
            </div>

            {pencairan.keterangan && (
              <div>
                <h5 className="text-sm font-medium text-gray-500 mb-1">
                  Notes from Seller
                </h5>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {pencairan.keterangan}
                </p>
              </div>
            )}
          </div>

          {/* Admin Notes */}
          {pencairan.catatan_admin && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-500">Admin Notes</h4>
              <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-100">
                {pencairan.catatan_admin}
              </p>
            </div>
          )}

          {/* Processing Dates */}
          {pencairan.tanggal_pencairan && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-500">
                Processing Date
              </h4>
              <p className="text-sm text-gray-600">
                {formatDate(pencairan.tanggal_pencairan)}
              </p>
            </div>
          )}

          {/* Action Section */}
          {isProcessing ? (
            <div className="border-t pt-4 space-y-3">
              <h4 className="font-medium">
                {actionType === "approve"
                  ? "Approve Withdrawal"
                  : actionType === "reject"
                  ? "Reject Withdrawal"
                  : actionType === "complete"
                  ? "Complete Withdrawal"
                  : "Process Withdrawal"}
              </h4>

              <div className="space-y-2">
                <label className="text-sm font-medium">Admin Notes</label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={
                    actionType === "complete"
                      ? "Confirm that payment has been sent manually to the account..."
                      : "Add notes for this action..."
                  }
                  className="min-h-[80px]"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsProcessing(false);
                    setActionType("");
                    setNotes("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmProcess}
                  disabled={!notes.trim()}
                  className={
                    actionType === "approve"
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : actionType === "complete"
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-red-600 hover:bg-red-700 text-white"
                  }
                >
                  {actionType === "approve"
                    ? "Approve"
                    : actionType === "reject"
                    ? "Reject"
                    : actionType === "complete"
                    ? "Mark as Completed"
                    : "Process"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="border-t pt-4">
              {canProcess ? (
                <div className="space-y-3">
                  {pencairan.status_pencairan === "Menunggu" && (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleProcess("approve")}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        Approve & Process
                      </Button>
                      <Button
                        onClick={() => handleProcess("reject")}
                        variant="destructive"
                        className="flex-1"
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  )}

                  {pencairan.status_pencairan === "Diproses" && (
                    <Button
                      onClick={() => handleProcess("complete")}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Mark as Completed (Payment Sent)
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Add Comment</label>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add a comment or note for this withdrawal..."
                      className="min-h-[80px]"
                    />
                  </div>

                  <Button
                    onClick={handleAddComment}
                    disabled={!notes.trim()}
                    variant="outline"
                    className="w-full"
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Add Comment
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
