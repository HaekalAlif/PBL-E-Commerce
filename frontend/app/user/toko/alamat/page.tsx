"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  CheckCircle2,
  Edit,
  Loader2,
  MapPin,
  PlusCircle,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

interface StoreAddress {
  id_alamat_toko: number;
  id_toko: number;
  nama_pengirim: string;
  no_telepon: string;
  alamat_lengkap: string;
  provinsi: string;
  kota: string;
  kecamatan: string;
  kode_pos: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
  province?: {
    id: string;
    name: string;
  };
  regency?: {
    id: string;
    name: string;
  };
  district?: {
    id: string;
    name: string;
  };
}

const StoreAddressesPage = () => {
  const router = useRouter();
  const [addresses, setAddresses] = useState<StoreAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // Fetch addresses on component mount
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axiosInstance.get(`/api/toko/addresses`, {
          withCredentials: true,
        });

        if (response.data.status === "success") {
          setAddresses(response.data.data);
        } else {
          throw new Error(response.data.message || "Failed to fetch addresses");
        }
      } catch (err: any) {
        console.error("Error fetching addresses:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "An error occurred while fetching addresses"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  // Handle delete address
  const handleDeleteAddress = async (id: number) => {
    try {
      setActionLoading(id);

      const response = await axiosInstance.delete(`/api/toko/addresses/${id}`, {
        withCredentials: true,
      });

      if (response.data.status === "success") {
        // Update addresses list
        setAddresses((prev) =>
          prev.filter((address) => address.id_alamat_toko !== id)
        );

        toast.success("Success", {
          description: "Address has been deleted successfully",
        });
      } else {
        throw new Error(
          response.data.message || "Failed to delete the address"
        );
      }
    } catch (err: any) {
      console.error("Error deleting address:", err);
      toast.error("Error", {
        description:
          err.response?.data?.message ||
          err.message ||
          "An error occurred while deleting the address",
      });
    } finally {
      setActionLoading(null);
    }
  };

  // Handle set as primary
  const handleSetAsPrimary = async (id: number) => {
    try {
      setActionLoading(id);

      const response = await axiosInstance.patch(
        `/api/toko/addresses/${id}/primary`,
        {},
        {
          withCredentials: true,
        }
      );

      if (response.data.status === "success") {
        // Update addresses list
        setAddresses((prev) =>
          prev.map((address) => ({
            ...address,
            is_primary: address.id_alamat_toko === id,
          }))
        );

        toast.success("Success", {
          description: "Address has been set as primary",
        });
      } else {
        throw new Error(
          response.data.message || "Failed to set address as primary"
        );
      }
    } catch (err: any) {
      console.error("Error setting address as primary:", err);
      toast.error("Error", {
        description:
          err.response?.data?.message ||
          err.message ||
          "An error occurred while setting the address as primary",
      });
    } finally {
      setActionLoading(null);
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center mb-6">
          <MapPin className="h-6 w-6 mr-2" />
          <h1 className="text-2xl font-bold">Store Addresses</h1>
        </div>

        <div className="flex justify-center items-center py-16">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading addresses...</p>
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center mb-6">
          <MapPin className="h-6 w-6 mr-2" />
          <h1 className="text-2xl font-bold">Store Addresses</h1>
        </div>

        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>

        <Button onClick={() => router.push("/user/toko")}>Back to Store</Button>
      </div>
    );
  }

  // Render empty state
  if (addresses.length === 0) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <MapPin className="h-6 w-6 mr-2" />
            <h1 className="text-2xl font-bold">Store Addresses</h1>
          </div>
          <Button
            onClick={() => router.push("/user/toko/alamat/create")}
            className="bg-black hover:bg-gray-800 text-white"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add New Address
          </Button>
        </div>

        <Card className="w-full border-gray-200">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MapPin className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Addresses Found
            </h3>
            <p className="text-gray-500 text-center mb-6 max-w-md">
              You haven't added any addresses for your store yet. Add a shipping
              address to start selling products.
            </p>
            <Button
              onClick={() => router.push("/user/toko/alamat/create")}
              className="bg-black hover:bg-gray-800 text-white"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add New Address
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render addresses list
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <MapPin className="h-6 w-6 mr-2" />
          <h1 className="text-2xl font-bold">Store Addresses</h1>
        </div>
        <Button
          onClick={() => router.push("/user/toko/alamat/create")}
          className="bg-black hover:bg-gray-800 text-white"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add New Address
        </Button>
      </div>

      <div className="grid gap-4">
        {addresses.map((address) => (
          <Card
            key={address.id_alamat_toko}
            className={`w-full border-gray-200 ${
              address.is_primary ? "ring-1 ring-black" : ""
            }`}
          >
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                <div>
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium mr-2">
                      {address.nama_pengirim}
                    </h3>
                    {address.is_primary && (
                      <Badge className="bg-black text-white">Primary</Badge>
                    )}
                  </div>
                  <p className="text-gray-600">{address.no_telepon}</p>
                </div>
                <div className="flex mt-2 sm:mt-0 gap-2">
                  {!address.is_primary && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSetAsPrimary(address.id_alamat_toko)}
                      disabled={actionLoading === address.id_alamat_toko}
                      className="border-gray-300 text-gray-700"
                    >
                      {actionLoading === address.id_alamat_toko ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-1" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                      )}
                      Set as Primary
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      router.push(
                        `/user/toko/alamat/edit/${address.id_alamat_toko}`
                      )
                    }
                    className="border-gray-300 text-gray-700"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-300 text-red-600 hover:bg-red-50"
                        disabled={actionLoading === address.id_alamat_toko}
                      >
                        {actionLoading === address.id_alamat_toko ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-1" />
                        ) : (
                          <Trash2 className="h-4 w-4 mr-1" />
                        )}
                        Delete
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
                          onClick={() =>
                            handleDeleteAddress(address.id_alamat_toko)
                          }
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>

              <Separator className="my-3" />

              <div>
                <p className="text-gray-800 mb-2">{address.alamat_lengkap}</p>
                <p className="text-gray-500 text-sm">
                  {address.province?.name && `${address.province.name}, `}
                  {address.regency?.name && `${address.regency.name}, `}
                  {address.district?.name && `${address.district.name}, `}
                  {address.kode_pos}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6">
        <Button
          variant="outline"
          onClick={() => router.push("/user/toko")}
          className="border-gray-300 text-gray-700"
        >
          Back to Store
        </Button>
      </div>
    </div>
  );
};

export default StoreAddressesPage;
