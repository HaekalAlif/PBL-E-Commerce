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

interface PageProps {
  params: {
    id: string;
  };
}

const EditAddressForm = ({ params }: PageProps) => {
  const router = useRouter();
  const { id } = params;
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
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

  // Fetch address data
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        setLoadingData(true);
        const response = await axiosInstance.get(`/api/user/addresses/${id}`, {
          withCredentials: true,
        });

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
        setError("Failed to load address data. Please try again.");
      } finally {
        setLoadingData(false);
      }
    };

    fetchAddress();
  }, [id]);

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
      return;
    }

    const fetchRegencies = async () => {
      try {
        setLoadingRegencies(true);

        // Don't reset kota and kecamatan when editing
        // We only want to reset them when user changes province

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
      return;
    }

    const fetchDistricts = async () => {
      try {
        setLoadingDistricts(true);

        // Don't reset kecamatan when editing

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
    setFormData((prev) => {
      // If province changes, reset city and district
      if (name === "provinsi" && prev.provinsi !== value) {
        return { ...prev, [name]: value, kota: "", kecamatan: "" };
      }
      // If city changes, reset district
      else if (name === "kota" && prev.kota !== value) {
        return { ...prev, [name]: value, kecamatan: "" };
      }
      // Otherwise just update the value
      return { ...prev, [name]: value };
    });
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

      // Use the custom axios instance which includes CSRF token handling
      const response = await axiosInstance.put(
        `/api/user/addresses/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          // withCredentials is already set in the instance
        }
      );

      if (response.data.status === "success") {
        setSuccess("Address updated successfully!");
        // Wait a moment before redirecting
        setTimeout(() => {
          router.push("/user/alamat");
        }, 1500);
      } else {
        throw new Error(response.data.message || "Failed to update address");
      }
    } catch (err: any) {
      console.error("Error updating address:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to update address. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="container mx-auto py-10 px-4 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading address data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-2xl mx-auto border-gray-200">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="text-gray-900">Edit Address</CardTitle>
          <CardDescription className="text-gray-600">
            Update your shipping address details
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 pt-6">
            {error && (
              <Alert variant="destructive" className="mb-4 bg-gray-100 border-gray-800">
                <AlertCircle className="h-4 w-4 text-gray-800" />
                <AlertTitle className="text-gray-900">Error</AlertTitle>
                <AlertDescription className="text-gray-700">{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-4 bg-gray-100 border-gray-400">
                <Check className="h-4 w-4 text-gray-700" />
                <AlertTitle className="text-gray-900">Success</AlertTitle>
                <AlertDescription className="text-gray-700">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="nama_penerima" className="text-gray-700">Recipient Name*</Label>
              <Input
                id="nama_penerima"
                name="nama_penerima"
                placeholder="Enter recipient name"
                value={formData.nama_penerima}
                onChange={handleInputChange}
                required
                className="border-gray-300 focus:border-gray-600 focus:ring-gray-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="no_telepon" className="text-gray-700">Phone Number*</Label>
              <Input
                id="no_telepon"
                name="no_telepon"
                placeholder="Enter phone number"
                value={formData.no_telepon}
                onChange={handleInputChange}
                required
                className="border-gray-300 focus:border-gray-600 focus:ring-gray-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="alamat_lengkap" className="text-gray-700">Full Address*</Label>
              <Textarea
                id="alamat_lengkap"
                name="alamat_lengkap"
                placeholder="Enter detailed address"
                value={formData.alamat_lengkap}
                onChange={handleInputChange}
                required
                className="border-gray-300 focus:border-gray-600 focus:ring-gray-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="provinsi" className="text-gray-700">Province*</Label>
              <Select
                value={formData.provinsi}
                onValueChange={(value) => handleSelectChange("provinsi", value)}
                disabled={loadingProvinces}
              >
                <SelectTrigger id="provinsi" className="w-full border-gray-300 focus:ring-gray-500">
                  <SelectValue
                    placeholder={
                      loadingProvinces
                        ? "Loading provinces..."
                        : "Select province"
                    }
                    className="text-gray-600"
                  />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  <SelectGroup>
                    <SelectLabel className="text-gray-700">Provinces</SelectLabel>
                    {provinces.map((province) => (
                      <SelectItem key={province.id} value={province.id} className="text-gray-800">
                        {province.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="kota" className="text-gray-700">City/Regency*</Label>
              <Select
                value={formData.kota}
                onValueChange={(value) => handleSelectChange("kota", value)}
                disabled={!formData.provinsi || loadingRegencies}
              >
                <SelectTrigger id="kota" className="w-full border-gray-300 focus:ring-gray-500">
                  <SelectValue
                    placeholder={
                      !formData.provinsi
                        ? "Select province first"
                        : loadingRegencies
                        ? "Loading cities..."
                        : "Select city/regency"
                    }
                    className="text-gray-600"
                  />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  <SelectGroup>
                    <SelectLabel className="text-gray-700">Cities/Regencies</SelectLabel>
                    {regencies.map((regency) => (
                      <SelectItem key={regency.id} value={regency.id} className="text-gray-800">
                        {regency.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="kecamatan" className="text-gray-700">District*</Label>
              <Select
                value={formData.kecamatan}
                onValueChange={(value) =>
                  handleSelectChange("kecamatan", value)
                }
                disabled={!formData.kota || loadingDistricts}
              >
                <SelectTrigger id="kecamatan" className="w-full border-gray-300 focus:ring-gray-500">
                  <SelectValue
                    placeholder={
                      !formData.kota
                        ? "Select city first"
                        : loadingDistricts
                        ? "Loading districts..."
                        : "Select district"
                    }
                    className="text-gray-600"
                  />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  <SelectGroup>
                    <SelectLabel className="text-gray-700">Districts</SelectLabel>
                    {districts.map((district) => (
                      <SelectItem key={district.id} value={district.id} className="text-gray-800">
                        {district.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="kode_pos" className="text-gray-700">Postal Code*</Label>
              <Input
                id="kode_pos"
                name="kode_pos"
                placeholder="Enter postal code"
                value={formData.kode_pos}
                onChange={handleInputChange}
                required
                className="border-gray-300 focus:border-gray-600 focus:ring-gray-500"
              />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="is_primary"
                checked={formData.is_primary}
                onCheckedChange={handleCheckboxChange}
                className="text-black focus:ring-gray-500"
              />
              <Label htmlFor="is_primary" className="text-gray-700">Set as primary address</Label>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between border-t border-gray-100 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-black hover:bg-gray-800 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Address"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default EditAddressForm;
