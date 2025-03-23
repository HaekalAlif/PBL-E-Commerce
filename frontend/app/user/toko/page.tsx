"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import axiosInstance, { getCsrfToken } from "@/lib/axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  Store,
  MapPin,
  Phone,
  Edit,
  Trash2,
  Link2,
  PlusCircle,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
// Import dialog components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface UserData {
  id_user: number;
  email: string;
  has_store: boolean;
  store?: {
    id_toko: number;
    nama_toko: string;
    slug: string;
  };
}

interface TokoData {
  id_toko: number;
  nama_toko: string;
  slug: string;
  deskripsi: string;
  alamat: string;
  kontak: string;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

interface StoreAddress {
  id_alamat_toko: number;
  id_toko: number;
  nama_pengirim: string;
  no_telepon: string;
  alamat_lengkap: string;
  provinsi: string;
  kota: string;
  kecamatan: string;
  kode_pos: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
  province?: {
    id: string;
    name: string;
  };
  regency?: {
    id: string;
    name: string;
  };
  district?: {
    id: string;
    name: string;
  };
}

const TokoPage = () => {
  const router = useRouter();
  const [tokoData, setTokoData] = useState<TokoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  // State for store addresses
  const [storeAddresses, setStoreAddresses] = useState<StoreAddress[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTokoData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Base URL for API
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

        // Simple approach: just call the my-store endpoint directly
        const response = await axios.get(`${apiUrl}/toko/my-store`, {
          withCredentials: true,
        });

        // Track the response for debugging
        console.log("Store API response:", response.data);

        // Update state based on response
        if (response.data.success) {
          setTokoData(response.data.data);
          // If we have a store, fetch its addresses
          fetchStoreAddresses();
        } else {
          setTokoData(null);
        }
      } catch (error: any) {
        console.error("Error fetching toko data:", error);

        if (error.response?.status === 404) {
          // User doesn't have a store - this is normal, not an error
          setTokoData(null);
        } else if (error.response?.status === 401) {
          setError("Sesi login telah berakhir. Silakan login kembali");
          setTimeout(() => router.push("/login"), 1500);
        } else {
          const errorMsg = error.response?.data?.message || error.message;
          setError(`Terjadi kesalahan: ${errorMsg}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTokoData();
  }, [router]);

  // Function to fetch store addresses
  const fetchStoreAddresses = async () => {
    try {
      setLoadingAddresses(true);
      setAddressError(null);

      const response = await axiosInstance.get(`/api/toko/addresses`, {
        withCredentials: true,
      });

      if (response.data.status === "success") {
        setStoreAddresses(response.data.data);
      } else {
        throw new Error(response.data.message || "Failed to fetch addresses");
      }
    } catch (err: any) {
      console.error("Error fetching store addresses:", err);
      setAddressError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load store addresses"
      );
    } finally {
      setLoadingAddresses(false);
    }
  };

  // Update delete handler to use AlertDialog
  const handleDeleteToko = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.delete("/api/toko");

      if (response.data.success) {
        toast.success("Berhasil", {
          description: "Toko berhasil dihapus",
        });
        setTokoData(null);
      } else {
        toast.error("Gagal", {
          description: response.data.message || "Gagal menghapus toko",
        });
      }
    } catch (error: any) {
      console.error("Error deleting toko:", error);
      toast.error("Error", {
        description:
          error.response?.data?.message ||
          "Terjadi kesalahan saat menghapus toko",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyTokoLink = () => {
    if (!tokoData) return;

    const baseUrl = window.location.origin;
    const tokoUrl = `${baseUrl}/toko/${tokoData.slug}`;

    navigator.clipboard.writeText(tokoUrl).then(() => {
      toast.success("Link toko berhasil disalin", {
        description: "Link telah disalin ke clipboard",
      });
    });
  };

  // Separate component for the edit form to isolate state

  const [isUpdating, setIsUpdating] = useState(false);

  // Handle save from dialog - optimistic UI update
  const handleSaveToko = async (formData: any) => {
    try {
      setIsUpdating(true);

      // Optimistically update the UI with the new data
      const tempUpdatedToko = { ...tokoData, ...formData };
      setTokoData(tempUpdatedToko as TokoData);

      // Make the API request
      const response = await axiosInstance.put("/api/toko", formData);

      if (response.data.success) {
        // Update with the actual data from server
        setTokoData(response.data.data);
        toast.success("Berhasil", {
          description: "Toko berhasil diperbarui",
        });
      } else {
        // Revert to previous data on failure
        setTokoData(tokoData);
        toast.error("Gagal", {
          description: response.data.message || "Gagal memperbarui toko",
        });
      }
    } catch (error: any) {
      console.error("Error updating store:", error);
      // Revert to previous data on error
      setTokoData(tokoData);
      toast.error("Error", {
        description:
          error.response?.data?.message ||
          "Terjadi kesalahan saat memperbarui toko",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Render the address section
  const renderAddressSection = () => {
    if (loadingAddresses) {
      return (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Alamat Pengiriman</h3>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      );
    }

    if (addressError) {
      return (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Alamat Toko</h3>
          <Alert variant="destructive" className="mb-2">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{addressError}</AlertDescription>
          </Alert>
          <Button
            onClick={() => router.push("/user/toko/alamat/create")}
            className="mt-2 bg-black hover:bg-gray-800 text-white"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Tambah Alamat Baru
          </Button>
        </div>
      );
    }

    if (storeAddresses.length === 0) {
      return (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Alamat Toko</h3>
          <Alert className="mb-4 bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <AlertTitle className="text-amber-800">Perhatian</AlertTitle>
            <AlertDescription className="text-amber-700">
              Anda belum menambahkan alamat untuk toko ini. Tambahkan alamat
              untuk memulai berjualan.
            </AlertDescription>
          </Alert>
          <Button
            onClick={() => router.push("/user/toko/alamat/create")}
            className="bg-black hover:bg-gray-800 text-white"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Tambah Alamat Toko
          </Button>
        </div>
      );
    }

    // Find primary address
    const primaryAddress = storeAddresses.find((addr) => addr.is_primary);

    return (
      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium">Alamat Pengiriman</h3>
          <Button
            onClick={() => router.push("/user/toko/alamat")}
            variant="outline"
            size="sm"
            className="text-gray-700"
          >
            Kelola Alamat
          </Button>
        </div>

        {primaryAddress ? (
          <Card className="border-gray-200">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium text-gray-900">
                    {primaryAddress.nama_pengirim}
                  </div>
                  <div className="text-gray-700">
                    {primaryAddress.no_telepon}
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="bg-gray-50 border-gray-200 text-gray-700"
                >
                  Utama
                </Badge>
              </div>
              <div className="mt-2 text-gray-700">
                {primaryAddress.alamat_lengkap}
              </div>
              <div className="mt-1 text-sm text-gray-500">
                {primaryAddress.province?.name || ""},{" "}
                {primaryAddress.regency?.name || ""},{" "}
                {primaryAddress.district?.name || ""}, {primaryAddress.kode_pos}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Alert className="mb-4 bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <AlertTitle className="text-amber-800">Perhatian</AlertTitle>
            <AlertDescription className="text-amber-700">
              Anda memiliki {storeAddresses.length} alamat, tetapi belum
              menetapkan alamat utama.
            </AlertDescription>
          </Alert>
        )}

        <div className="mt-3 flex gap-2">
          <Button
            onClick={() => router.push("/user/toko/alamat")}
            variant="outline"
            size="sm"
            className="text-gray-700"
          >
            Lihat Semua ({storeAddresses.length})
          </Button>
          <Button
            onClick={() => router.push("/user/toko/alamat/create")}
            variant="outline"
            size="sm"
            className="text-gray-700"
          >
            <PlusCircle className="h-3.5 w-3.5 mr-1" />
            Tambah Baru
          </Button>
        </div>
      </div>
    );
  };

  const renderTokoContent = () => {
    if (loading) {
      return (
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </CardContent>
        </Card>
      );
    }

    if (!tokoData) {
      return (
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Toko Belum Dibuat
            </CardTitle>
            <CardDescription>
              Anda belum memiliki toko. Mulai berjualan dengan membuat toko Anda
              sekarang!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="bg-muted">
              <AlertCircle className="h-5 w-5" />
              <AlertTitle>Informasi</AlertTitle>
              <AlertDescription>
                Dengan membuat toko, Anda dapat mulai menjual produk dan
                menjangkau pelanggan di platform kami.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full mt-4 bg-primary hover:bg-primary/90"
              onClick={() => router.push("/user/toko/create")}
            >
              Buat Toko Sekarang
            </Button>
          </CardFooter>
        </Card>
      );
    }

    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold">
                {tokoData.nama_toko}
              </CardTitle>
              <CardDescription className="mt-1 flex items-center gap-2">
                {tokoData.is_active ? (
                  <Badge
                    variant="outline"
                    className="bg-green-100 text-green-800 hover:bg-green-200"
                  >
                    Aktif
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="bg-red-100 text-red-800 hover:bg-red-200"
                  >
                    Tidak Aktif
                  </Badge>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyTokoLink}
                  className="flex items-center gap-1 text-xs text-gray-500"
                >
                  <Link2 className="h-3 w-3" /> Salin Link
                </Button>
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {/* Replace delete button with AlertDialog */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1 text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" /> Hapus
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
                    <AlertDialogDescription>
                      Apakah Anda yakin ingin menghapus toko ini? Tindakan ini
                      tidak dapat dibatalkan.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteToko}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      Hapus
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6 space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Deskripsi</h3>
            <p className="text-gray-600 whitespace-pre-line">
              {tokoData.deskripsi}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-2">
              <Phone className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium mb-1">Kontak</h3>
                <p className="text-gray-600">{tokoData.kontak}</p>
              </div>
            </div>
          </div>

          {/* Add the address section here */}
          {renderAddressSection()}

          <div className="bg-muted p-4 rounded-md mt-4">
            <h3 className="text-sm font-medium mb-1">Info Tambahan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Dibuat pada:</span>
                <span>
                  {new Date(tokoData.created_at).toLocaleDateString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Terakhir diperbarui:</span>
                <span>
                  {new Date(tokoData.updated_at).toLocaleDateString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between col-span-2">
                <span className="text-gray-500">URL Toko:</span>
                <span
                  className="text-blue-600 hover:underline cursor-pointer"
                  onClick={copyTokoLink}
                >
                  {`/toko/${tokoData.slug}`}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-8 gap-3">
        <Store className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Toko Saya</h1>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Debug information - remove in production */}
      {process.env.NODE_ENV !== "production" && debugInfo && (
        <div className="mb-6 p-4 bg-gray-100 rounded text-xs">
          <details>
            <summary className="font-bold cursor-pointer">Debug Info</summary>
            <pre className="mt-2 overflow-auto max-h-96">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </details>
        </div>
      )}

      {renderTokoContent()}
    </div>
  );
};

export default TokoPage;
