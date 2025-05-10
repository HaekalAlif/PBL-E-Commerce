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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";

interface ConfirmationDialogsProps {
  confirmDeliveryOpen: boolean;
  setConfirmDeliveryOpen: (open: boolean) => void;
  complaintDialogOpen: boolean;
  setComplaintDialogOpen: (open: boolean) => void;
  onConfirmDelivery: () => void;
  isConfirming: boolean;
}

export const ConfirmationDialogs = ({
  confirmDeliveryOpen,
  setConfirmDeliveryOpen,
  complaintDialogOpen,
  setComplaintDialogOpen,
  onConfirmDelivery,
  isConfirming,
}: ConfirmationDialogsProps) => {
  return (
    <>
      <AlertDialog
        open={confirmDeliveryOpen}
        onOpenChange={setConfirmDeliveryOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Penerimaan</AlertDialogTitle>
            <AlertDialogDescription>
              Dengan mengkonfirmasi, Anda menyatakan telah menerima pesanan dan
              produk sesuai dengan deskripsi penjual.
              <p className="mt-2 font-medium">
                Tindakan ini tidak dapat dibatalkan.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirmDelivery}
              disabled={isConfirming}
              className="bg-[#F79E0E] hover:bg-[#E08D0D]"
            >
              {isConfirming ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mengkonfirmasi...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Ya, Saya Sudah Terima Pesanan
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={complaintDialogOpen} onOpenChange={setComplaintDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Laporkan Masalah</DialogTitle>
            <DialogDescription>
              Fitur ini sedang dalam pengembangan.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <div className="flex items-center justify-center">
              <div className="p-4 bg-orange-50 text-orange-700 rounded-lg border border-orange-200 text-center">
                <AlertCircle className="h-8 w-8 text-[#F79E0E] mx-auto mb-2" />
                <h3 className="font-medium text-lg">Segera Hadir</h3>
                <p className="text-sm mt-2">
                  Sistem komplain sedang dalam pengembangan. Jika ada masalah
                  dengan pesanan Anda, silakan hubungi customer support.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button>Tutup</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
