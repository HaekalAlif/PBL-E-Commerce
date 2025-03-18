"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance, { getCsrfToken } from "@/lib/axios"; // Import custom axios instance with CSRF support
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Loader2,
  Plus,
  Star,
  StarOff,
  Pencil,
  Trash2,
  Home,
} from "lucide-react";

interface Address {
  id_alamat: number;
  id_user: number;
  nama_penerima: string;
  no_telepon: string;
  alamat_lengkap: string;
  provinsi: string;
  kota: string;
  kecamatan: string;
  kode_pos: string;
  is_primary: boolean;
  province_name?: string;
  regency_name?: string;
  district_name?: string;
}

const UserAddressesPage = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSettingPrimary, setIsSettingPrimary] = useState(false);
  const router = useRouter();

  // Fetch user addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/api/user/addresses`, {
          withCredentials: true,
        });

        if (response.data.status === "success") {
          // Fetch additional region details for each address
          const addressesWithDetails = await Promise.all(
            response.data.data.map(async (address: Address) => {
              try {
                // Get province name
                const provinceResponse = await axiosInstance.get(
                  `/api/provinces`,
                  { withCredentials: true }
                );
                const province = provinceResponse.data.data.find(
                  (p: any) => p.id === address.provinsi
                );

                // Get regency name
                const regencyResponse = await axiosInstance.get(
                  `/api/provinces/${address.provinsi}/regencies`,
                  { withCredentials: true }
                );
                const regency = regencyResponse.data.data.find(
                  (r: any) => r.id === address.kota
                );

                // Get district name
                const districtResponse = await axiosInstance.get(
                  `/api/regencies/${address.kota}/districts`,
                  { withCredentials: true }
                );
                const district = districtResponse.data.data.find(
                  (d: any) => d.id === address.kecamatan
                );

                return {
                  ...address,
                  province_name: province?.name || "Unknown",
                  regency_name: regency?.name || "Unknown",
                  district_name: district?.name || "Unknown",
                };
              } catch (err) {
                console.error("Error fetching region details:", err);
                return {
                  ...address,
                  province_name: "Unknown",
                  regency_name: "Unknown",
                  district_name: "Unknown",
                };
              }
            })
          );

          setAddresses(addressesWithDetails);
        } else {
          throw new Error(response.data.message || "Failed to fetch addresses");
        }
      } catch (err) {
        console.error("Error fetching addresses:", err);
        setError("Failed to load addresses. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  const handleSetPrimaryAddress = async (id: number) => {
    try {
      setIsSettingPrimary(true);
      // Use axiosInstance instead of axios to include CSRF token
      const response = await axiosInstance.put(
        `/api/user/addresses/${id}/primary`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (response.data.status === "success") {
        // Update local state to reflect the change
        setAddresses(
          addresses.map((address) => ({
            ...address,
            is_primary: address.id_alamat === id,
          }))
        );
      } else {
        throw new Error(
          response.data.message || "Failed to set primary address"
        );
      }
    } catch (err) {
      console.error("Error setting primary address:", err);
      setError("Failed to set primary address. Please try again.");
    } finally {
      setIsSettingPrimary(false);
    }
  };

  const handleDeleteAddress = async () => {
    if (!deleteId) return;

    try {
      setIsDeleting(true);
      // Use axiosInstance instead of axios to include CSRF token
      const response = await axiosInstance.delete(
        `/api/user/addresses/${deleteId}`
      );

      if (response.data.status === "success") {
        // Remove the deleted address from state
        setAddresses(addresses.filter((a) => a.id_alamat !== deleteId));
        setDeleteId(null);
      } else {
        throw new Error(response.data.message || "Failed to delete address");
      }
    } catch (err) {
      console.error("Error deleting address:", err);
      setError("Failed to delete address. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddAddressClick = () => {
    router.push("/user/alamat/create");
  };

  const handleEditAddressClick = (id: number) => {
    router.push(`/user/alamat/edit/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Addresses</h1>
          <p className="text-gray-600">Manage your shipping addresses</p>
        </div>
        <Button onClick={handleAddAddressClick}>
          <Plus className="mr-2 h-4 w-4" /> Add New Address
        </Button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-800">
          {error}
        </div>
      )}

      {addresses.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <Home className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No addresses found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Add a new address to manage your shipping locations.
          </p>
          <div className="mt-6">
            <Button onClick={handleAddAddressClick}>
              <Plus className="mr-2 h-4 w-4" /> Add Address
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {addresses.map((address) => (
            <Card
              key={address.id_alamat}
              className={address.is_primary ? "border-2 border-primary" : ""}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">
                    {address.nama_penerima}
                  </CardTitle>
                  {address.is_primary && (
                    <Badge
                      variant="outline"
                      className="bg-primary/10 text-primary border-primary"
                    >
                      Primary
                    </Badge>
                  )}
                </div>
                <CardDescription>{address.no_telepon}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-2 text-sm">
                  <p className="text-gray-700">{address.alamat_lengkap}</p>
                  <p className="text-gray-600">
                    {address.district_name}, {address.regency_name}
                  </p>
                  <p className="text-gray-600">
                    {address.province_name}, {address.kode_pos}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditAddressClick(address.id_alamat)}
                  >
                    <Pencil className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Address</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this address? This
                          action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-600 hover:bg-red-700 text-white"
                          onClick={() => {
                            setDeleteId(address.id_alamat);
                            handleDeleteAddress();
                          }}
                          disabled={isDeleting}
                        >
                          {isDeleting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Deleting...
                            </>
                          ) : (
                            "Delete"
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                {!address.is_primary && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSetPrimaryAddress(address.id_alamat)}
                    disabled={isSettingPrimary}
                  >
                    {isSettingPrimary ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Star className="h-4 w-4 mr-1" />
                    )}
                    Set as Primary
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-8 flex justify-start">
        <Button variant="outline" onClick={() => router.push("/user")}>
          Back to Profile
        </Button>
      </div>
    </div>
  );
};

export default UserAddressesPage;
