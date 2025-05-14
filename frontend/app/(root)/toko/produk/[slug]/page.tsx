"use client";

import { ProductDetailHeader } from "./components/ProductDetailHeader";
import { useBarangDetail } from "./hooks/useBarangDetail";
import { BarangImageGallery } from "./components/BarangImageGallery";
import { BarangInfo } from "./components/BarangInfo";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, ChevronLeft, Info } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Box, LineChart } from "lucide-react";

export default function BarangDetailPage() {
  const router = useRouter();
  const {
    barang,
    loading,
    error,
    selectedImage,
    setSelectedImage,
    handleDelete,
    formatCurrency,
  } = useBarangDetail();

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-white to-amber-50/20 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Skeleton with amber theme */}
            <div className="space-y-6">
              {/* Breadcrumb Skeleton */}
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <div className="h-4 w-20 bg-amber-100/60 rounded animate-pulse" />
                    <div className="h-4 w-4 bg-amber-100/60 rounded animate-pulse" />
                  </div>
                ))}
              </div>

              {/* Header Card Skeleton */}
              <div className="bg-white p-6 rounded-xl border border-amber-100 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200/50 animate-pulse">
                      <div className="w-6 h-6" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-6 w-48 bg-amber-100/60 rounded animate-pulse" />
                      <div className="h-4 w-32 bg-amber-100/40 rounded animate-pulse" />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="h-10 w-28 bg-amber-100/60 rounded-lg animate-pulse" />
                    <div className="h-10 w-28 bg-amber-100/60 rounded-lg animate-pulse" />
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Skeleton */}
            <div className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Image Gallery Skeleton */}
                <div className="md:border-r border-amber-100 pr-8">
                  <div className="sticky top-24 space-y-4">
                    <div className="aspect-square w-full max-w-[420px] mx-auto bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-lg animate-pulse" />
                    <div className="grid grid-cols-6 gap-2 max-w-[420px] mx-auto">
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className="aspect-square rounded-md bg-gradient-to-br from-amber-50 to-amber-100/30 animate-pulse"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Product Info Skeleton */}
                <div className="space-y-6">
                  {/* Price Card Skeleton */}
                  <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl p-6 border border-amber-100">
                    <div className="h-8 w-48 bg-amber-200/60 rounded mb-3 animate-pulse" />
                    <div className="flex items-center gap-3">
                      <div className="h-6 w-24 bg-amber-100/60 rounded animate-pulse" />
                      <div className="h-6 w-32 bg-amber-100/60 rounded animate-pulse" />
                    </div>
                  </div>

                  {/* Stats Skeleton */}
                  <div className="grid grid-cols-2 gap-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="bg-white p-4 rounded-xl border border-amber-100">
                        <div className="space-y-2">
                          <div className="h-4 w-20 bg-amber-100/40 rounded animate-pulse" />
                          <div className="h-6 w-16 bg-amber-100/60 rounded animate-pulse" />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Details Skeleton */}
                  <div className="bg-white rounded-xl p-6 border border-amber-100">
                    <div className="grid grid-cols-2 gap-4">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="space-y-2">
                          <div className="h-4 w-20 bg-amber-100/40 rounded animate-pulse" />
                          <div className="h-6 w-full bg-amber-100/60 rounded animate-pulse" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !barang) {
    return (
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {!error && (
            <Alert className="mb-6">
              <Info className="h-4 w-4" />
              <AlertTitle>Produk tidak ditemukan</AlertTitle>
              <AlertDescription>
                Produk yang Anda cari tidak dapat ditemukan atau telah dihapus.
              </AlertDescription>
            </Alert>
          )}
          <Button onClick={() => router.back()}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Kembali
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white to-amber-50/20 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header with action buttons */}
          <ProductDetailHeader
            productName={barang?.nama_barang}
            productSlug={barang?.slug}
            onDelete={handleDelete}
          />

          {/* Main Content with adjusted spacing */}
          <div className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="md:border-r border-amber-100 pr-8">
                <BarangImageGallery
                  images={barang?.gambar_barang || []}
                  selectedImage={selectedImage}
                  productName={barang?.nama_barang || ""}
                  onSelectImage={setSelectedImage}
                />
              </div>

              <BarangInfo barang={barang} formatCurrency={formatCurrency} onDelete={function (): void {
                throw new Error("Function not implemented.");
              } } />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
