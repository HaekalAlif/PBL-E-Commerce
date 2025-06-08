import { useState } from "react";
import { useRouter } from "next/navigation";
import { StoreFormData, FormStates } from "../types";
import axiosInstance, { getCsrfToken } from "@/lib/axios";
import { toast } from "sonner";

export const useStoreForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<StoreFormData>({
    nama_toko: "",
    deskripsi: "",
    kontak: "",
  });

  const [formStates, setFormStates] = useState<FormStates>({
    isSubmitting: false,
    error: null,
    success: null,
  });

  const updateFormData = (field: keyof StoreFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.nama_toko || !formData.deskripsi || !formData.kontak) {
      setFormStates((prev) => ({
        ...prev,
        error: "Silakan lengkapi semua field yang wajib diisi",
      }));
      return false;
    }

    if (formData.nama_toko.length < 3) {
      setFormStates((prev) => ({
        ...prev,
        error: "Nama toko minimal 3 karakter",
      }));
      return false;
    }

    if (formData.deskripsi.length < 20) {
      setFormStates((prev) => ({
        ...prev,
        error: "Deskripsi minimal 20 karakter",
      }));
      return false;
    }

    if (formData.kontak.length < 8) {
      setFormStates((prev) => ({
        ...prev,
        error: "Kontak minimal 8 karakter",
      }));
      return false;
    }

    return true;
  };

  const submitForm = async (): Promise<boolean> => {
    if (!validateForm()) return false;

    setFormStates((prev) => ({ ...prev, isSubmitting: true, error: null }));

    try {
      const csrfToken = getCsrfToken();
      console.log("Making POST request to create store");

      const response = await axiosInstance.post(`/api/toko`, formData);

      if (response.data.success) {
        setFormStates((prev) => ({
          ...prev,
          success: "Toko berhasil dibuat",
          error: null,
        }));

        toast.success("Berhasil", {
          description: "Toko berhasil dibuat",
        });

        setTimeout(() => {
          router.push("/toko/profile");
        }, 1500);

        return true;
      } else {
        throw new Error(response.data.message || "Gagal membuat toko");
      }
    } catch (error: any) {
      console.error("Error creating store:", error);

      let errorMessage = "Terjadi kesalahan saat membuat toko";

      if (error.response?.status === 419) {
        errorMessage =
          "Error CSRF token. Silakan muat ulang halaman dan coba lagi.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      setFormStates((prev) => ({
        ...prev,
        error: errorMessage,
        success: null,
      }));

      toast.error(errorMessage);
      return false;
    } finally {
      setFormStates((prev) => ({ ...prev, isSubmitting: false }));
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return {
    formData,
    formStates,
    updateFormData,
    submitForm,
    handleCancel,
    setFormStates,
  };
};
