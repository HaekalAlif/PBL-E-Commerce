import { useState, useEffect } from "react";
import { UserData } from "../types";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";

export const useProfile = () => {
  const [userData, setUserData] = useState<UserData>({
    username: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/api/user/profile");

        if (response.data.status === "success") {
          setUserData(response.data.data);
        } else {
          throw new Error("Failed to fetch profile data");
        }
      } catch (err: any) {
        const errorMsg =
          err.response?.data?.message || "Failed to load profile";
        setError(errorMsg);
        toast.error("Error", { description: errorMsg });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEditProfile = async (updatedData: Partial<UserData>) => {
    try {
      const response = await axiosInstance.put(
        "/api/user/profile",
        updatedData
      );

      if (response.data.status === "success") {
        setUserData((prev) => ({ ...prev, ...updatedData }));
        toast.success("Profile updated successfully");
        return true;
      }
      return false;
    } catch (err: any) {
      toast.error("Failed to update profile", {
        description: err.response?.data?.message || "Please try again",
      });
      return false;
    }
  };

  return {
    userData,
    loading,
    error,
    handleEditProfile,
  };
};
