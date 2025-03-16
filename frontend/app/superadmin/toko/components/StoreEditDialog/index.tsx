"use client";

import { Store, EditFormData } from "../../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Pencil } from "lucide-react";

interface StoreEditDialogProps {
  store: Store;
  editFormData: EditFormData;
  handleEditClick: (store: Store) => void;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function StoreEditDialog({
  store,
  editFormData,
  handleEditClick,
  handleInputChange,
  handleSelectChange,
  handleSubmit,
}: StoreEditDialogProps) {
  // Clean the store name when first clicking edit
  const handleEditButtonClick = () => {
    const cleanedStore = {
      ...store,
      nama_toko: String(store.nama_toko).replace(/0+$/, ""),
    };
    handleEditClick(cleanedStore);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" onClick={handleEditButtonClick}>
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Store</DialogTitle>
          <DialogDescription>
            Make changes to the store. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nama_toko">Store Name</Label>
              <Input
                id="nama_toko"
                name="nama_toko"
                value={editFormData.nama_toko}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="deskripsi">Description</Label>
              <Textarea
                id="deskripsi"
                name="deskripsi"
                value={editFormData.deskripsi}
                onChange={handleInputChange}
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="alamat">Address</Label>
              <Input
                id="alamat"
                name="alamat"
                value={editFormData.alamat}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="kontak">Contact</Label>
              <Input
                id="kontak"
                name="kontak"
                value={editFormData.kontak}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={editFormData.is_active.toString()}
                onValueChange={(value) =>
                  handleSelectChange("is_active", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
