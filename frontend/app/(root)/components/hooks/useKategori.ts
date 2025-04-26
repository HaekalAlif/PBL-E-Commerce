"use client";

import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { Kategori } from "@/app/superadmin/kategori/types";

export const useKategori = () => {
  const [kategori, setKategori] = useState<Kategori[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchKategori = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/kategori");

        if (response.data.status === "success") {
          setKategori(response.data.data);
        } else {
          setError("Failed to fetch categories");
          setKategori([]);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Error loading categories");
        setKategori([]);
      } finally {
        setLoading(false);
      }
    };

    fetchKategori();
  }, []);

  return { kategori, loading, error };
};
