"use client";

import React, { useEffect, useState } from "react";
import LogoutButton from "@/components/auth/LogoutButton";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

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

const AdminPage = () => {
  const [userData, setUserData] = useState<UserData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-lg border-gray-200">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-2xl text-gray-900">
              Admin Dashboard
            </CardTitle>
            <CardDescription className="text-gray-600">
              Welcome to your admin dashboard
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <Alert
                variant="destructive"
                className="mb-6 bg-gray-100 border-gray-800"
              >
                <AlertCircle className="h-4 w-4 text-gray-800" />
                <AlertTitle className="text-gray-900">Error</AlertTitle>
                <AlertDescription className="text-gray-700">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {loading ? (
              <div className="space-y-4">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="flex py-2">
                      <Skeleton className="h-6 w-1/4 mr-8 bg-gray-200" />
                      <Skeleton className="h-6 w-3/4 bg-gray-200" />
                    </div>
                  ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 items-center py-2 border-b border-gray-200">
                  <div className="font-medium text-sm text-gray-500">
                    Username
                  </div>
                  <div className="col-span-2 text-sm text-gray-800">
                    {userData.username || "Not available"}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 items-center py-2 border-b border-gray-200">
                  <div className="font-medium text-sm text-gray-500">
                    Full Name
                  </div>
                  <div className="col-span-2 text-sm text-gray-800">
                    {userData.name || "Not available"}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 items-center py-2 border-b border-gray-200">
                  <div className="font-medium text-sm text-gray-500">Email</div>
                  <div className="col-span-2 text-sm text-gray-800">
                    {userData.email || "Not available"}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 items-center py-2 border-b border-gray-200">
                  <div className="font-medium text-sm text-gray-500">
                    Phone Number
                  </div>
                  <div className="col-span-2 text-sm text-gray-800">
                    {userData.no_hp || "Not available"}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 items-center py-2 border-b border-gray-200">
                  <div className="font-medium text-sm text-gray-500">
                    User Role
                  </div>
                  <div className="col-span-2 text-sm text-gray-800">
                    {userData.role_name || "Not available"}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 items-center py-2">
                  <div className="font-medium text-sm text-gray-500">
                    Account Status
                  </div>
                  <div className="col-span-2 text-sm text-gray-800">
                    {userData.is_active === true
                      ? "Active"
                      : userData.is_active === false
                      ? "Inactive"
                      : "Unknown"}
                  </div>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-end border-t border-gray-100 pt-4">
            <LogoutButton />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AdminPage;
