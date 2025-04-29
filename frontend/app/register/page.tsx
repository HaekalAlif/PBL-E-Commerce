"use client";

import { RegisterForm } from "./components/RegistrationForm";
import { useRegister } from "./hooks/useRegister";
import Navigation from "@/components/layout/nav";
import Footer from "@/components/layout/footer";  

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
    <>
      <Navigation />
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
      <Footer />
    </>
  );
}

