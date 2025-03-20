"use client";

import React, { useEffect, useState } from "react";
import LogoutButton from "@/components/auth/LogoutButton";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface UserData {
  id_user?: number;
  username?: string;
  name?: string;
  email?: string;
  no_hp?: string;
  foto_profil?: string | null;
  tanggal_lahir?: string | null;
  role?: number;
  role_name?: string;
  is_verified?: boolean;
  is_active?: boolean;
}

const UserPage = () => {
  const [userData, setUserData] = useState<UserData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        // Using Axios and the environment variables for API URL
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

        const response = await axios.get(`${apiUrl}/user/profile`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: true, // Important for sending cookies with request
        });

        if (response.data.status === "success") {
          setUserData(response.data.data);
        } else {
          throw new Error(response.data.message || "Something went wrong");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        console.error("Error fetching user data:", err);

        // Fallback to using cookies if API fails
        const userRole = document.cookie
          .split("; ")
          .find((row) => row.startsWith("user_role="))
          ?.split("=")[1];

        const roleName = document.cookie
          .split("; ")
          .find((row) => row.startsWith("role_name="))
          ?.split("=")[1];

        setUserData({
          role: userRole ? parseInt(userRole) : undefined,
          role_name: roleName || "",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleAddressClick = () => {
    router.push("/user/alamat");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  User Dashboard
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Welcome to your user dashboard
                </p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={handleAddressClick}>
                  Manage Addresses
                </Button>
              </div>
            </div>
            {error && (
              <div className="mt-2 p-2 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Username
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {userData.username || "Not available"}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Full Name
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {userData.name || "Not available"}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {userData.email || "Not available"}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Phone Number
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {userData.no_hp || "Not available"}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    User Role
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {userData.role_name || "Not available"}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Account Status
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {userData.is_active === true
                      ? "Active"
                      : userData.is_active === false
                      ? "Inactive"
                      : "Unknown"}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="px-4 py-5 sm:px-6 flex justify-end">
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
