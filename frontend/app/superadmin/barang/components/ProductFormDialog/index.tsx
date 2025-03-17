"use client";

import { useState, useEffect } from "react";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Product, ProductFormData, Category, GRADE_OPTIONS } from "../../types";
import { formatRupiah } from "@/lib/utils";

interface ProductFormDialogProps {
  isOpen: boolean;
  product?: Product | null;
  categories: Category[];
  onClose: () => void;
  onSubmit: (formData: ProductFormData) => void;
}

export default function ProductFormDialog({
  isOpen,
  product,
  categories,
  onClose,
  onSubmit,
}: ProductFormDialogProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    nama_barang: product?.nama_barang || "",
    id_kategori: product?.id_kategori || 0,
    deskripsi_barang: product?.deskripsi_barang || "",
    harga: product?.harga || 0,
    grade: product?.grade || "Good",
    status_barang: product?.status_barang || "Tersedia",
    stok: product?.stok || 0,
    kondisi_detail: product?.kondisi_detail || "",
    berat_barang: product?.berat_barang || 0,
    dimensi: product?.dimensi || "",
  });

  // Reset form when product or isOpen changes
  useEffect(() => {
    if (isOpen && product) {
      setFormData({
        nama_barang: product.nama_barang,
        id_kategori: product.id_kategori,
        deskripsi_barang: product.deskripsi_barang,
        harga: product.harga,
        grade: product.grade,
        status_barang: product.status_barang,
        stok: product.stok,
        kondisi_detail: product.kondisi_detail,
        berat_barang: product.berat_barang,
        dimensi: product.dimensi,
      });
    }
  }, [isOpen, product]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Handle number fields
    if (name === "harga" || name === "stok" || name === "berat_barang") {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? 0 : parseFloat(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === "id_kategori") {
      setFormData((prev) => ({
        ...prev,
        [name]: parseInt(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>Update product information</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="nama_barang">Product Name</Label>
              <Input
                id="nama_barang"
                name="nama_barang"
                value={formData.nama_barang}
                onChange={handleInputChange}
                placeholder="Product Name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="id_kategori">Category</Label>
              <Select
                name="id_kategori"
                value={formData.id_kategori.toString()}
                onValueChange={(value) =>
                  handleSelectChange("id_kategori", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.id_kategori}
                      value={category.id_kategori.toString()}
                    >
                      {category.nama_kategori}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="deskripsi_barang">Description</Label>
            <Textarea
              id="deskripsi_barang"
              name="deskripsi_barang"
              value={formData.deskripsi_barang}
              onChange={handleInputChange}
              placeholder="Product description"
              className="min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="harga">Price (Rp)</Label>
              <Input
                id="harga"
                name="harga"
                type="number"
                value={formData.harga}
                onChange={handleInputChange}
                placeholder="Price"
              />
              {formData.harga > 0 && (
                <p className="text-sm text-muted-foreground">
                  {formatRupiah(formData.harga)}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="grade">Grade</Label>
              <Select
                name="grade"
                value={formData.grade}
                onValueChange={(value) => handleSelectChange("grade", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  {GRADE_OPTIONS.map((grade) => (
                    <SelectItem key={grade} value={grade}>
                      {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="status_barang">Status</Label>
              <Select
                name="status_barang"
                value={formData.status_barang}
                onValueChange={(value) =>
                  handleSelectChange("status_barang", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tersedia">Available</SelectItem>
                  <SelectItem value="Terjual">Sold</SelectItem>
                  <SelectItem value="Habis">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="stok">Stock</Label>
              <Input
                id="stok"
                name="stok"
                type="number"
                value={formData.stok}
                onChange={handleInputChange}
                placeholder="Stock"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="kondisi_detail">Condition Details</Label>
            <Textarea
              id="kondisi_detail"
              name="kondisi_detail"
              value={formData.kondisi_detail}
              onChange={handleInputChange}
              placeholder="Detailed condition of the product"
              className="min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="berat_barang">Weight (grams)</Label>
              <Input
                id="berat_barang"
                name="berat_barang"
                type="number"
                value={formData.berat_barang}
                onChange={handleInputChange}
                placeholder="Weight in grams"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dimensi">Dimensions (LxWxH)</Label>
              <Input
                id="dimensi"
                name="dimensi"
                value={formData.dimensi}
                onChange={handleInputChange}
                placeholder="e.g. 10x5x3 cm"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
