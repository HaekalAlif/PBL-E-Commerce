import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios, { getCsrfToken } from "@/lib/axios";
import { toast } from "sonner";
import { Kategori, ImagePreview, BarangFormData } from "../types";

export default function useBarangForm() {
  const router = useRouter();

  // Form data state
  const [formData, setFormData] = useState<BarangFormData>({
    nama_barang: "",
    id_kategori: "",
    deskripsi_barang: "",
    harga: "",
    grade: "",
    status_barang: "Tersedia",
    stok: "1",
    kondisi_detail: "",
    berat_barang: "",
    dimensi: "",
  });

  // Image handling
  const [imageFiles, setImageFiles] = useState<ImagePreview[]>([]);
  const [primaryImageIndex, setPrimaryImageIndex] = useState<number | null>(
    null
  );

  // Other states
  const [kategoriList, setKategoriList] = useState<Kategori[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch kategori list on page load - using the public endpoint
  useEffect(() => {
    const fetchKategori = async () => {
      try {
        // Using the public kategori endpoint we added
        const response = await axios.get("/api/kategori");
        if (response.data && Array.isArray(response.data.data)) {
          setKategoriList(response.data.data);
        } else {
          console.error("Unexpected API response format:", response.data);
          toast.error("Format data kategori tidak valid");
        }
      } catch (error) {
        console.error("Failed to fetch kategori:", error);
        toast.error("Gagal memuat daftar kategori");
      }
    };

    fetchKategori();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        isPrimary: false,
      }));

      setImageFiles((prev) => [...prev, ...newFiles]);

      // If no primary image is set, make the first uploaded image primary
      if (primaryImageIndex === null && newFiles.length > 0) {
        setPrimaryImageIndex(imageFiles.length);
        setImageFiles((prev) =>
          prev.map((img, idx) => ({
            ...img,
            isPrimary: idx === imageFiles.length ? true : img.isPrimary,
          }))
        );
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    // Release object URL to avoid memory leaks
    URL.revokeObjectURL(imageFiles[index].preview);

    // Remove the image
    const newImageFiles = [...imageFiles];
    newImageFiles.splice(index, 1);
    setImageFiles(newImageFiles);

    // Update primary image index if necessary
    if (index === primaryImageIndex) {
      if (newImageFiles.length > 0) {
        setPrimaryImageIndex(0);
        setImageFiles(
          newImageFiles.map((img, idx) => ({
            ...img,
            isPrimary: idx === 0,
          }))
        );
      } else {
        setPrimaryImageIndex(null);
      }
    } else if (primaryImageIndex !== null && index < primaryImageIndex) {
      setPrimaryImageIndex(primaryImageIndex - 1);
    }
  };

  const setPrimaryImage = (index: number) => {
    setPrimaryImageIndex(index);
    setImageFiles(
      imageFiles.map((img, idx) => ({
        ...img,
        isPrimary: idx === index,
      }))
    );
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Basic validation for required fields
    if (!formData.nama_barang.trim())
      newErrors.nama_barang = "Nama barang harus diisi";
    if (!formData.id_kategori) newErrors.id_kategori = "Kategori harus dipilih";
    if (!formData.deskripsi_barang.trim())
      newErrors.deskripsi_barang = "Deskripsi barang harus diisi";
    if (
      !formData.harga ||
      isNaN(Number(formData.harga)) ||
      Number(formData.harga) <= 0
    ) {
      newErrors.harga = "Harga harus berupa angka positif";
    }
    if (!formData.grade.trim()) newErrors.grade = "Grade barang harus diisi";
    if (
      !formData.stok ||
      isNaN(Number(formData.stok)) ||
      Number(formData.stok) < 0
    ) {
      newErrors.stok = "Stok harus berupa angka positif atau 0";
    }
    if (!formData.kondisi_detail.trim())
      newErrors.kondisi_detail = "Detail kondisi harus diisi";
    if (
      !formData.berat_barang ||
      isNaN(Number(formData.berat_barang)) ||
      Number(formData.berat_barang) <= 0
    ) {
      newErrors.berat_barang = "Berat barang harus berupa angka positif";
    }
    if (!formData.dimensi.trim())
      newErrors.dimensi = "Dimensi barang harus diisi";

    // Validate that at least one image is uploaded
    if (imageFiles.length === 0) {
      newErrors.images = "Upload minimal satu gambar produk";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Form belum lengkap atau ada kesalahan");
      return;
    }

    setIsSubmitting(true);

    try {
      // Dapatkan CSRF token dan tunggu hingga selesai
      const token = (await getCsrfToken()) as unknown as string || '';

      // Kirim data produk dengan token yang sudah didapat
      const productResponse = await axios.post(
        "/api/barang",
        {
          nama_barang: formData.nama_barang,
          id_kategori: parseInt(formData.id_kategori),
          deskripsi_barang: formData.deskripsi_barang,
          harga: parseFloat(formData.harga),
          grade: formData.grade,
          status_barang: formData.status_barang,
          stok: parseInt(formData.stok),
          kondisi_detail: formData.kondisi_detail,
          berat_barang: parseFloat(formData.berat_barang),
          dimensi: formData.dimensi,
        },
        {
          headers: {
            "X-XSRF-TOKEN": token || "", 
          },
        }
      );

      if (productResponse.data.status === "success") {
        const productId = productResponse.data.data.id_barang;
        const productSlug = productResponse.data.data.slug;

        // Upload gambar satu per satu
        for (let i = 0; i < imageFiles.length; i++) {
          const imageFormData = new FormData();
          imageFormData.append("gambar", imageFiles[i].file);
          imageFormData.append(
            "is_primary",
            imageFiles[i].isPrimary ? "1" : "0"
          );
          imageFormData.append("urutan", String(i + 1));

          await axios.post(`/api/barang/${productId}/gambar`, imageFormData, {
            headers: {
              "Content-Type": "multipart/form-data",
              "X-XSRF-TOKEN": token || "", 
            },
          });
        }

        toast.success("Produk berhasil ditambahkan");
        router.push(`/toko/produk/${productSlug}`);
      }
    } catch (error: any) {
      console.error("Error creating product:", error);

      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }

      toast.error(error.response?.data?.message || "Gagal menambahkan produk");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    imageFiles,
    kategoriList,
    isSubmitting,
    errors,
    handleInputChange,
    handleSelectChange,
    handleImageChange,
    handleRemoveImage,
    setPrimaryImage,
    handleSubmit,
  };
}
