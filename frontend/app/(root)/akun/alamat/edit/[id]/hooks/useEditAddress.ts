import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AddressFormData, Region } from "../types";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";

export const useEditAddress = (id: string) => {
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<AddressFormData>({
    nama_penerima: "",
    no_telepon: "",
    alamat_lengkap: "",
    provinsi: "",
    kota: "",
    kecamatan: "",
    kode_pos: "",
    is_primary: false,
  });

  const [provinces, setProvinces] = useState<Region[]>([]);
  const [regencies, setRegencies] = useState<Region[]>([]);
  const [districts, setDistricts] = useState<Region[]>([]);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingRegencies, setLoadingRegencies] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);

  // Fetch address data
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        setLoadingData(true);
        const response = await axiosInstance.get(
          `${apiUrl}/user/addresses/${id}`,
          {
            withCredentials: true,
          }
        );

        if (response.data.status === "success") {
          const addressData = response.data.data;
          setFormData({
            nama_penerima: addressData.nama_penerima,
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
        toast.error("Gagal memuat data alamat");
      } finally {
        setLoadingData(false);
      }
    };

    fetchAddress();
  }, [id, apiUrl]);

  // Fetch provinces
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        setLoadingProvinces(true);
        const response = await axiosInstance.get(`${apiUrl}/provinces`);
        if (response.data.status === "success") {
          setProvinces(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching provinces:", err);
        toast.error("Gagal memuat data provinsi");
      } finally {
        setLoadingProvinces(false);
      }
    };

    fetchProvinces();
  }, [apiUrl]);

  // Fetch regencies when province changes
  useEffect(() => {
    if (!formData.provinsi) return;

    const fetchRegencies = async () => {
      try {
        setLoadingRegencies(true);
        const response = await axiosInstance.get(
          `${apiUrl}/provinces/${formData.provinsi}/regencies`
        );
        if (response.data.status === "success") {
          setRegencies(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching regencies:", err);
      } finally {
        setLoadingRegencies(false);
      }
    };

    fetchRegencies();
  }, [formData.provinsi, apiUrl]);

  // Fetch districts when regency changes
  useEffect(() => {
    if (!formData.kota) return;

    const fetchDistricts = async () => {
      try {
        setLoadingDistricts(true);
        const response = await axiosInstance.get(
          `${apiUrl}/regencies/${formData.kota}/districts`
        );
        if (response.data.status === "success") {
          setDistricts(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching districts:", err);
      } finally {
        setLoadingDistricts(false);
      }
    };

    fetchDistricts();
  }, [formData.kota, apiUrl]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => {
      if (name === "provinsi" && prev.provinsi !== value) {
        return { ...prev, [name]: value, kota: "", kecamatan: "" };
      } else if (name === "kota" && prev.kota !== value) {
        return { ...prev, [name]: value, kecamatan: "" };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, is_primary: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosInstance.put(
        `${apiUrl}/user/addresses/${id}`,
        formData
      );

      if (response.data.status === "success") {
        toast.success("Alamat berhasil diperbarui");
        setTimeout(() => {
          router.push("/akun/alamat");
        }, 1500);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal memperbarui alamat");
      setError(err.response?.data?.message || "Gagal memperbarui alamat");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => router.push("/akun/alamat");

  return {
    formData,
    loading,
    loadingData,
    error,
    provinces,
    regencies,
    districts,
    loadingProvinces,
    loadingRegencies,
    loadingDistricts,
    handleInputChange,
    handleSelectChange,
    handleCheckboxChange,
    handleSubmit,
    handleCancel,
  };
};
