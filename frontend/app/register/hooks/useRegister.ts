"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";
import { getCsrfToken } from "@/lib/axios";
import { RegisterFormData } from "../types";

export function useRegister() {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    username: "",
    email: "",
    no_hp: "",
    password: "",
    password_confirmation: "",
    tanggal_lahir: "", 
    agreement: false,
  });
  
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
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

  const toggleConfirmPasswordVisibility = (): void => {
    setShowConfirmPassword((prev) => !prev);
  };

  const handleCheckboxChange = (checked: boolean): void => {
    setFormData((prev) => ({
      ...prev,
      agreement: checked,
    }));
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (loading) return;
    setLoading(true);
    setError("");

    if (!formData.agreement) {
      setError("You must agree to the terms and conditions");
      setLoading(false);
      return;
    }

    try {
      // First, get the CSRF cookie
      await getCsrfToken();

      // Then make the registration request
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/register`,
        {
          name: formData.name,
          username: formData.username,
          email: formData.email,
          no_hp: formData.no_hp,
          password: formData.password,
          password_confirmation: formData.password_confirmation,
          tanggal_lahir: formData.tanggal_lahir, 
        },
        {
          withCredentials: true, 
        }
      );

      // On success, redirect to login page
      if (response.data.status === "success") {
        router.push("/login?registered=true");
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(
        err.response?.data?.message ||
          (err.response?.data?.errors
            ? Object.values(err.response.data.errors).flat()[0]
            : "Failed to connect to server")
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    error,
    loading,
    showPassword,
    showConfirmPassword,
    handleInputChange,
    handleSubmit,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    handleCheckboxChange,
  };
}
