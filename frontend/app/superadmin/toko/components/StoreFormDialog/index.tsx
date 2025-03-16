"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Store } from "../../types";

interface StoreFormData {
  nama_toko: string;
  deskripsi: string;
  alamat: string;
  kontak: string;
  is_active: boolean;
}

interface StoreFormDialogProps {
  isOpen: boolean;
  isCreateMode: boolean;
  store?: Store | null;
  onClose: () => void;
  onSubmit: (formData: StoreFormData) => void;
}

export default function StoreFormDialog({
  isOpen,
  isCreateMode,
  store,
  onClose,
  onSubmit,
}: StoreFormDialogProps) {
  const [formData, setFormData] = useState<StoreFormData>({
    nama_toko: "",
    deskripsi: "",
    alamat: "",
    kontak: "",
    is_active: true,
  });

  // Reset form when store or isOpen changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        nama_toko: store ? String(store.nama_toko).replace(/0+$/, "") : "",
        deskripsi: store?.deskripsi || "",
        alamat: store?.alamat || "",
        kontak: store?.kontak || "",
        is_active: store?.is_active ?? true,
      });
    }
  }, [isOpen, store]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isCreateMode ? "Create New Store" : "Edit Store"}
          </DialogTitle>
          <DialogDescription>
            {isCreateMode
              ? "Add a new store to the system"
              : "Update store information"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="nama_toko">Store Name</Label>
            <Input
              id="nama_toko"
              name="nama_toko"
              value={formData.nama_toko}
              onChange={handleInputChange}
              placeholder="Store Name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="deskripsi">Description</Label>
            <Textarea
              id="deskripsi"
              name="deskripsi"
              value={formData.deskripsi}
              onChange={handleInputChange}
              placeholder="Description"
              rows={3}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="alamat">Address</Label>
            <Input
              id="alamat"
              name="alamat"
              value={formData.alamat}
              onChange={handleInputChange}
              placeholder="Address"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="kontak">Contact</Label>
            <Input
              id="kontak"
              name="kontak"
              value={formData.kontak}
              onChange={handleInputChange}
              placeholder="Contact"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="is_active">Active</Label>
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) =>
                handleSwitchChange("is_active", checked)
              }
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {isCreateMode ? "Create Store" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
