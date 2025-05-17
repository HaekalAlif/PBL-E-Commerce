import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios, { getCsrfToken } from "@/lib/axios";
import { toast } from "sonner";
import { Kategori, ImagePreview, BarangFormData } from "../types";

export default function useBarangForm(slug: string) {
  const router = useRouter();

  // Form data state with empty initial values
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

  const [imageFiles, setImageFiles] = useState<ImagePreview[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<number[]>([]); // Add this line for tracking images to delete
  const [kategoriList, setKategoriList] = useState<Kategori[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Fetch product data and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Use the correct endpoint for getting product by slug
        const productResponse = await axios.get(`/api/barang/slug/${slug}`);
        if (productResponse.data.status === "success") {
          const product = productResponse.data.data;
          // Update form data with existing product data
          setFormData({
            nama_barang: product.nama_barang,
            id_kategori: product.id_kategori.toString(),
            deskripsi_barang: product.deskripsi_barang,
            harga: product.harga.toString(),
            grade: product.grade,
            status_barang: product.status_barang,
            stok: product.stok.toString(),
            kondisi_detail: product.kondisi_detail,
            berat_barang: product.berat_barang.toString(),
            dimensi: product.dimensi,
            slug: product.slug,
          });

          // Set existing images with id_gambar
          if (product.gambar_barang && product.gambar_barang.length > 0) {
            const existingImages = product.gambar_barang.map((img: any) => ({
              id_gambar: img.id_gambar,
              file: null,
              preview: img.url_gambar,
              isPrimary: img.is_primary,
              url_gambar: img.url_gambar,
            }));
            setImageFiles(existingImages);
          }
        }

        // Fetch categories
        const categoryResponse = await axios.get("/api/kategori");
        if (categoryResponse.data.status === "success") {
          setKategoriList(categoryResponse.data.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Gagal memuat data produk");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  // Add the missing handlers after the fetchData useEffect:
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        isPrimary: false,
      }));

      setImageFiles((prev) => [...prev, ...newFiles]);
    }
  };
  // Queue images for deletion instead of deleting immediately
  const handleRemoveImage = (index: number) => {
    const imageToRemove = imageFiles[index];

    if (imageToRemove.url_gambar && imageToRemove.id_gambar) {
      // Add the image ID to the queue for deletion
      setImagesToDelete((prev) => [...prev, imageToRemove.id_gambar!]);
    }

    if (imageToRemove.preview) {
      // If it's a new image, revoke the object URL
      URL.revokeObjectURL(imageToRemove.preview);
    }

    // Update state to remove the image from display
    setImageFiles((prev) => prev.filter((_, idx) => idx !== index));
  };

  const setPrimaryImage = (index: number) => {
    setImageFiles((prev) =>
      prev.map((img, idx) => ({
        ...img,
        isPrimary: idx === index,
      }))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = ((await getCsrfToken()) as unknown as string) || "";

      // Update product data first
      const productResponse = await axios.put(
        `/api/barang/slug/${slug}`,
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
            "X-XSRF-TOKEN": token,
          },
        }
      );

      if (productResponse.data.status === "success") {
        // Delete queued images first
        for (const imageId of imagesToDelete) {
          try {
            await axios.delete(`/api/barang/slug/${slug}/gambar/${imageId}`, {
              headers: {
                "X-XSRF-TOKEN": token,
              },
            });
          } catch (error) {
            console.error("Error deleting image:", error);
          }
        }

        // Handle new image uploads
        const newImages = imageFiles.filter((img) => img.file);
        for (const image of newImages) {
          if (image.file) {
            const imageFormData = new FormData();
            imageFormData.append("gambar", image.file);
            imageFormData.append("is_primary", image.isPrimary ? "1" : "0");

            await axios.post(
              `/api/barang/slug/${slug}/gambar`, // Updated endpoint
              imageFormData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                  "X-XSRF-TOKEN": token,
                },
              }
            );
          }
        }

        // Update primary image status for existing images
        const existingImages = imageFiles.filter((img) => img.id_gambar);
        for (const image of existingImages) {
          if (image.id_gambar) {
            await axios.put(
              `/api/barang/slug/${slug}/gambar/${image.id_gambar}`,
              {
                is_primary: image.isPrimary,
              },
              {
                headers: {
                  "X-XSRF-TOKEN": token,
                },
              }
            );
          }
        }

        toast.success("Produk berhasil diperbarui");
        router.push(`/toko/produk/${formData.slug || slug}`);
      }
    } catch (error: any) {
      console.error("Error updating product:", error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
      toast.error(error.response?.data?.message || "Gagal memperbarui produk");
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
    isLoading,
    handleInputChange,
    handleSelectChange,
    handleImageChange,
    handleRemoveImage,
    setPrimaryImage,
    handleSubmit,
  };
}
