"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Product, PRODUCT_STATUS } from "../../types";
import { formatRupiah } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImageModal from "../ImageModal";

interface ProductDetailDialogProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onEdit: () => void;
}

export default function ProductDetailDialog({
  isOpen,
  product,
  onClose,
  onEdit,
}: ProductDetailDialogProps) {
  // Add state for image modal
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  // Ensure product.gambar_barang is always defined
  useEffect(() => {
    if (product && !Array.isArray(product.gambar_barang)) {
      (product as any).gambar_barang = [];
    }
  }, [product]);

  if (!product) return null;

  // Ensure gambar_barang is always an array before accessing
  const productImages = Array.isArray(product.gambar_barang) ? product.gambar_barang : [];

  // Function to handle image click
  const handleImageClick = (imageUrl: string) => {
    if (!imageUrl) return;
    setSelectedImage(imageUrl);
    setImageModalOpen(true);
  };

  // Safely check if there are images
  const hasImages = productImages.length > 0;
  
  // Safely get the first image URL if available
  const firstImageUrl = hasImages ? productImages[0].url_gambar : "";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Product Details
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details" className="mt-4">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">{product.nama_barang}</h3>

                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {product.kategori?.nama_kategori || "Uncategorized"}
                  </Badge>
                  <Badge
                    className={
                      product.status_barang === "Tersedia"
                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                        : product.status_barang === "Habis"
                        ? "bg-red-100 text-red-800 hover:bg-red-200"
                        : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                    }
                  >
                    {PRODUCT_STATUS[
                      product.status_barang as keyof typeof PRODUCT_STATUS
                    ] || product.status_barang}
                  </Badge>
                  <Badge variant="secondary">{product.grade}</Badge>
                  {product.is_deleted && (
                    <Badge variant="destructive">Deleted</Badge>
                  )}
                </div>

                <div className="mt-3">
                  <p className="text-2xl font-bold text-primary">
                    {formatRupiah(product.harga)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Stock: {product.stok} units
                  </p>
                </div>
              </div>

              <div>
                {hasImages && firstImageUrl ? (
                  <div
                    className="relative w-full h-[200px] rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => handleImageClick(firstImageUrl)}
                  >
                    <img
                      src={firstImageUrl}
                      alt={product.nama_barang}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "/placeholder-product.png";
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-full h-[200px] bg-gray-100 flex items-center justify-center rounded-lg">
                    <p className="text-gray-400">No image available</p>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-muted-foreground whitespace-pre-line">
                {product.deskripsi_barang || "No description provided"}
              </p>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Condition Details</h4>
              <p className="text-muted-foreground whitespace-pre-line">
                {product.kondisi_detail || "No condition details provided"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t pt-4">
              <div>
                <h4 className="font-medium mb-1">Weight</h4>
                <p className="text-muted-foreground">
                  {product.berat_barang} grams
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Dimensions</h4>
                <p className="text-muted-foreground">{product.dimensi}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t pt-4">
              <div>
                <h4 className="font-medium mb-1">Store</h4>
                <p className="text-muted-foreground">
                  {product.toko?.nama_toko || "-"}
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Product ID</h4>
                <p className="text-muted-foreground">{product.id_barang}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="images">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 my-4">
              {hasImages ? (
                productImages.map((image) => (
                  <div
                    key={image.id_gambar}
                    className="relative aspect-square rounded-lg overflow-hidden border cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => handleImageClick(image.url_gambar)}
                  >
                    <img
                      src={image.url_gambar}
                      alt={`${product.nama_barang} - Image ${image.urutan}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "/placeholder-product.png";
                      }}
                    />
                    {image.is_primary && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-blue-500">Primary</Badge>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="col-span-full h-40 flex items-center justify-center bg-gray-50 rounded-lg">
                  <p className="text-gray-400">No images available</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={onEdit}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit Product
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* Add the image modal */}
      <ImageModal
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        imageUrl={selectedImage}
        title={product.nama_barang}
      />
    </Dialog>
  );
}