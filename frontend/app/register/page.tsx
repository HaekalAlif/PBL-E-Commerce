"use client";

import { RegisterForm } from "./components/RegisterForm";
import { useRegister } from "./hooks/useRegister";

export default function Register() {
  const {
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
  } = useRegister();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-50 to-gray-100 p-4">
      <div className="max-w-md w-full">
        <RegisterForm
          formData={formData}
          error={error}
          loading={loading}
          showPassword={showPassword}
          showConfirmPassword={showConfirmPassword}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          togglePasswordVisibility={togglePasswordVisibility}
          toggleConfirmPasswordVisibility={toggleConfirmPasswordVisibility}
          handleCheckboxChange={handleCheckboxChange}
        />
      </div>
    </div>
  );
}
