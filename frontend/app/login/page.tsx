"use client";

import { LoginForm } from "./components/LoginForm";
import { useLogin } from "./hooks/useLogin";

export default function Login() {
  const {
    formData,
    error,
    loading,
    showPassword,
    handleInputChange,
    handleSubmit,
    togglePasswordVisibility,
  } = useLogin();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-50 to-gray-100 p-4">
      <LoginForm
        formData={formData}
        error={error}
        loading={loading}
        showPassword={showPassword}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        togglePasswordVisibility={togglePasswordVisibility}
      />
    </div>
  );
}
