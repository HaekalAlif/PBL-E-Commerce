"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Store, MapPin, Phone, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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

const TokoDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [tokoData, setTokoData] = useState<TokoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTokoData = async () => {
      try {
        const response = await axiosInstance.get(`/api/toko/${slug}`);
        // This is a public endpoint, so we don't need to check for the auth token

        if (response.data.success) {
          setTokoData(response.data.data);
        } else {
          setError(response.data.message || "Gagal memuat data toko");
        }
      } catch (error: any) {
        setError("Terjadi kesalahan saat memuat data toko");
        console.error("Error fetching toko data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTokoData();
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
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
      </div>
    );
  }

  if (!tokoData) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Button
          variant="outline"
          size="sm"
          className="mb-6 flex items-center gap-1"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" /> Kembali
        </Button>

        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error || "Toko tidak ditemukan"}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Button
        variant="outline"
        size="sm"
        className="mb-6 flex items-center gap-1"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4" /> Kembali
      </Button>

      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold">
                {tokoData.nama_toko}
              </CardTitle>
              <CardDescription className="mt-1">Toko Online</CardDescription>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default TokoDetailPage;
