import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AddressFormData } from "../types";
import axiosInstance, { getCsrfToken } from "@/lib/axios";
import { toast } from "sonner";

export const useAddressForm = () => {
  const router = useRouter();
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [provinces, setProvinces] = useState([]);
  const [regencies, setRegencies] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingRegencies, setLoadingRegencies] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

  // Fetch provinces on mount
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        setLoadingProvinces(true);
        const response = await axiosInstance.get(`${apiUrl}/provinces`, {
          withCredentials: true,
        });

        if (response.data.status === "success") {
          setProvinces(response.data.data);
        } else {
          throw new Error("Failed to fetch provinces");
        }
      } catch (err) {
        console.error("Error fetching provinces:", err);
        setError("Failed to load provinces. Please try again.");
      } finally {
        setLoadingProvinces(false);
      }
    };

    fetchProvinces();
  }, []);

  // Fetch regencies when province changes
  useEffect(() => {
    if (!formData.provinsi) {
      setRegencies([]);
      return;
    }

    const fetchRegencies = async () => {
      try {
        setLoadingRegencies(true);
        setFormData((prev) => ({ ...prev, kota: "", kecamatan: "" }));
        setDistricts([]);

        const response = await axiosInstance.get(
          `${apiUrl}/provinces/${formData.provinsi}/regencies`,
          { withCredentials: true }
        );

        if (response.data.status === "success") {
          setRegencies(response.data.data);
        } else {
          throw new Error("Failed to fetch regencies");
        }
      } catch (err) {
        console.error("Error fetching regencies:", err);
        setError("Failed to load cities. Please try again.");
      } finally {
        setLoadingRegencies(false);
      }
    };

    fetchRegencies();
  }, [formData.provinsi]);

  // Fetch districts when regency changes
  useEffect(() => {
    if (!formData.kota) {
      setDistricts([]);
      return;
    }

    const fetchDistricts = async () => {
      try {
        setLoadingDistricts(true);
        setFormData((prev) => ({ ...prev, kecamatan: "" }));

        const response = await axiosInstance.get(
          `${apiUrl}/regencies/${formData.kota}/districts`,
          { withCredentials: true }
        );

        if (response.data.status === "success") {
          setDistricts(response.data.data);
        } else {
          throw new Error("Failed to fetch districts");
        }
      } catch (err) {
        console.error("Error fetching districts:", err);
        setError("Failed to load districts. Please try again.");
      } finally {
        setLoadingDistricts(false);
      }
    };

    fetchDistricts();
  }, [formData.kota]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, is_primary: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validasi form
      if (
        !formData.nama_penerima ||
        !formData.no_telepon ||
        !formData.alamat_lengkap ||
        !formData.provinsi ||
        !formData.kota ||
        !formData.kecamatan ||
        !formData.kode_pos
      ) {
        throw new Error("Mohon lengkapi semua field yang diperlukan");
      }

      const token = await getCsrfToken();
      const response = await axiosInstance.post(
        `${apiUrl}/user/addresses`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-XSRF-TOKEN": token ?? "", // Pastikan token ada atau gunakan string kosong
          },
          withCredentials: true,
        }
      );

      if (response.data.status === "success") {
        toast.success("Alamat berhasil ditambahkan", {
          description: "Mengalihkan ke halaman daftar alamat...",
        });
        setTimeout(() => {
          router.push("/akun/alamat");
        }, 1500);
      } else {
        throw new Error(response.data.message || "Gagal menambahkan alamat");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Gagal menambahkan alamat";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/akun/alamat");
  };

  return {
    formData,
    loading,
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
