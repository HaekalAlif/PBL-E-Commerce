"use client";

import React, { useEffect, useState } from "react";
import LogoutButton from "@/components/auth/LogoutButton";
import axios from "axios";
import { User as UserIcon, Mail, Phone, Shield } from "lucide-react";

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

        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

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
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
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

  if (loading) {
    return (
      <div className="bg-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-5xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-orange-400 rounded-full w-14 h-14 flex items-center justify-center">
            <UserIcon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Profile Saya</h1>
            <p className="text-gray-500 text-sm">
              Kelola informasi profil Anda untuk keamanan akun
            </p>
            {error && (
              <div className="mt-2 p-2 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Avatar */}
          <div className="flex flex-col items-center min-w-[200px]">
            <div className="bg-gradient-to-br from-orange-400 to-orange-300 rounded-full w-40 h-40 flex items-center justify-center text-white text-6xl font-bold border-4 border-white shadow">
              {(userData.name || userData.username || "S").charAt(0).toUpperCase()}
            </div>
            <span className="mt-4 text-lg font-semibold text-gray-900 text-center">
              {userData.name || userData.username || "Super Admin"}
            </span>
          </div>
          {/* Data */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Data Pribadi */}
            <div>
              <div className="flex items-center gap-2 text-orange-500 font-semibold mb-2">
                <UserIcon className="w-5 h-5" />
                Data Pribadi
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#fafbfc] rounded-xl p-5 flex flex-col gap-1">
                  <div className="text-xs text-gray-500 mb-1">Username</div>
                  <div className="font-semibold text-gray-900 flex items-center gap-1">
                    <UserIcon className="w-4 h-4 text-orange-400" />
                    {userData.username || "Not available"}
                  </div>
                </div>
                <div className="bg-[#fafbfc] rounded-xl p-5 flex flex-col gap-1">
                  <div className="text-xs text-gray-500 mb-1">Nama Lengkap</div>
                  <div className="font-semibold text-gray-900 flex items-center gap-1">
                    <UserIcon className="w-4 h-4 text-orange-400" />
                    {userData.name || "Not available"}
                  </div>
                </div>
              </div>
            </div>
            {/* Kontak */}
            <div>
              <div className="flex items-center gap-2 text-orange-500 font-semibold mb-2 mt-2">
                <Mail className="w-5 h-5" />
                Kontak
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#fafbfc] rounded-xl p-5 flex flex-col gap-1">
                  <div className="text-xs text-gray-500 mb-1">Email</div>
                  <div className="flex items-center gap-2 font-semibold text-gray-900">
                    <Mail className="w-4 h-4 text-orange-400" />
                    {userData.email || "Not available"}
                    {userData.is_verified && (
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">
                        Terverifikasi
                      </span>
                    )}
                  </div>
                </div>
                <div className="bg-[#fafbfc] rounded-xl p-5 flex flex-col gap-1">
                  <div className="text-xs text-gray-500 mb-1">Nomor Telepon</div>
                  <div className="font-semibold text-gray-900 flex items-center gap-1">
                    <Phone className="w-4 h-4 text-orange-400" />
                    {userData.no_hp || "Not available"}
                  </div>
                </div>
              </div>
            </div>
            {/* User Role & Account Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#fafbfc] rounded-xl p-5 flex flex-col gap-1">
                <div className="text-xs text-gray-500 mb-1">User Role</div>
                <div className="font-semibold text-gray-900">
                  {userData.role_name || "Not available"}
                </div>
              </div>
              <div className="bg-[#fafbfc] rounded-xl p-5 flex flex-col gap-1">
                <div className="text-xs text-gray-500 mb-1">Account Status</div>
                <div className="font-semibold text-gray-900">
                  {userData.is_active === true
                    ? "Active"
                    : userData.is_active === false
                    ? "Inactive"
                    : "Unknown"}
                </div>
              </div>
            </div>
            {/* Info */}
            <div className="bg-orange-50 rounded-xl p-4 flex items-center gap-2 text-orange-500 text-sm mt-2">
              <Shield className="w-5 h-5" />
              Data Anda terlindungi dengan enkripsi end-to-end
            </div>
            {/* Logout */}
            <div className="flex justify-end mt-4">
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperadminPage;