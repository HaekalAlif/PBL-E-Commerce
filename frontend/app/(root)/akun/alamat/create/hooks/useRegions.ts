import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";
import { Province, Regency, District, Village } from "../types";

export const useRegions = (formData: { provinsi: string; kota: string; kecamatan: string }) => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [regencies, setRegencies] = useState<Regency[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [villages, setVillages] = useState<Village[]>([]);

  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingRegencies, setLoadingRegencies] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingVillages, setLoadingVillages] = useState(false);

  // ... existing fetchProvinces, fetchRegencies, etc. useEffects ...

  return {
    provinces,
    regencies,
    districts,
    villages,
    loadingProvinces,
    loadingRegencies,
    loadingDistricts,
    loadingVillages,
  };
};
