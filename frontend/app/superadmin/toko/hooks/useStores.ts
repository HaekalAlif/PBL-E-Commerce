import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { Store, StoreFilterParams } from "../types";

interface EditFormData {
  nama_toko: string;
  deskripsi: string;
  alamat: string;
  kontak: string;
  is_active: boolean;
}

export const useStores = () => {
  const router = useRouter();
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [editFormData, setEditFormData] = useState<EditFormData>({
    nama_toko: "",
    deskripsi: "",
    alamat: "",
    kontak: "",
    is_active: false,
  });

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // Fetch stores data
  const fetchStores = useCallback(async () => {
    setLoading(true);
    try {
      const params: StoreFilterParams = {
        page: currentPage,
        per_page: 10,
        search: search || undefined,
        is_active:
          statusFilter !== "all" ? statusFilter === "active" : undefined,
      };

      // Removed /api prefix as it's already in the baseUrl
      const response = await axios.get(`${baseUrl}/admin/toko`, {
        params,
        withCredentials: true,
      });

      if (response.data.success) {
        // Clean up store data to ensure proper display
        const cleanedStores = response.data.data.data.map((store: Store) => ({
          ...store,
          // Ensure boolean conversions are correct
          is_active: Boolean(store.is_active),
          is_deleted: Boolean(store.is_deleted),
          // Clean the name if needed
          nama_toko: String(store.nama_toko).replace(/0+$/, ""),
        }));

        setStores(cleanedStores);
        setTotalPages(
          Math.ceil(response.data.data.total / response.data.data.per_page)
        );
      }
    } catch (error: any) {
      console.error("Failed to fetch stores:", error);
      toast.error(
        "Failed to load stores: " +
          (error.response?.data?.message || error.message)
      );

      // If unauthorized, redirect to login
      if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [baseUrl, currentPage, statusFilter, search, router]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  // Handle search submission
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchStores();
  };

  // Handle status changes
  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      // Removed /api prefix
      const response = await axios.put(
        `${baseUrl}/admin/toko/${id}`,
        {
          is_active: !currentStatus,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success(`Store status updated successfully`);
        fetchStores();
      }
    } catch (error: any) {
      console.error("Failed to update store status:", error);
      toast.error("Failed to update store status");
    }
  };

  // Handle soft delete
  const handleSoftDelete = async (id: number) => {
    try {
      // Removed /api prefix
      const response = await axios.put(
        `${baseUrl}/admin/toko/${id}/soft-delete`,
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Store deleted successfully");
        fetchStores();
      }
    } catch (error: any) {
      console.error("Failed to delete store:", error);
      toast.error("Failed to delete store");
    }
  };

  // Handle restore
  const handleRestore = async (id: number) => {
    try {
      // Removed /api prefix
      const response = await axios.put(
        `${baseUrl}/admin/toko/${id}/restore`,
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Store restored successfully");
        fetchStores();
      }
    } catch (error: any) {
      console.error("Failed to restore store:", error);
      toast.error("Failed to restore store");
    }
  };

  // Get store details for edit
  const handleEditClick = (store: Store) => {
    setSelectedStore(store);
    // Clean the name when editing
    setEditFormData({
      nama_toko: String(store.nama_toko).replace(/0+$/, ""),
      deskripsi: store.deskripsi || "",
      alamat: store.alamat || "",
      kontak: store.kontak || "",
      is_active: store.is_active,
    });
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setEditFormData({
      ...editFormData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setEditFormData({
      ...editFormData,
      [name]: value === "true", // Convert string to boolean
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedStore) return;

    try {
      // Removed /api prefix
      const response = await axios.put(
        `${baseUrl}/admin/toko/${selectedStore.id_toko}`,
        editFormData,
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Store updated successfully");
        fetchStores();
      }
    } catch (error: any) {
      console.error("Failed to update store:", error);
      toast.error("Failed to update store");
    }
  };

  return {
    stores,
    loading,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    currentPage,
    setCurrentPage,
    totalPages,
    selectedStore,
    editFormData,
    handleSearch,
    handleToggleStatus,
    handleSoftDelete,
    handleRestore,
    handleEditClick,
    handleInputChange,
    handleSelectChange,
    handleSubmit,
    fetchStores,
  };
};
