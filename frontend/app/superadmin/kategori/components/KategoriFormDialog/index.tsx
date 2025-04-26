"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Kategori, KategoriFormState } from "../../types";
import { toast } from "sonner";

interface KategoriFormDialogProps {
  isOpen: boolean;
  isCreateMode: boolean;
  kategori?: Kategori | null;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
}

export default function KategoriFormDialog({
  isOpen,
  isCreateMode,
  kategori,
  onClose,
  onSubmit,
}: KategoriFormDialogProps) {
  const [formData, setFormData] = useState<KategoriFormState>({
    nama_kategori: kategori?.nama_kategori || "",
    is_active: kategori?.is_active ?? true,
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      setFormData({
        nama_kategori: kategori?.nama_kategori || "",
        is_active: kategori?.is_active ?? true,
      });
      setLogoFile(null);
      setPreviewUrl(kategori?.logo ? `/storage/${kategori.logo}` : "");
    }
  }, [isOpen, kategori]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: KategoriFormState) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev: KategoriFormState) => ({
      ...prev,
      is_active: checked,
    }));
  };

  const handleSubmit = () => {
    // Validate form data before submission
    if (!formData.nama_kategori.trim()) {
      toast.error("Nama kategori harus diisi");
      return;
    }

    const submitData = new FormData();
    submitData.append("nama_kategori", formData.nama_kategori.trim());
    submitData.append("is_active", formData.is_active.toString());

    if (logoFile) {
      submitData.append("logo", logoFile);
    }

    onSubmit(submitData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isCreateMode ? "Buat Kategori Baru" : "Edit Kategori"}
          </DialogTitle>
          <DialogDescription>
            {isCreateMode
              ? "Tambahkan kategori baru ke sistem"
              : "Perbarui informasi kategori"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="nama_kategori">Nama Kategori</Label>
            <Input
              id="nama_kategori"
              name="nama_kategori"
              value={formData.nama_kategori}
              onChange={handleInputChange}
              placeholder="Nama Kategori"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="logo">Logo</Label>
            <Input
              id="logo"
              name="logo"
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
            />
            {previewUrl && (
              <div className="mt-2">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg"
                />
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="is_active">Aktif</Label>
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={handleSwitchChange}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button onClick={handleSubmit}>
            {isCreateMode ? "Buat Kategori" : "Simpan Perubahan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
