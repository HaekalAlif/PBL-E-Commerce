"use client";

import React, { useEffect, useState } from "react";
import LogoutButton from "@/components/auth/LogoutButton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import axios from "axios";
import {
  User,
  Phone,
  Calendar,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Mail
} from "lucide-react";



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

const SuperadminPage = () => {
  const [userData, setUserData] = useState<UserData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

        const response = await axios.get(`${apiUrl}/user/profile`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: true,
        });

        if (response.data.status === "success") {
          setUserData(response.data.data);
        } else {
          throw new Error(response.data.message || "Something went wrong");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");

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

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center text-orange-500 font-semibold text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <div className="mx-12 py-6 px-4">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="bg-[#F79E0E] px-6 py-5 text-white rounded-t-2xl">
            <h3 className="text-xl font-bold">Dashboard</h3>
            <p className="text-sm">
              Selamat datang kembali, {userData.name || 'User'}!
            </p>
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 m-4 rounded-md">
              {error}
            </div>
          )}

          <div className="p-6 space-y-5 text-sm text-gray-700">
            {/* Avatar dan nama */}
            <div className="flex items-center space-x-4">
              <Avatar className="h-10 w-10 border-2 border-background shadow-sm transition-all">
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-semibold text-sm">
                  {loading ? '...' : getInitials(userData.name || '')}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold text-lg">
                  {userData.name || 'Nama tidak tersedia'}
                </div>
                <div className="text-gray-500">
                  {userData.email || 'Email tidak tersedia'}
                </div>
              </div>
            </div>

            {/* Data pengguna */}
            <div className="divide-y divide-gray-200 space-y-4">
              {/* Username */}
              <div className="flex justify-between items-start py-2">
                <div className="flex items-center gap-2 text-gray-500 font-medium">
                  <User className="text-orange-500 w-5 h-5" />
                  Username
                </div>
                <div className="text-right text-gray-800">
                  {userData.username || 'Tidak tersedia'}
                </div>
              </div>

              {/* Email */}
              <div className="flex justify-between items-start py-2">
                <div className="flex items-center gap-2 text-gray-500 font-medium">
                  <Mail className="text-orange-500 w-5 h-5" />
                  Email
                </div>
                <div className="text-right text-gray-800">
                  {userData.email || 'Tidak tersedia'}
                </div>
              </div>

              {/* Nomor HP */}
              <div className="flex justify-between items-start py-2">
                <div className="flex items-center gap-2 text-gray-500 font-medium">
                  <Phone className="text-orange-500 w-5 h-5" />
                  No. HP
                </div>
                <div className="text-right text-gray-800">
                  {userData.no_hp || 'Tidak tersedia'}
                </div>
              </div>

              {/* Role */}
              <div className="flex justify-between items-start py-2">
                <div className="flex items-center gap-2 text-gray-500 font-medium">
                  <ShieldCheck className="text-orange-500 w-5 h-5" />
                  Role
                </div>
                <div className="text-right text-gray-800">
                  {userData.role_name || 'Tidak tersedia'}
                </div>
              </div>

              {/* Status Akun */}
              <div className="flex justify-between items-start py-2">
                <div className="flex items-center gap-2 text-gray-500 font-medium">
                  {userData.is_active ? (
                    <CheckCircle className="text-green-500 w-5 h-5" />
                  ) : (
                    <XCircle className="text-red-500 w-5 h-5" />
                  )}
                  Status Akun
                </div>
                <div className="text-right text-gray-800">
                  {userData.is_active === true
                    ? 'Aktif'
                    : userData.is_active === false
                      ? 'Tidak Aktif'
                      : 'Tidak Diketahui'}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t px-6 py-4 flex justify-end bg-gray-50">
            <LogoutButton />
          </div>
        </div>
      </div>
    </div>
  )
};

export default SuperadminPage;
