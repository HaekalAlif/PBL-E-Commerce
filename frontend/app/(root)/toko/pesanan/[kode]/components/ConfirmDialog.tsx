import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isProcessing: boolean;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  isProcessing,
}: ConfirmDialogProps) {
  const handleConfirm = async () => {
    try {
      await onConfirm();
      // Tutup dialog setelah berhasil
      onOpenChange(false);
    } catch (error) {
      console.error("Error processing order:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Proses Pesanan</DialogTitle>
          <DialogDescription>
            Konfirmasi bahwa Anda telah menerima pesanan ini dan akan mulai
            memproses pesanan.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-gray-700 mb-2">
            Dengan mengkonfirmasi, Anda menyatakan telah menerima pesanan dan
            berkomitmen untuk memulai persiapan barang.
          </p>
          <p className="text-sm text-gray-700">
            Status pesanan akan diperbarui menjadi "Diproses".
          </p>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="mt-2 sm:mt-0"
          >
            Batal
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isProcessing}
            className="bg-[#F79E0E] hover:bg-[#F79E0E]/90"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Konfirmasi & Proses
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
