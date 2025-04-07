"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance, { getCsrfToken } from "@/lib/axios"; // Import custom axios instance and CSRF helper
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Check, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Province {
  id: string;
  name: string;
}

interface Regency {
  id: string;
  name: string;
}

interface District {
  id: string;
  name: string;
}

interface Village {
  id: string;
  name: string;
}

interface FormData {
  nama_penerima: string;
  no_telepon: string;
  alamat_lengkap: string;
  provinsi: string;
  kota: string;
  kecamatan: string;
  kode_pos: string;
  is_primary: boolean;
}

const AddressForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form data state
  const [formData, setFormData] = useState<FormData>({
    nama_penerima: "",
    no_telepon: "",
    alamat_lengkap: "",
    provinsi: "",
    kota: "",
    kecamatan: "",
    kode_pos: "",
    is_primary: false,
  });

  // Region data states
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [regencies, setRegencies] = useState<Regency[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [villages, setVillages] = useState<Village[]>([]);

  // Loading states for region data
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingRegencies, setLoadingRegencies] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingVillages, setLoadingVillages] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

  // Fetch provinces on component mount
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
  }, [apiUrl]);

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
        setVillages([]);

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
  }, [formData.provinsi, apiUrl]);

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
        setVillages([]);

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
  }, [formData.kota, apiUrl]);

  // Fetch villages when district changes
  useEffect(() => {
    if (!formData.kecamatan) {
      setVillages([]);
      return;
    }

    const fetchVillages = async () => {
      try {
        setLoadingVillages(true);
        const response = await axiosInstance.get(
          `${apiUrl}/districts/${formData.kecamatan}/villages`,
          { withCredentials: true }
        );

        if (response.data.status === "success") {
          setVillages(response.data.data);
        } else {
          throw new Error("Failed to fetch villages");
        }
      } catch (err) {
        console.error("Error fetching villages:", err);
      } finally {
        setLoadingVillages(false);
      }
    };

    fetchVillages();
  }, [formData.kecamatan, apiUrl]);

  // Fetch CSRF token on component mount
  useEffect(() => {
    // Ensure CSRF token is available before form submission
    const checkCsrfToken = async () => {
      const token = getCsrfToken();
      console.log("CSRF token available:", !!token);
    };

    checkCsrfToken();
  }, []);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle checkbox change
  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, is_primary: checked }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Validate form
      if (
        !formData.nama_penerima ||
        !formData.no_telepon ||
        !formData.alamat_lengkap ||
        !formData.provinsi ||
        !formData.kota ||
        !formData.kecamatan ||
        !formData.kode_pos
      ) {
        throw new Error("Please fill in all required fields");
      }

      // Use the correct API endpoint with /api/ prefix
      const response = await axiosInstance.post(
        `${apiUrl}/user/addresses`, // Make sure to use the full API URL
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-XSRF-TOKEN": (await getCsrfToken()) ?? "", // Ensure a valid string or fallback to an empty string
          },
          withCredentials: true, // Ensure credentials are sent
        }
      );

      if (response.data.status === "success") {
        setSuccess("Address added successfully!");
        // Wait a moment before redirecting
        setTimeout(() => {
          router.push("/user/alamat");
        }, 1500);
      } else {
        throw new Error(response.data.message || "Failed to add address");
      }
    } catch (err: any) {
      console.error("Error adding address:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to add address. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Add New Address</CardTitle>
          <CardDescription>
            Add a new shipping address to your account
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-4 bg-green-50 border-green-200">
                <Check className="h-4 w-4 text-green-500" />
                <AlertTitle className="text-green-800">Success</AlertTitle>
                <AlertDescription className="text-green-700">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="nama_penerima">Recipient Name*</Label>
              <Input
                id="nama_penerima"
                name="nama_penerima"
                placeholder="Enter recipient name"
                value={formData.nama_penerima}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="no_telepon">Phone Number*</Label>
              <Input
                id="no_telepon"
                name="no_telepon"
                placeholder="Enter phone number"
                value={formData.no_telepon}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="alamat_lengkap">Full Address*</Label>
              <Textarea
                id="alamat_lengkap"
                name="alamat_lengkap"
                placeholder="Enter detailed address"
                value={formData.alamat_lengkap}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="provinsi">Province*</Label>
              <Select
                value={formData.provinsi}
                onValueChange={(value) => handleSelectChange("provinsi", value)}
                disabled={loadingProvinces}
              >
                <SelectTrigger id="provinsi" className="w-full">
                  <SelectValue
                    placeholder={
                      loadingProvinces
                        ? "Loading provinces..."
                        : "Select province"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Provinces</SelectLabel>
                    {provinces.map((province) => (
                      <SelectItem key={province.id} value={province.id}>
                        {province.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="kota">City/Regency*</Label>
              <Select
                value={formData.kota}
                onValueChange={(value) => handleSelectChange("kota", value)}
                disabled={!formData.provinsi || loadingRegencies}
              >
                <SelectTrigger id="kota" className="w-full">
                  <SelectValue
                    placeholder={
                      !formData.provinsi
                        ? "Select province first"
                        : loadingRegencies
                        ? "Loading cities..."
                        : "Select city/regency"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Cities/Regencies</SelectLabel>
                    {regencies.map((regency) => (
                      <SelectItem key={regency.id} value={regency.id}>
                        {regency.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="kecamatan">District*</Label>
              <Select
                value={formData.kecamatan}
                onValueChange={(value) =>
                  handleSelectChange("kecamatan", value)
                }
                disabled={!formData.kota || loadingDistricts}
              >
                <SelectTrigger id="kecamatan" className="w-full">
                  <SelectValue
                    placeholder={
                      !formData.kota
                        ? "Select city first"
                        : loadingDistricts
                        ? "Loading districts..."
                        : "Select district"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Districts</SelectLabel>
                    {districts.map((district) => (
                      <SelectItem key={district.id} value={district.id}>
                        {district.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="kode_pos">Postal Code*</Label>
              <Input
                id="kode_pos"
                name="kode_pos"
                placeholder="Enter postal code"
                value={formData.kode_pos}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="flex items-center space-x-2 pt-2 pb-4">
              <Checkbox
                id="is_primary"
                checked={formData.is_primary}
                onCheckedChange={handleCheckboxChange}
              />
              <Label htmlFor="is_primary">Set as primary address</Label>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Address"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AddressForm;
