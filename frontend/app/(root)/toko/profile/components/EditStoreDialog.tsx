import { useState, useEffect } from "react";
import { StoreProfile, StoreFormData } from "../types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface EditStoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: StoreProfile;
  onSave: (data: StoreFormData) => Promise<boolean>;
  isLoading: boolean;
}

export function EditStoreDialog({
  open,
  onOpenChange,
  profile,
  onSave,
  isLoading,
}: EditStoreDialogProps) {
  const [formData, setFormData] = useState<StoreFormData>({
    nama_toko: "",
    deskripsi: "",
    kontak: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        nama_toko: profile.nama_toko,
        deskripsi: profile.deskripsi,
        kontak: profile.kontak,
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onSave(formData);
    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Edit Toko
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Perbarui informasi toko Anda
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nama_toko" className="text-sm font-medium">
              Nama Toko
            </Label>
            <Input
              id="nama_toko"
              value={formData.nama_toko}
              onChange={(e) =>
                setFormData({ ...formData, nama_toko: e.target.value })
              }
              className="border-orange-300 focus:border-[#F79E0E] focus:ring-[#F79E0E]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deskripsi" className="text-sm font-medium">
              Deskripsi
            </Label>
            <Textarea
              id="deskripsi"
              value={formData.deskripsi}
              onChange={(e) =>
                setFormData({ ...formData, deskripsi: e.target.value })
              }
              className="border-orange-300 focus:border-[#F79E0E] focus:ring-[#F79E0E] min-h-[100px]"
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="kontak" className="text-sm font-medium">
              Kontak
            </Label>
            <Input
              id="kontak"
              value={formData.kontak}
              onChange={(e) =>
                setFormData({ ...formData, kontak: e.target.value })
              }
              className="border-orange-300 focus:border-[#F79E0E] focus:ring-[#F79E0E]"
              required
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-[#F79E0E] to-[#FFB648] hover:from-[#E8890B] hover:to-[#F0A537] text-white"
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Simpan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
