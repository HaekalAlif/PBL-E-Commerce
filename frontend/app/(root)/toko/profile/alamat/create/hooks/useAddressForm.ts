import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FormData, RegionData, LoadingStates, Province, Regency, District } from "../types";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";

export const useAddressForm = () => {
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
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

  // Fetch provinces on component mount
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        setLoading(prev => ({ ...prev, provinces: true }));
        const response = await axiosInstance.get(`${apiUrl}/provinces`, {
          withCredentials: true,
        });

        if (response.data.status === "success") {
          const uniqueProvinces = response.data.data.filter(
            (province: Province, index: number, self: Province[]) =>
              index === self.findIndex((p) => p.id === province.id)
          );
          setRegionData(prev => ({ ...prev, provinces: uniqueProvinces }));
        } else {
          throw new Error("Failed to fetch provinces");
        }
      } catch (err) {
        console.error("Error fetching provinces:", err);
        setError("Gagal memuat daftar provinsi. Silakan coba lagi.");
      } finally {
        setLoading(prev => ({ ...prev, provinces: false }));
      }
    };

    fetchProvinces();
  }, [apiUrl]);

  // Fetch regencies when province changes
  useEffect(() => {
    if (!formData.provinsi) {
      setRegionData(prev => ({ ...prev, regencies: [], districts: [], villages: [] }));
      return;
    }

    const fetchRegencies = async () => {
      try {
        setLoading(prev => ({ ...prev, regencies: true }));
        setFormData(prev => ({ ...prev, kota: "", kecamatan: "" }));
        setRegionData(prev => ({ ...prev, regencies: [], districts: [], villages: [] }));

        const response = await axiosInstance.get(
          `${apiUrl}/provinces/${formData.provinsi}/regencies`,
          { withCredentials: true }
        );

        if (response.data.status === "success") {
          setRegionData(prev => ({ ...prev, regencies: response.data.data }));
        } else {
          throw new Error("Failed to fetch regencies");
        }
      } catch (err) {
        console.error("Error fetching regencies:", err);
        setError("Gagal memuat daftar kota. Silakan coba lagi.");
      } finally {
        setLoading(prev => ({ ...prev, regencies: false }));
      }
    };

    fetchRegencies();
  }, [formData.provinsi, apiUrl]);

  // Fetch districts when regency changes
  useEffect(() => {
    if (!formData.kota) {
      setRegionData(prev => ({ ...prev, districts: [], villages: [] }));
      return;
    }

    const fetchDistricts = async () => {
      try {
        setLoading(prev => ({ ...prev, districts: true }));
        setFormData(prev => ({ ...prev, kecamatan: "" }));
        setRegionData(prev => ({ ...prev, districts: [], villages: [] }));

        const response = await axiosInstance.get(
          `${apiUrl}/regencies/${formData.kota}/districts`,
          { withCredentials: true }
        );

        if (response.data.status === "success") {
          setRegionData(prev => ({ ...prev, districts: response.data.data }));
        } else {
          throw new Error("Failed to fetch districts");
        }
      } catch (err) {
        console.error("Error fetching districts:", err);
        setError("Gagal memuat daftar kecamatan. Silakan coba lagi.");
      } finally {
        setLoading(prev => ({ ...prev, districts: false }));
      }
    };

    fetchDistricts();
  }, [formData.kota, apiUrl]);

  const updateFormData = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
      setLoading(prev => ({ ...prev, form: true }));
      setError(null);
      setSuccess(null);

      const response = await axiosInstance.post(`/api/toko/addresses`, formData, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (response.data.status === "success") {
        setSuccess("Alamat toko berhasil ditambahkan!");
        toast.success("Alamat toko berhasil ditambahkan!");
        setTimeout(() => {
          router.push("/toko/profile/alamat");
        }, 1500);
        return true;
      } else {
        throw new Error(response.data.message || "Gagal menambahkan alamat toko");
      }
    } catch (err: any) {
      console.error("Error adding store address:", err);
      const errorMessage = err.response?.data?.message || err.message || "Gagal menambahkan alamat toko. Silakan coba lagi.";
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(prev => ({ ...prev, form: false }));
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
