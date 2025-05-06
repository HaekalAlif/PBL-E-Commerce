"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";

interface UserInfo {
  id_user?: number;
  username: string;
  email: string;
  name?: string;
  foto_profil?: string;
  role_name?: string;
  notifications_count?: number;
}

const ProfileCardAccount = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    username: "",
    email: "",
  });
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
          const userData = response.data.data;
          setUserInfo({
            id_user: userData.id_user,
            username: userData.username || "",
            name: userData.name || "",
            email: userData.email || "",
            foto_profil: userData.foto_profil,
            role_name: userData.role_name || "",
            notifications_count: userData.notifications_count || 0,
          });
        } else {
          throw new Error(response.data.message || "Failed to fetch user data");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
      >
        <div className="flex items-center gap-3 animate-pulse">
          <div className="w-12 h-12 rounded-full bg-orange-100" />
          <div className="space-y-2">
            <div className="h-4 w-24 bg-orange-100 rounded" />
            <div className="h-3 w-32 bg-orange-50 rounded" />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4"
    >
      <div className="flex items-center gap-3 mb-3">
        <Avatar className="w-12 h-12 border-2 border-orange-100">
          {userInfo.foto_profil ? (
            <AvatarImage
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${userInfo.foto_profil}`}
              alt={userInfo.name || "Profile"}
            />
          ) : (
            <AvatarFallback className="bg-gradient-to-r from-[#F79E0E] to-[#FFB648] text-white font-semibold text-xl">
              {getInitials(userInfo.name || userInfo.username)}
            </AvatarFallback>
          )}
        </Avatar>
        <div>
          <h3 className="font-semibold text-gray-900">
            {userInfo.name || userInfo.username}
          </h3>
          <p className="text-sm text-gray-500">{userInfo.email}</p>
        </div>
      </div>
      <div className="border-t border-gray-100 pt-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Bell className="w-4 h-4 text-orange-500" />
          <span>
            {userInfo.notifications_count
              ? `${userInfo.notifications_count} notifikasi baru`
              : "Tidak ada notifikasi baru"}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileCardAccount;
