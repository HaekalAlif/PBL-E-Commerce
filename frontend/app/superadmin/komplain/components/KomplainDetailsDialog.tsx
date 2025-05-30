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
import { CircleDot } from "lucide-react";
import Image from "next/image";
import { Komplain } from "../types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useReturManagement } from "../hooks/useReturManagement"; // Import the new hook

interface KomplainDetailsDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  komplain: Komplain | null;
  onProcessKomplain: (status: string, notes: string) => void;
  onSuccess: () => void; // Add onSuccess prop
}

export default function KomplainDetailsDialog({
  isOpen,
  setIsOpen,
  komplain,
  onProcessKomplain,
  onSuccess, // Use onSuccess
}: KomplainDetailsDialogProps) {
  const [notes, setNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isReturProcessed, setIsReturProcessed] = useState(false); // Track if retur is processed
  const { processRetur } = useReturManagement(); // Use the new hook

  if (!komplain) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Menunggu":
        return "bg-yellow-100 text-yellow-800";
      case "Diproses":
        return "bg-blue-100 text-blue-800";
      case "Selesai":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getReturStatusColor = (status: string) => {
    switch (status) {
      case "Menunggu":
        return "bg-yellow-100 text-yellow-800";
      case "Diterima":
        return "bg-green-100 text-green-800";
      case "Ditolak":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd MMMM yyyy", { locale: id });
  };

  const handleProcess = () => {
    onProcessKomplain("Diproses", notes);
  };

  const handleApproveRetur = async () => {
    if (komplain.retur) {
      const success = await processRetur(
        komplain.retur.id_retur,
        "Disetujui",
        notes
      );
      if (success) {
        onSuccess(); // Call onSuccess to refresh data
        setIsOpen(false); // Close the dialog
        setIsReturProcessed(true); // Set retur as processed
      }
    }
  };

  const handleRejectRetur = async () => {
    if (komplain.retur) {
      const success = await processRetur(
        komplain.retur.id_retur,
        "Ditolak",
        notes
      );
      if (success) {
        onSuccess(); // Call onSuccess to refresh data
        setIsOpen(false); // Close the dialog
        setIsReturProcessed(true); // Set retur as processed
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-[800px] max-h-[70vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detail Komplain #{komplain.id_komplain}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="komplain" className="space-y-4">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="komplain">Detail Komplain</TabsTrigger>
            <TabsTrigger value="retur" disabled={!komplain.retur}>
              Detail Retur
            </TabsTrigger>
          </TabsList>

          {/* Content tabs */}
          {/* Komplain tab */}
          <TabsContent value="komplain" className="space-y-4">
            {/* Status and Date */}
            <div className="flex justify-between items-center">
              <Badge className={getStatusColor(komplain.status_komplain)}>
                {komplain.status_komplain}
              </Badge>
              <span className="text-sm text-gray-500">
                {format(new Date(komplain.created_at), "dd MMMM yyyy, HH:mm", {
                  locale: id,
                })}
              </span>
            </div>

            {/* Customer Info */}
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-gray-500">Customer</h4>
              <div className="space-y-1">
                <p className="font-medium">{komplain.user?.name}</p>
                <p className="text-sm text-gray-600">{komplain.user?.email}</p>
              </div>
            </div>

            {/* Complaint Details */}
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">
                  Alasan Komplain
                </h4>
                <p className="font-medium">{komplain.alasan_komplain}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">
                  Detail Komplain
                </h4>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {komplain.isi_komplain}
                </p>
              </div>
            </div>

            {/* Complaint Image */}
            {komplain.bukti_komplain && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-500">
                  Bukti Foto
                </h4>
                <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-gray-200">
                  <Image
                    src={komplain.bukti_komplain}
                    alt="Bukti Komplain"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            )}

            {/* Admin Notes */}
            {komplain.admin_notes && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-500">
                  Catatan Admin
                </h4>
                <p className="text-sm text-gray-600 whitespace-pre-wrap bg-gray-50 p-3 rounded-lg border border-gray-100">
                  {komplain.admin_notes}
                </p>
              </div>
            )}

            {/* Process Complaint Section - Simplified */}
            {komplain.status_komplain === "Menunggu" && (
              <div className="border-t pt-4">
                <div className="space-y-3">
                  {isProcessing ? (
                    <>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Catatan Admin
                        </label>
                        <Textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Tambahkan catatan untuk komplain ini..."
                          className="min-h-[80px]"
                        />
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsProcessing(false);
                            setNotes("");
                          }}
                        >
                          Batal
                        </Button>
                        <Button
                          onClick={handleProcess}
                          disabled={!notes}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          Terima & Proses
                        </Button>
                        <Button
                          onClick={() => onProcessKomplain("Ditolak", notes)}
                          disabled={!notes}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          Tolak Komplain
                        </Button>
                      </div>
                    </>
                  ) : (
                    <Button
                      onClick={() => setIsProcessing(true)}
                      className="w-full bg-[#F79E0E] hover:bg-[#F79E0E]/90"
                    >
                      <CircleDot className="mr-2 h-4 w-4" />
                      Proses Komplain Ini
                    </Button>
                  )}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Retur Information Section */}
          <TabsContent value="retur" className="space-y-4">
            {komplain?.retur ? (
              <div className="space-y-3">
                <h3 className="font-medium mb-2">Informasi Retur</h3>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Status Retur</span>
                  <Badge
                    className={getReturStatusColor(komplain.retur.status_retur)}
                  >
                    {komplain.retur.status_retur}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tanggal Pengajuan</span>
                  <span>{formatDate(komplain.retur.tanggal_pengajuan)}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-sm text-gray-600">Alasan Retur</span>
                  <p className="text-sm">{komplain.retur.alasan_retur}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm text-gray-600">Deskripsi Retur</span>
                  <p className="text-sm bg-gray-50/80 p-3 rounded-lg">
                    {komplain.retur.deskripsi_retur}
                  </p>
                </div>
                {komplain.retur.foto_bukti && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-500">
                      Bukti Foto Retur
                    </h4>
                    <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-gray-200">
                      <Image
                        src={komplain.retur.foto_bukti}
                        alt="Bukti Retur"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                )}
                {/* Add Admin Notes Section */}
                {komplain.retur.admin_notes && (
                  <div className="space-y-1">
                    <span className="text-sm text-gray-600">Catatan Admin</span>
                    <p className="text-sm bg-gray-50/80 p-3 rounded-lg">
                      {komplain.retur.admin_notes}
                    </p>
                  </div>
                )}
                {!komplain.retur.admin_notes && !isReturProcessed && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Catatan Admin</label>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Tambahkan catatan untuk retur ini..."
                      className="min-h-[80px]"
                    />
                  </div>
                )}
                {/* Add Approve and Reject Buttons */}
                {komplain.retur.status_retur === "Menunggu Persetujuan" &&
                  !isReturProcessed && (
                    <div className="flex justify-end gap-2">
                      <Button
                        onClick={() => handleApproveRetur()}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Setujui Retur
                      </Button>
                      <Button
                        onClick={() => handleRejectRetur()}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        Tolak Retur
                      </Button>
                    </div>
                  )}
              </div>
            ) : (
              <div className="text-center py-8">
                <h3 className="mt-2 font-medium">No Retur Information</h3>
                <p className="text-sm text-muted-foreground">
                  No retur information available for this complaint.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
