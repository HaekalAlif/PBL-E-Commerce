"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "@/lib/axios";
import { toast } from "sonner";

// UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  ChevronLeft,
  Package,
  Edit,
  Trash2,
  AlertCircle,
  ShoppingBag,
  Info,
  Tag,
  Truck,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Product interfaces
interface GambarBarang {
  id_gambar: number;
  id_barang: number;
  url_gambar: string;
  is_primary: boolean;
  urutan: number;
}

interface Barang {
  id_barang: number;
  id_toko: number;
  id_kategori: number;
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
  created_at: string;
  updated_at: string;
  kategori: {
    id_kategori: number;
    nama_kategori: string;
  };
  // Update to use snake_case to match API response
  gambar_barang: GambarBarang[]; 
  toko: {
    id_toko: number;
    nama_toko: string;
    slug: string;
  };
}

export default function BarangDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string || "";

  // States
  const [barang, setBarang] = useState<Barang | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Fetch product data
  useEffect(() => {
    const fetchBarang = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/barang/slug/${slug}`);

        if (response.data.status === "success") {
          setBarang(response.data.data);

          // Add null checking and use snake_case field name (gambar_barang)
          if (response.data.data.gambar_barang && response.data.data.gambar_barang.length > 0) {
            // Set the primary image as selected or the first image if available
            const primaryImage = response.data.data.gambar_barang.find(
              (img: GambarBarang) => img.is_primary
            );

            if (primaryImage) {
              setSelectedImage(primaryImage.url_gambar);
            } else {
              setSelectedImage(response.data.data.gambar_barang[0].url_gambar);
            }
          }
        } else {
          setError("Gagal memuat data produk");
        }
      } catch (error: any) {
        console.error("Error fetching product:", error);
        setError(
          error.response?.data?.message || "Terjadi kesalahan saat memuat data"
        );
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchBarang();
    }
  }, [slug]);

  // Handle delete action
  const handleDelete = async () => {
    if (!barang) return;

    try {
      await axios.delete(`/api/barang/${barang.id_barang}`);
      toast.success("Produk berhasil dihapus");
      router.push("/user/toko/barang");
    } catch (error: any) {
      console.error("Error deleting product:", error);
      toast.error(error.response?.data?.message || "Gagal menghapus produk");
    }
  };

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Render status badge with appropriate color
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "Tersedia":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Tersedia
          </Badge>
        );
      case "Terjual":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            Terjual
          </Badge>
        );
      case "Habis":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            Habis
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="h-96 w-full" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-32 w-full" />
              <div className="flex gap-3">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={() => router.back()}>
          <ChevronLeft className="mr-2 h-4 w-4" /> Kembali
        </Button>
      </div>
    );
  }

  // Not found state
  if (!barang) {
    return (
      <div className="container mx-auto py-8">
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertTitle>Produk tidak ditemukan</AlertTitle>
          <AlertDescription>
            Produk yang Anda cari tidak dapat ditemukan atau telah dihapus.
          </AlertDescription>
        </Alert>
        <Button onClick={() => router.push("/user/toko/barang")}>
          <ChevronLeft className="mr-2 h-4 w-4" /> Kembali ke Daftar Produk
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      {/* Breadcrumb navigation */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/user/toko/barang">Produk</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{barang.nama_barang}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Product title and action buttons */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold">{barang.nama_barang}</h1>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => router.push(`/user/toko/barang/edit/${barang.slug}`)}
          >
            <Edit className="mr-2 h-4 w-4" /> Edit
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" /> Hapus
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
                <AlertDialogDescription>
                  Apakah Anda yakin ingin menghapus produk "{barang.nama_barang}
                  "? Tindakan ini tidak dapat dibatalkan.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-600 text-white hover:bg-red-700"
                >
                  Hapus
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Product details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image gallery */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={selectedImage || "/placeholder-product.png"}
              alt={barang.nama_barang}
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder-product.png";
              }}
            />
          </div>

          {/* Thumbnail gallery - update to use snake_case field name */}
          {barang.gambar_barang && barang.gambar_barang.length > 1 && (
            <div className="flex overflow-x-auto gap-2 pb-2">
              {barang.gambar_barang.map((image) => (
                <div
                  key={image.id_gambar}
                  onClick={() => setSelectedImage(image.url_gambar)}
                  className={`cursor-pointer border-2 rounded-md overflow-hidden w-20 h-20 flex-shrink-0 ${
                    selectedImage === image.url_gambar
                      ? "border-primary"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={image.url_gambar}
                    alt={`${barang.nama_barang} - ${image.id_gambar}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/placeholder-product.png";
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold">
              {formatCurrency(barang.harga)}
            </h2>
            <div className="flex items-center gap-3 mt-2">
              {renderStatusBadge(barang.status_barang)}
              <span className="text-sm">
                Stok: <span className="font-medium">{barang.stok}</span>
              </span>
            </div>
          </div>

          <Separator />

          {/* Product details in tabs */}
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="description">Deskripsi</TabsTrigger>
              <TabsTrigger value="details">Detail & Spesifikasi</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="space-y-4 mt-4">
              <div className="prose max-w-none">
                <p>{barang.deskripsi_barang}</p>
              </div>
            </TabsContent>
            <TabsContent value="details" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Kategori</p>
                  <p className="font-medium">{barang.kategori.nama_kategori}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Grade</p>
                  <p className="font-medium">{barang.grade}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Berat</p>
                  <p className="font-medium">{barang.berat_barang} gram</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Dimensi</p>
                  <p className="font-medium">{barang.dimensi}</p>
                </div>
                <div className="space-y-1 col-span-2">
                  <p className="text-sm text-muted-foreground">
                    Kondisi Detail
                  </p>
                  <p className="font-medium">{barang.kondisi_detail}</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Store info */}
          <Card className="bg-slate-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                Informasi Toko
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div>
                  <p className="font-medium">{barang.toko.nama_toko}</p>
                  <Button
                    variant="link"
                    className="p-0 h-auto"
                    onClick={() => router.push(`/user/toko`)}
                  >
                    Lihat toko
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
