"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { AlertCircle, Store, MapPin, Phone, Edit, Trash2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";

interface TokoData {
  id_toko: number;
  nama_toko: string;
  deskripsi: string;
  alamat: string;
  kontak: string;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

const TokoPage = () => {
  const router = useRouter();
  const [tokoData, setTokoData] = useState<TokoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTokoData = async () => {
      try {
        const response = await axiosInstance.get("/api/toko/my-store", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data.success) {
          setTokoData(response.data.data);
        } else {
          setError(response.data.message || "Gagal memuat data toko");
        }
      } catch (error: any) {
        if (error.response && error.response.status === 404) {
          // No store exists - this is an expected case
          setTokoData(null);
        } else {
          setError("Terjadi kesalahan saat memuat data toko");
          console.error("Error fetching toko data:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTokoData();
  }, []);

  const handleDeleteToko = async () => {
    if (!confirm("Apakah Anda yakin ingin menghapus toko ini?")) return;

    try {
      setLoading(true);

      // Get a fresh CSRF token before making the delete request
      await getCsrfToken();

      const response = await axiosInstance.delete("/api/toko", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

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

      if (error.response?.status === 419) {
        toast.error("Error", {
          description:
            "Error CSRF token. Silakan muat ulang halaman dan coba lagi.",
        });
      } else {
        toast.error("Error", {
          description: "Terjadi kesalahan saat menghapus toko",
        });
      }
    } finally {
      setLoading(false);
    }
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
              <CardDescription className="mt-1">
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
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => router.push(`/user/toko/edit`)}
                className="flex items-center gap-1"
              >
                <Edit className="h-4 w-4" /> Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleDeleteToko}
                className="flex items-center gap-1 text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" /> Hapus
              </Button>
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
              <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium mb-1">Alamat</h3>
                <p className="text-gray-600">{tokoData.alamat}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Phone className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium mb-1">Kontak</h3>
                <p className="text-gray-600">{tokoData.kontak}</p>
              </div>
            </div>
          </div>

          <div className="bg-muted p-4 rounded-md">
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

      {renderTokoContent()}
    </div>
  );
};

export default TokoPage;
