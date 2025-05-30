"use client";

import { LoginForm } from "./components/LoginForm";
import { useLogin } from "./hooks/useLogin";
import { motion } from "framer-motion";

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
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-amber-50 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0  opacity-5" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-200 rounded-full blur-3xl opacity-20 hidden md:block" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-orange-200 rounded-full blur-3xl opacity-20 hidden md:block" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row items-center gap-8 w-full md:max-w-6xl px-4 relative"
      >
        {/* Image Section - Hidden on Mobile */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="w-full md:w-1/2 hidden md:block"
        >
          <img
            src="/login.png"
            alt="Login Illustration"
            className="w-full max-w-lg mx-auto drop-shadow-xl"
          />
        </motion.div>

        {/* Form Section - Full Width on Mobile */}
        <motion.div
          initial={{ opacity: 0, x: 0, y: 20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="w-full md:w-1/2 flex justify-center px-4 sm:px-0"
        >
          <LoginForm
            formData={formData}
            error={error}
            loading={loading}
            showPassword={showPassword}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            togglePasswordVisibility={togglePasswordVisibility}
          />
        </motion.div>
      </motion.div>
    </main>
  );
}
