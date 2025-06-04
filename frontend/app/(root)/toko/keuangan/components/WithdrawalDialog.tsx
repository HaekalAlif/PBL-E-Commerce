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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Wallet, Loader2 } from "lucide-react";
import { WithdrawalFormData } from "../types";
import { formatRupiah } from "@/lib/utils";

interface WithdrawalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: WithdrawalFormData) => Promise<boolean>;
  isSubmitting: boolean;
  maxAmount: number;
}

const BANKS = [
  "BCA",
  "BRI",
  "BNI",
  "Mandiri",
  "CIMB Niaga",
  "Danamon",
  "Permata",
  "BTN",
  "BSI",
  "BTPN",
  "Mega",
  "OCBC NISP",
  "Panin",
  "Maybank",
];

export function WithdrawalDialog({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
  maxAmount,
}: WithdrawalDialogProps) {
  const [formData, setFormData] = useState<WithdrawalFormData>({
    jumlah_dana: 0,
    keterangan: "",
    nomor_rekening: "",
    nama_bank: "",
    nama_pemilik_rekening: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof WithdrawalFormData, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof WithdrawalFormData, string>> = {};

    if (!formData.jumlah_dana || formData.jumlah_dana < 10000) {
      newErrors.jumlah_dana = "Minimum penarikan Rp 10.000";
    }

    if (formData.jumlah_dana > maxAmount) {
      newErrors.jumlah_dana = "Jumlah melebihi saldo tersedia";
    }

    if (!formData.nomor_rekening.trim()) {
      newErrors.nomor_rekening = "Nomor rekening harus diisi";
    }

    if (!formData.nama_bank.trim()) {
      newErrors.nama_bank = "Nama bank harus dipilih";
    }

    if (!formData.nama_pemilik_rekening.trim()) {
      newErrors.nama_pemilik_rekening = "Nama pemilik rekening harus diisi";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const success = await onSubmit(formData);
    if (success) {
      // Reset form
      setFormData({
        jumlah_dana: 0,
        keterangan: "",
        nomor_rekening: "",
        nama_bank: "",
        nama_pemilik_rekening: "",
      });
      setErrors({});
      onOpenChange(false);
    }
  };

  const handleAmountChange = (value: string) => {
    const numericValue = parseInt(value.replace(/\D/g, "")) || 0;
    setFormData((prev) => ({ ...prev, jumlah_dana: numericValue }));
    if (errors.jumlah_dana) {
      setErrors((prev) => ({ ...prev, jumlah_dana: undefined }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 rounded-lg bg-orange-100">
              <Wallet className="h-5 w-5 text-[#F79E0E]" />
            </div>
            Pengajuan Pencairan Dana
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Ajukan pencairan dana dari saldo toko Anda
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-4">
            {/* Available Balance Info */}
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
              <p className="text-sm text-gray-600 mb-1">Saldo Tersedia:</p>
              <p className="text-lg font-bold text-[#F79E0E]">
                {formatRupiah(maxAmount)}
              </p>
            </div>

            {/* Withdrawal Amount */}
            <div className="space-y-2">
              <Label
                htmlFor="jumlah_dana"
                className="text-gray-700 font-medium"
              >
                Jumlah Penarikan <span className="text-[#F79E0E]">*</span>
              </Label>
              <Input
                id="jumlah_dana"
                type="text"
                value={
                  formData.jumlah_dana ? formatRupiah(formData.jumlah_dana) : ""
                }
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="Masukkan jumlah yang ingin ditarik"
                className={`border-orange-100 focus:border-[#F79E0E] focus:ring-[#F79E0E] ${
                  errors.jumlah_dana ? "border-red-300" : ""
                }`}
              />
              {errors.jumlah_dana && (
                <p className="text-sm text-red-600">{errors.jumlah_dana}</p>
              )}
              <p className="text-xs text-gray-500">
                Minimum penarikan Rp 10.000
              </p>
            </div>

            {/* Bank Selection */}
            <div className="space-y-2">
              <Label htmlFor="nama_bank" className="text-gray-700 font-medium">
                Bank Tujuan <span className="text-[#F79E0E]">*</span>
              </Label>
              <Select
                value={formData.nama_bank}
                onValueChange={(value) => {
                  setFormData((prev) => ({ ...prev, nama_bank: value }));
                  if (errors.nama_bank) {
                    setErrors((prev) => ({ ...prev, nama_bank: undefined }));
                  }
                }}
              >
                <SelectTrigger
                  className={`border-orange-100 focus:border-[#F79E0E] focus:ring-[#F79E0E] ${
                    errors.nama_bank ? "border-red-300" : ""
                  }`}
                >
                  <SelectValue placeholder="Pilih bank tujuan" />
                </SelectTrigger>
                <SelectContent>
                  {BANKS.map((bank) => (
                    <SelectItem key={bank} value={bank}>
                      {bank}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.nama_bank && (
                <p className="text-sm text-red-600">{errors.nama_bank}</p>
              )}
            </div>

            {/* Account Number */}
            <div className="space-y-2">
              <Label
                htmlFor="nomor_rekening"
                className="text-gray-700 font-medium"
              >
                Nomor Rekening <span className="text-[#F79E0E]">*</span>
              </Label>
              <Input
                id="nomor_rekening"
                value={formData.nomor_rekening}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, nomor_rekening: e.target.value }));
                  if (errors.nomor_rekening) {
                    setErrors((prev) => ({ ...prev, nomor_rekening: undefined }));
                  }
                }}
                placeholder="Masukkan nomor rekening"
                className={`border-orange-100 focus:border-[#F79E0E] focus:ring-[#F79E0E] ${
                  errors.nomor_rekening ? "border-red-300" : ""
                }`}
              />
              {errors.nomor_rekening && (
                <p className="text-sm text-red-600">{errors.nomor_rekening}</p>
              )}
            </div>

            {/* Account Holder Name */}
            <div className="space-y-2">
              <Label
                htmlFor="nama_pemilik_rekening"
                className="text-gray-700 font-medium"
              >
                Nama Pemilik Rekening <span className="text-[#F79E0E]">*</span>
              </Label>
              <Input
                id="nama_pemilik_rekening"
                value={formData.nama_pemilik_rekening}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, nama_pemilik_rekening: e.target.value }));
                  if (errors.nama_pemilik_rekening) {
                    setErrors((prev) => ({ ...prev, nama_pemilik_rekening: undefined }));
                  }
                }}
                placeholder="Masukkan nama sesuai rekening"
                className={`border-orange-100 focus:border-[#F79E0E] focus:ring-[#F79E0E] ${
                  errors.nama_pemilik_rekening ? "border-red-300" : ""
                }`}
              />
              {errors.nama_pemilik_rekening && (
                <p className="text-sm text-red-600">{errors.nama_pemilik_rekening}</p>
              )}
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="keterangan" className="text-gray-700 font-medium">
                Keterangan
                <span className="text-gray-400 font-normal"> (opsional)</span>
              </Label>
              <Textarea
                id="keterangan"
                value={formData.keterangan}
                onChange={(e) => setFormData(prev => ({ ...prev, keterangan: e.target.value }))}
                placeholder="Tambahkan catatan untuk pencairan"
                className="border-orange-100 focus:border-[#F79E0E] focus:ring-[#F79E0E] min-h-[80px] resize-none"
              />
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
              disabled={isSubmitting || maxAmount < 10000}
              className="bg-[#F79E0E] hover:bg-[#F79E0E]/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <Wallet className="mr-2 h-4 w-4" />
                  Ajukan Pencairan
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
