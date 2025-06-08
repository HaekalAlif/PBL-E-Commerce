import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FormData, RegionData, LoadingStates, Province } from "../types";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";

export const useEditAddressForm = (id: string) => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    nama_pengirim: "",
    no_telepon: "",
    alamat_lengkap: "",
    provinsi: "",
    kota: "",
    kecamatan: "",
    kode_pos: "",
    is_primary: false,
  });

  const [regionData, setRegionData] = useState<RegionData>({
    provinces: [],
    regencies: [],
    districts: [],
    villages: [],
  });

  const [loading, setLoading] = useState<LoadingStates>({
    provinces: false,
    regencies: false,
    districts: false,
    villages: false,
    form: false,
    data: true,
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

  // Fetch address data
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        setLoading((prev) => ({ ...prev, data: true }));
        const response = await axiosInstance.get(`/api/toko/addresses/${id}`, {
          withCredentials: true,
        });

        if (response.data.status === "success") {
          const addressData = response.data.data;
          setFormData({
            nama_pengirim: addressData.nama_pengirim,
            no_telepon: addressData.no_telepon,
            alamat_lengkap: addressData.alamat_lengkap,
            provinsi: addressData.provinsi,
            kota: addressData.kota,
            kecamatan: addressData.kecamatan,
            kode_pos: addressData.kode_pos,
            is_primary: addressData.is_primary,
          });
        } else {
          throw new Error("Failed to fetch address data");
        }
      } catch (err) {
        console.error("Error fetching address:", err);
        setError("Gagal memuat data alamat. Silakan coba lagi.");
      } finally {
        setLoading((prev) => ({ ...prev, data: false }));
      }
    };

    fetchAddress();
  }, [id]);

  // Fetch provinces
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        setLoading((prev) => ({ ...prev, provinces: true }));
        const response = await axiosInstance.get(`${apiUrl}/provinces`, {
          withCredentials: true,
        });

        if (response.data.status === "success") {
          const uniqueProvinces = response.data.data.filter(
            (province: Province, index: number, self: Province[]) =>
              index === self.findIndex((p) => p.id === province.id)
          );
          setRegionData((prev) => ({ ...prev, provinces: uniqueProvinces }));
        } else {
          throw new Error("Failed to fetch provinces");
        }
      } catch (err) {
        console.error("Error fetching provinces:", err);
        setError("Gagal memuat daftar provinsi. Silakan coba lagi.");
      } finally {
        setLoading((prev) => ({ ...prev, provinces: false }));
      }
    };

    fetchProvinces();
  }, [apiUrl]);

  // Fetch regencies when province changes
  useEffect(() => {
    if (!formData.provinsi) {
      return;
    }

    const fetchRegencies = async () => {
      try {
        setLoading((prev) => ({ ...prev, regencies: true }));

        const response = await axiosInstance.get(
          `${apiUrl}/provinces/${formData.provinsi}/regencies`,
          { withCredentials: true }
        );

        if (response.data.status === "success") {
          setRegionData((prev) => ({ ...prev, regencies: response.data.data }));
        } else {
          throw new Error("Failed to fetch regencies");
        }
      } catch (err) {
        console.error("Error fetching regencies:", err);
        setError("Gagal memuat daftar kota. Silakan coba lagi.");
      } finally {
        setLoading((prev) => ({ ...prev, regencies: false }));
      }
    };

    fetchRegencies();
  }, [formData.provinsi, apiUrl]);

  // Fetch districts when regency changes
  useEffect(() => {
    if (!formData.kota) {
      return;
    }

    const fetchDistricts = async () => {
      try {
        setLoading((prev) => ({ ...prev, districts: true }));

        const response = await axiosInstance.get(
          `${apiUrl}/regencies/${formData.kota}/districts`,
          { withCredentials: true }
        );

        if (response.data.status === "success") {
          setRegionData((prev) => ({ ...prev, districts: response.data.data }));
        } else {
          throw new Error("Failed to fetch districts");
        }
      } catch (err) {
        console.error("Error fetching districts:", err);
        setError("Gagal memuat daftar kecamatan. Silakan coba lagi.");
      } finally {
        setLoading((prev) => ({ ...prev, districts: false }));
      }
    };

    fetchDistricts();
  }, [formData.kota, apiUrl]);

  const updateFormData = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => {
      // If province changes, reset city and district
      if (
        field === "provinsi" &&
        prev.provinsi !== value &&
        typeof value === "string"
      ) {
        return { ...prev, [field]: value, kota: "", kecamatan: "" };
      }
      // If city changes, reset district
      else if (
        field === "kota" &&
        prev.kota !== value &&
        typeof value === "string"
      ) {
        return { ...prev, [field]: value, kecamatan: "" };
      }
      // Otherwise just update the value
      return { ...prev, [field]: value };
    });
  };

  const validateForm = (): boolean => {
    if (
      !formData.nama_pengirim ||
      !formData.no_telepon ||
      !formData.alamat_lengkap ||
      !formData.provinsi ||
      !formData.kota ||
      !formData.kecamatan ||
      !formData.kode_pos
    ) {
      setError("Silakan lengkapi semua field yang wajib diisi");
      return false;
    }
    return true;
  };

  const submitForm = async (): Promise<boolean> => {
    if (!validateForm()) return false;

    try {
      setLoading((prev) => ({ ...prev, form: true }));
      setError(null);
      setSuccess(null);

      const response = await axiosInstance.put(
        `/api/toko/addresses/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (response.data.status === "success") {
        setSuccess("Alamat toko berhasil diperbarui!");
        toast.success("Alamat toko berhasil diperbarui!");
        setTimeout(() => {
          router.push("/toko/profile/alamat");
        }, 1500);
        return true;
      } else {
        throw new Error(
          response.data.message || "Gagal memperbarui alamat toko"
        );
      }
    } catch (err: any) {
      console.error("Error updating store address:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Gagal memperbarui alamat toko. Silakan coba lagi.";
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading((prev) => ({ ...prev, form: false }));
    }
  };

  return {
    formData,
    regionData,
    loading,
    error,
    success,
    updateFormData,
    submitForm,
    setError,
    setSuccess,
  };
};
