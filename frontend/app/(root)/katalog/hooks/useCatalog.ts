import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { Product, Category, Province, Regency, FilterOptions } from "../types";
import { toast } from "sonner";

export function useCatalog() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [regencies, setRegencies] = useState<Regency[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Initialize filters from URL parameters
  const [filters, setFilters] = useState<FilterOptions>({
    category: null,
    province: null,
    regency: null,
    minPrice: null,
    maxPrice: null,
    grade: null,
    sortBy: "created_at",
    sortOrder: "desc",
  });

  useEffect(() => {
    fetchCategories();
    fetchProvinces();

    // Initialize filters from URL parameters with null check
    if (searchParams) {
      const categoryParam = searchParams.get("category");
      const provinceParam = searchParams.get("province");
      const regencyParam = searchParams.get("regency");
      const minPriceParam = searchParams.get("min_price");
      const maxPriceParam = searchParams.get("max_price");
      const gradeParam = searchParams.get("grade");
      const sortByParam = searchParams.get("sort_by");
      const sortOrderParam = searchParams.get("sort_order");
      const searchParam = searchParams.get("search");

      // Always update filters, even if all params are null
      setFilters((prev) => ({
        ...prev,
        category: categoryParam || null,
        province: provinceParam || null,
        regency: regencyParam || null,
        minPrice: minPriceParam ? parseInt(minPriceParam) : null,
        maxPrice: maxPriceParam ? parseInt(maxPriceParam) : null,
        grade: gradeParam || null,
        sortBy: sortByParam || "created_at",
        sortOrder: (sortOrderParam as "asc" | "desc") || "desc",
      }));

      if (searchParam) {
        setSearchQuery(searchParam);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, filters, currentPage]);

  useEffect(() => {
    if (filters.province) {
      fetchRegencies(filters.province);
    } else {
      setRegencies([]);
    }
  }, [filters.province]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/kategori`
      );
      if (response.data) {
        setCategories(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    }
  };

  const fetchProvinces = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/location/provinces`
      );
      if (response.data) {
        setProvinces(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching provinces:", error);
    }
  };

  const fetchRegencies = async (provinceId: string) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/location/regencies/${provinceId}`
      );
      if (response.data) {
        setRegencies(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching regencies:", error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();

      if (searchQuery) queryParams.append("search", searchQuery);
      if (filters.category) queryParams.append("category", filters.category); // Now sends slug
      if (filters.province) queryParams.append("province", filters.province);
      if (filters.regency) queryParams.append("regency", filters.regency);
      if (filters.minPrice)
        queryParams.append("min_price", filters.minPrice.toString());
      if (filters.maxPrice)
        queryParams.append("max_price", filters.maxPrice.toString());
      if (filters.grade) queryParams.append("grade", filters.grade);
      queryParams.append("sort_by", filters.sortBy);
      queryParams.append("sort_order", filters.sortOrder);
      queryParams.append("page", currentPage.toString());

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/products?${queryParams}`
      );

      if (response.data.status === "success") {
        setProducts(response.data.data.data || []);
        setTotalPages(
          Math.ceil(response.data.data.total / response.data.data.per_page)
        );
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    updateURLParams(filters, searchQuery);
  };

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    // Special handling for regency when province changes
    let newFilters = {
      ...filters,
      [key]: value,
    };

    // If province is changed, reset regency
    if (key === "province") {
      newFilters.regency = null;
    }

    setFilters(newFilters);
    setCurrentPage(1);

    // Update URL parameters
    updateURLParams(newFilters, searchQuery);
  };

  const clearFilters = () => {
    const clearedFilters = {
      category: null,
      province: null,
      regency: null,
      minPrice: null,
      maxPrice: null,
      grade: null,
      sortBy: "created_at",
      sortOrder: "desc" as "desc",
    };

    setFilters(clearedFilters);
    setCurrentPage(1);
    setSearchQuery("");

    // Clear URL parameters by navigating to clean URL
    router.push("/katalog", { scroll: false });
  };

  const updateURLParams = (
    currentFilters: FilterOptions,
    currentSearch: string
  ) => {
    const params = new URLSearchParams();

    if (currentSearch) params.set("search", currentSearch);
    if (currentFilters.category)
      params.set("category", currentFilters.category);
    if (currentFilters.province)
      params.set("province", currentFilters.province);
    if (currentFilters.regency) params.set("regency", currentFilters.regency);
    if (currentFilters.minPrice)
      params.set("min_price", currentFilters.minPrice.toString());
    if (currentFilters.maxPrice)
      params.set("max_price", currentFilters.maxPrice.toString());
    if (currentFilters.grade) params.set("grade", currentFilters.grade);
    if (currentFilters.sortBy !== "created_at")
      params.set("sort_by", currentFilters.sortBy);
    if (currentFilters.sortOrder !== "desc")
      params.set("sort_order", currentFilters.sortOrder);

    const queryString = params.toString();
    const newUrl = queryString ? `/katalog?${queryString}` : "/katalog";

    router.push(newUrl, { scroll: false });
  };

  return {
    products,
    categories,
    provinces,
    regencies,
    loading,
    searchQuery,
    filters,
    currentPage,
    totalPages,
    setSearchQuery,
    handleSearch,
    updateFilter,
    clearFilters,
    setCurrentPage,
  };
}
