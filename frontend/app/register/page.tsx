"use client";

import { RegisterForm } from "./components/RegisterForm";
import { useRegister } from "./hooks/useRegister";
import { motion } from "framer-motion";

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
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-amber-50 relative overflow-hidden py-6">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-5" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-200 rounded-full blur-3xl opacity-20" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-orange-200 rounded-full blur-3xl opacity-20" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[640px] px-4 relative"
      >
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
      </motion.div>
    </main>
  );
}
