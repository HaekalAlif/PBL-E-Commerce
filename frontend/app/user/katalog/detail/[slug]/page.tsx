"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { Loader2, ShoppingCart } from "lucide-react";
import axiosInstance from "@/lib/axios";

// shadcn components
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductImage {
  id_gambar_barang?: number;
  id_gambar?: number;
  url_gambar: string;
  is_primary: boolean;
  urutan: number;
}

interface Product {
  id_barang: number;
  nama_barang: string;
  slug: string;
  deskripsi_barang: string;
  harga: number;
  grade: string;
  status_barang: string;
  stok: number;
  kondisi_detail: string;
  berat_barang: number;
  dimensi: string;
  gambarBarang?: ProductImage[];
  gambar_barang?: ProductImage[];
  toko: {
    id_toko: number;
    nama_toko: string;
    slug: string;
  };
  kategori: {
    id_kategori: number;
    nama_kategori: string;
  };
}

export default function ProductDetail() {
  const router = useRouter();
  const params = useParams();
  const slug = (params?.slug as string) || "";

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1); // Add quantity state
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProductDetail = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/products/${slug}`
        );
        if (response.data.status === "success") {
          setProduct(response.data.data);
        } else {
          setError("Failed to fetch product details");
        }
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError("Error loading product details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProductDetail();
    }
  }, [slug]);

  const handleBuyNow = async () => {
    if (!product) return;

    // Validate quantity against stock
    if (quantity > product.stok) {
      toast.error("Jumlah melebihi stok yang tersedia");
      return;
    }

    // Log action
    console.log(
      "Buy Now clicked for product:",
      product.slug,
      "quantity:",
      quantity
    );

    // Add loading message
    toast.info("Processing your purchase...");

    try {
      // Get the user's primary address
      const addressResponse = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/addresses`
      );

      if (
        addressResponse.data.status !== "success" ||
        !addressResponse.data.data.length
      ) {
        toast.error("Please add a shipping address first");
        router.push("/user/alamat");
        return;
      }

      // Find primary address or use the first one
      const addresses = addressResponse.data.data;
      const primaryAddress =
        addresses.find((addr: any) => addr.is_primary) || addresses[0];

      // Use the new buy-now endpoint which combines adding to cart and checkout
      const response = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/buy-now`,
        {
          product_slug: product.slug,
          jumlah: quantity,
          id_alamat: primaryAddress.id_alamat,
        }
      );

      if (response.data.status === "success") {
        const { kode_pembelian } = response.data.data;

        // Redirect to checkout page with the purchase code
        router.push(`/checkout?code=${kode_pembelian}`);
      } else {
        toast.error(response.data.message || "Failed to process your purchase");
      }
    } catch (error: any) {
      console.error("Error processing buy now:", error);

      // Provide helpful error messages
      if (error.response?.status === 401) {
        toast.error("Please log in to continue");
        router.push("/login");
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to process your purchase. Please try again.");
      }
    }
  };

  const handleMakeOffer = () => {
    toast.info("Penawaran akan segera hadir!");
  };

  const handleAddToCart = async () => {
    if (!product) return;

    // Validate quantity against stock
    if (quantity > product.stok) {
      toast.error("Jumlah melebihi stok yang tersedia");
      return;
    }

    setAddingToCart(true);
    try {
      const response = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_URL}/cart`,
        {
          id_barang: product.id_barang,
          jumlah: quantity,
        }
      );

      if (response.data.status === "success") {
        toast.success("Successfully added to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center text-sm mb-6">
          <Skeleton className="h-4 w-16" />
          <span className="mx-2">›</span>
          <Skeleton className="h-4 w-48" />
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <Skeleton className="h-96 w-full mb-4 rounded-md" />
                <div className="flex gap-2">
                  <Skeleton className="h-20 w-20 rounded-md" />
                  <Skeleton className="h-20 w-20 rounded-md" />
                  <Skeleton className="h-20 w-20 rounded-md" />
                </div>
              </div>

              <div>
                <Skeleton className="h-8 w-3/4 mb-4" />
                <Skeleton className="h-10 w-1/2 mb-6" />
                <Skeleton className="h-5 w-full mb-2" />
                <Skeleton className="h-5 w-full mb-2" />
                <Skeleton className="h-5 w-full mb-8" />
                <div className="flex gap-4 mb-6">
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 flex-1" />
                </div>
                <Skeleton className="h-6 w-1/3 mb-2" />
                <Skeleton className="h-32 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-12 flex flex-col items-center min-h-[60vh]">
        <p className="text-red-500 mb-4">{error || "Product not found"}</p>
        <Button
          onClick={() => router.push("/user/katalog")}
          variant="outline"
          className="mt-4"
        >
          Back to Catalog
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm mb-6">
        <Link href="/user/katalog" className="text-gray-600 hover:text-black">
          Katalog
        </Link>
        <span className="mx-2">›</span>
        <span className="text-gray-400">{product.nama_barang}</span>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Images Section */}
            <div>
              <div className="relative h-96 mb-4 border rounded-lg overflow-hidden">
                {/* Updated main product image with both property names and error handling */}
                {(product.gambarBarang && product.gambarBarang.length > 0) ||
                (product.gambar_barang && product.gambar_barang.length > 0) ? (
                  <img
                    src={
                      (product.gambarBarang &&
                        product.gambarBarang[selectedImageIndex]?.url_gambar) ||
                      (product.gambar_barang &&
                        product.gambar_barang[selectedImageIndex]
                          ?.url_gambar) ||
                      product.gambarBarang?.[0]?.url_gambar ||
                      product.gambar_barang?.[0]?.url_gambar
                    }
                    alt={product.nama_barang}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/placeholder-product.png";
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <p className="text-gray-400">No Image Available</p>
                  </div>
                )}
              </div>

              {/* Thumbnails - updated to handle both property names */}
              {((product.gambarBarang && product.gambarBarang.length > 1) ||
                (product.gambar_barang &&
                  product.gambar_barang.length > 1)) && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {(product.gambarBarang || product.gambar_barang || []).map(
                    (image, index) => (
                      <div
                        key={image.id_gambar_barang || image.id_gambar}
                        className={`relative w-20 h-20 flex-shrink-0 cursor-pointer border-2 rounded ${
                          selectedImageIndex === index
                            ? "border-black"
                            : "border-gray-200"
                        }`}
                        onClick={() => setSelectedImageIndex(index)}
                      >
                        <img
                          src={image.url_gambar}
                          alt={`${product.nama_barang} - Image ${index + 1}`}
                          className="w-full h-full object-cover rounded"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/placeholder-product.png";
                          }}
                        />
                      </div>
                    )
                  )}
                </div>
              )}
            </div>

            {/* Product Details Section */}
            <div>
              <h1 className="text-2xl font-bold mb-2">{product.nama_barang}</h1>

              <div className="flex items-center mb-4">
                <p className="text-3xl font-bold">
                  Rp {product.harga.toLocaleString("id-ID")}
                </p>
              </div>

              <div className="flex items-center text-sm text-gray-500 mb-4">
                <Link
                  href={`/user/toko/${product.toko.slug}`}
                  className="hover:text-black"
                >
                  Toko: {product.toko.nama_toko}
                </Link>
                <span className="mx-2">•</span>
                <Badge variant="outline" className="rounded-full">
                  {product.kategori.nama_kategori}
                </Badge>
              </div>

              {/* Product Status */}
              <div className="mb-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <span className="text-gray-600 mr-2">Status:</span>
                    <Badge
                      variant={
                        product.status_barang === "Tersedia"
                          ? "outline"
                          : "secondary"
                      }
                    >
                      {product.status_barang}
                    </Badge>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-600 mr-2">Stok:</span>
                    <span className="font-medium">{product.stok}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-600 mr-2">Grade:</span>
                    <span className="font-medium">{product.grade}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-600 mr-2">Berat:</span>
                    <span className="font-medium">
                      {product.berat_barang} gram
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-600 mr-2">Dimensi:</span>
                    <span className="font-medium">{product.dimensi}</span>
                  </div>
                </div>

                {/* Add quantity selector above buttons */}
                <div className="mb-4">
                  <label
                    htmlFor="quantity"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Jumlah
                  </label>
                  <div className="flex items-center">
                    <Select
                      value={quantity.toString()}
                      onValueChange={(value) => setQuantity(parseInt(value))}
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue placeholder="1" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* Generate quantity options based on stock, max 10 */}
                        {Array.from(
                          { length: Math.min(product?.stok || 1, 10) },
                          (_, i) => i + 1
                        ).map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span className="ml-2 text-sm text-gray-500">
                      Tersedia: {product?.stok || 0}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mb-6">
                  <Button
                    onClick={handleBuyNow}
                    disabled={
                      product?.status_barang !== "Tersedia" ||
                      (product?.stok || 0) <= 0 ||
                      addingToCart
                    }
                    className="flex-1"
                    variant={
                      product?.status_barang === "Tersedia" &&
                      (product?.stok || 0) > 0
                        ? "default"
                        : "secondary"
                    }
                  >
                    Beli Langsung
                  </Button>
                  <Button
                    onClick={handleAddToCart}
                    disabled={
                      product?.status_barang !== "Tersedia" ||
                      (product?.stok || 0) <= 0 ||
                      addingToCart
                    }
                    className="flex-1"
                    variant="outline"
                  >
                    {addingToCart ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <ShoppingCart className="h-4 w-4 mr-2" />
                    )}
                    Add to Cart
                  </Button>
                  <Button
                    onClick={handleMakeOffer}
                    className="flex-shrink-0"
                    variant="ghost"
                  >
                    Ajukan Penawaran
                  </Button>
                </div>

                {/* Product Specifications */}
                <div></div>
                <h3 className="text-lg font-semibold mb-2">Kondisi Detail</h3>
                <p className="text-gray-700 mb-4">{product.kondisi_detail}</p>
              </div>
            </div>
          </div>

          {/* Product Description */}
          <div className="mt-8">
            <Separator className="mb-4" />
            <h3 className="text-xl font-semibold mb-4">Deskripsi Produk</h3>
            <div className="prose max-w-none">
              <p className="whitespace-pre-line text-gray-700">
                {product.deskripsi_barang}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
