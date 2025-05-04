"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";
import { getCsrfToken } from "@/lib/axios";
import Cookies from "js-cookie";
import { LoginFormData } from "../types";

export function useLogin() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const togglePasswordVisibility = (): void => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (loading) return; // Prevent double submission
    setLoading(true);
    setError("");

    try {
      // First, ensure we have a fresh CSRF token (but don't log this as it creates noise)
      await getCsrfToken();

      // Then make the login request without additional CSRF checks
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/login`,
        {
          email: formData.email,
          password: formData.password,
          remember: formData.rememberMe,
        },
        {
          withCredentials: true, // Ensure cookies are sent with the request
        }
      );

      // Access user data from the response
      const { role } = response.data.user;

      // Access role_name from the user object or use fallback
      let roleName = response.data.user.role_name;

      if (!roleName) {
        const roleMap: { [key: number]: string } = {
          0: "superadmin",
          1: "admin",
          2: "user",
        };
        roleName = roleMap[role] || "unknown";
      }

      // Set cookies with proper configuration including expiration
      // Add 1 hour expiry for auth cookies
      const expiryTime = formData.rememberMe ? 7 : 1; // 7 days if remember me, 1 hour if not

      const cookieOptions = {
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict" as const,
        expires: formData.rememberMe ? 7 : 1 / 24, // 7 days or 1 hour (1/24 of a day)
      };

      // Store session and role info in cookies with expiry
      Cookies.set("auth_session", "authenticated", cookieOptions);
      Cookies.set("user_role", role.toString(), cookieOptions);
      Cookies.set("role_name", roleName, cookieOptions);

      // Redirect based on role
      setTimeout(() => {
        if (role === 0) {
          router.push("/superadmin");
        } else if (role === 1) {
          router.push("/admin");
        } else {
          router.push("/");
        }
      }, 300);
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    error,
    loading,
    showPassword,
    handleInputChange,
    handleSubmit,
    togglePasswordVisibility,
  };
}
