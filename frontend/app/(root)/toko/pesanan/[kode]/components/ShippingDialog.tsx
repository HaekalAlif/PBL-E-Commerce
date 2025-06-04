import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, UploadCloud, X, Truck } from "lucide-react";
import { ShippingFormData } from "../types";
import { motion, AnimatePresence } from "framer-motion";

interface ShippingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onShip: (data: ShippingFormData) => Promise<boolean>;
  isSubmitting: boolean;
}

export function ShippingDialog({
  open,
  onOpenChange,
  onShip,
  isSubmitting,
}: ShippingDialogProps) {
  const [nomor_resi, setNomorResi] = useState("");
  const [catatan_pengiriman, setCatatanPengiriman] = useState("");
  const [bukti_pengiriman, setBuktiPengiriman] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBuktiPengiriman(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bukti_pengiriman) {
      // Optionally show an error message here
      return;
    }
    const success = await onShip({
      nomor_resi,
      catatan_pengiriman,
      bukti_pengiriman,
    });

    if (success) {
      setNomorResi("");
      setCatatanPengiriman("");
      setBuktiPengiriman(null);
      setPreviewUrl(null);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] ">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 rounded-lg bg-orange-100">
              <Truck className="h-5 w-5 text-[#F79E0E]" />
            </div>
            Kirim Pesanan
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Masukkan informasi pengiriman dan unggah bukti pengiriman
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              {/* Nomor Resi Input */}
              <div>
                <Label
                  htmlFor="nomor_resi"
                  className="text-gray-700 font-medium"
                >
                  Nomor Resi <span className="text-[#F79E0E]">*</span>
                </Label>
                <Input
                  id="nomor_resi"
                  value={nomor_resi}
                  onChange={(e) => setNomorResi(e.target.value)}
                  placeholder="Masukkan nomor resi pengiriman"
                  className="mt-1.5  border-orange-100 focus:border-[#F79E0E] focus:ring-[#F79E0E]"
                  required
                />
              </div>

              {/* Catatan Pengiriman Textarea */}
              <div>
                <Label
                  htmlFor="catatan_pengiriman"
                  className="text-gray-700 font-medium"
                >
                  Catatan Pengiriman{" "}
                  <span className="text-gray-400 font-normal">(opsional)</span>
                </Label>
                <Textarea
                  id="catatan_pengiriman"
                  value={catatan_pengiriman}
                  onChange={(e) => setCatatanPengiriman(e.target.value)}
                  placeholder="Tambahkan catatan untuk pengiriman"
                  className="mt-1.5  border-orange-100 focus:border-[#F79E0E] focus:ring-[#F79E0E] min-h-[80px] resize-none"
                />
              </div>

              {/* File Upload Area */}
              <div>
                <Label
                  htmlFor="bukti_pengiriman"
                  className="text-gray-700 font-medium"
                >
                  Bukti Pengiriman <span className="text-[#F79E0E]">*</span>
                </Label>
                <div className="mt-1.5">
                  <label
                    htmlFor="bukti_pengiriman"
                    className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed
                    rounded-lg cursor-pointer transition-colors duration-200
                    ${
                      previewUrl
                        ? "border-orange-200 bg-orange-50/50"
                        : "border-gray-300 bg-gray-50 hover:bg-orange-50/50 hover:border-[#F79E0E]"
                    }`}
                  >
                    <AnimatePresence mode="wait">
                      {previewUrl ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="relative w-full h-full flex items-center justify-center p-2"
                        >
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="max-h-28 rounded-lg object-contain"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setBuktiPengiriman(null);
                              setPreviewUrl(null);
                            }}
                            className="absolute -top-2 -right-2 p-1 bg-red-100 rounded-full text-red-600 
                                     hover:bg-red-200 transition-colors duration-200"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex flex-col items-center justify-center py-4"
                        >
                          <UploadCloud className="w-8 h-8 mb-2 text-[#F79E0E]" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-medium text-[#F79E0E]">
                              Klik untuk unggah
                            </span>{" "}
                            atau drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG (Maks. 2MB)
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <input
                      id="bukti_pengiriman"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                      required
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-[#F79E0E] text-[#F79E0E] hover:bg-orange-50"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#F79E0E] hover:bg-[#F79E0E]/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mengirim...
                </>
              ) : (
                <>
                  <Truck className="mr-2 h-4 w-4" />
                  Kirim Pesanan
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
