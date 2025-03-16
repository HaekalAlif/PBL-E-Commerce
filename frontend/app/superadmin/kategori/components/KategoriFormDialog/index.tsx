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
import { Kategori, KategoriFormData } from "../../types";

interface KategoriFormDialogProps {
  isOpen: boolean;
  isCreateMode: boolean;
  kategori?: Kategori | null;
  onClose: () => void;
  onSubmit: (formData: KategoriFormData) => void;
}

export default function KategoriFormDialog({
  isOpen,
  isCreateMode,
  kategori,
  onClose,
  onSubmit,
}: KategoriFormDialogProps) {
  const [formData, setFormData] = useState<KategoriFormData>({
    nama_kategori: kategori?.nama_kategori || "",
    is_active: kategori?.is_active ?? true,
  });

  // Reset form when kategori or isOpen changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        nama_kategori: kategori?.nama_kategori || "",
        is_active: kategori?.is_active ?? true,
      });
    }
  }, [isOpen, kategori]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      is_active: checked,
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
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
