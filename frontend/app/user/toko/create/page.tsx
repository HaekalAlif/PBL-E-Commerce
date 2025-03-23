"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, ArrowLeft, Loader2, Store } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
// Import the custom axios instance instead of the default axios
import axiosInstance, { getCsrfToken } from "@/lib/axios";

// Form schema for validation
const tokoFormSchema = z.object({
  nama_toko: z
    .string()
    .min(3, { message: "Nama toko minimal 3 karakter" })
    .max(255, { message: "Nama toko maksimal 255 karakter" }),
  deskripsi: z.string().min(20, { message: "Deskripsi minimal 20 karakter" }),
  kontak: z
    .string()
    .min(8, { message: "Kontak minimal 8 karakter" })
    .max(255, { message: "Kontak maksimal 255 karakter" }),
});

type TokoFormValues = z.infer<typeof tokoFormSchema>;

const CreateTokoPage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<TokoFormValues>({
    resolver: zodResolver(tokoFormSchema),
    defaultValues: {
      nama_toko: "",
      deskripsi: "",
      kontak: "",
    },
  });

  const onSubmit = async (values: TokoFormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Get the CSRF token from cookies (no API call)
      const csrfToken = getCsrfToken();

      console.log("Making POST request to create store");

      // Simply make the request - auth is handled by cookies
      const response = await axiosInstance.post(`/api/toko`, values);

      if (response.data.success) {
        toast.success("Berhasil", {
          description: "Toko berhasil dibuat",
        });
        router.push("/user/toko");
      } else {
        setError(response.data.message || "Gagal membuat toko");
      }
    } catch (error: any) {
      console.error("Error creating store:", error);

      if (error.response?.status === 419) {
        setError("Error CSRF token. Silakan muat ulang halaman dan coba lagi.");
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Terjadi kesalahan saat membuat toko");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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

      <div className="flex items-center mb-8 gap-3">
        <Store className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Buat Toko Baru</h1>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Informasi Toko</CardTitle>
          <CardDescription>
            Isi formulir berikut untuk membuat toko baru. Pastikan data yang
            Anda masukkan sudah benar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="nama_toko"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Toko</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan nama toko" {...field} />
                    </FormControl>
                    <FormDescription>
                      Nama ini akan ditampilkan kepada pelanggan Anda.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deskripsi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deskripsi</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Ceritakan tentang toko Anda"
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Jelaskan tentang toko Anda dan produk yang Anda jual.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="kontak"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kontak</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nomor telepon / WhatsApp"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Kontak yang bisa dihubungi pelanggan.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    "Buat Toko"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateTokoPage;
