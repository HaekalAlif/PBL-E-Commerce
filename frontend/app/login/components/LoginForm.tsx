"use client";

import Link from "next/link";
import {
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaRecycle,
  FaLeaf,
  FaHandHoldingHeart,
} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { LoginFormData } from "../types";

interface LoginFormProps {
  formData: LoginFormData;
  error: string;
  loading: boolean;
  showPassword: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  togglePasswordVisibility: () => void;
}

export function LoginForm({
  formData,
  error,
  loading,
  showPassword,
  handleInputChange,
  handleSubmit,
  togglePasswordVisibility,
}: LoginFormProps) {
  const handleGoogleLogin = () => {
    toast.info("Fitur login dengan Google akan segera hadir!", {
      description: "Mohon tunggu pembaruan selanjutnya.",
      duration: 4000,
    });
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-6 w-full max-w-[min(400px,100%-32px)] border border-amber-100 relative">
      {/* Decorative Elements - Adjusted for Mobile */}
      <div className="absolute -top-6 -right-6 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center transform rotate-12">
        <FaRecycle className="w-6 h-6 sm:w-7 sm:h-7 text-amber-500/60" />
      </div>
      <div className="absolute -bottom-4 -left-4 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center transform -rotate-12">
        <FaLeaf className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500/60" />
      </div>
      <div className="absolute top-1/3 -right-4 w-8 h-8 rounded-full bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
        <FaHandHoldingHeart className="w-4 h-4 text-amber-500/60" />
      </div>

      {/* Decorative Pattern */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl">
        <div className="absolute inset-0 opacity-[0.03]" />
      </div>

      {/* Main content */}
      <div className="relative">
        <div className="text-center space-y-1 sm:space-y-1.5 mb-4 sm:mb-6">
          <h1 className="text-[24px] sm:text-[28px] font-extrabold bg-gradient-to-r from-[#F79E0E] to-[#FFB648] bg-clip-text text-transparent tracking-tight">
            Selamat Datang
          </h1>
          <p className="text-gray-500 text-[13px] sm:text-[14px] font-medium">
            Masuk untuk melanjutkan ke akun Anda
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded-r-lg animate-shake">
            <p className="font-semibold">Error</p>
            <p className="text-[13px]">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="space-y-1.5">
            <label className="text-[13px] uppercase tracking-wider font-bold text-gray-700 block">
              Email
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-amber-500">
                <FaUser className="w-4 h-4" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl text-gray-700 text-[14px] font-medium
                         border-2 border-gray-100 focus:border-amber-500/50
                         bg-white/50 backdrop-blur-sm shadow-sm
                         focus:ring-4 focus:ring-amber-500/10 transition-all duration-200"
                placeholder="nama@email.com"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] uppercase tracking-wider font-bold text-gray-700">
              Password
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-amber-500">
                <FaLock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-11 pr-12 py-2.5 rounded-xl text-gray-700 text-[14px] font-medium
                         border-2 border-gray-100 focus:border-amber-500/50
                         bg-white/50 backdrop-blur-sm shadow-sm
                         focus:ring-4 focus:ring-amber-500/10 transition-all duration-200"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 px-4 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <FaEyeSlash className="w-4 h-4" />
                ) : (
                  <FaEye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                className="w-4 h-4 rounded border-gray-300 text-amber-500 
                       focus:ring-4 focus:ring-amber-500/20 transition-colors"
              />
              <span className="text-[13px] font-medium text-gray-600">
                Ingat saya
              </span>
            </label>

            <Link
              href="/forgot-password"
              className="text-[13px] font-semibold text-amber-600 hover:text-amber-700 transition-colors"
            >
              Lupa password?
            </Link>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            className="w-full py-2 sm:py-2.5 px-4 rounded-xl font-bold text-[14px] text-white
                     bg-gradient-to-r from-[#F79E0E] to-[#FFB648] 
                     hover:from-[#E08D0D] hover:to-[#FFA635]
                     focus:ring-4 focus:ring-amber-500/30
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transform transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/25
                     relative overflow-hidden"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <span className="relative z-10">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Sedang Masuk...
                </span>
              ) : (
                "Masuk"
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-400 opacity-0 hover:opacity-100 transition-opacity duration-300" />
          </motion.button>

          <div className="relative my-3 sm:my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500 text-[13px] font-medium">
                Atau masuk dengan
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-2 sm:py-2.5 px-4 rounded-xl font-semibold text-[13px] sm:text-[14px] text-gray-700
                     border-2 border-gray-100 bg-white
                     hover:bg-gray-50 hover:border-gray-200
                     focus:ring-4 focus:ring-gray-100
                     transition-all duration-200
                     flex items-center justify-center gap-2"
          >
            <FcGoogle className="w-5 h-5" />
            Google
          </button>

          <div className="text-center pt-2 sm:pt-3 border-t border-gray-100">
            <p className="text-[13px] text-gray-500 font-medium">
              Belum punya akun?{" "}
              <motion.span whileHover={{ scale: 1.05 }}>
                <Link
                  href="/register"
                  className="font-bold text-[#F79E0E] hover:text-[#E08D0D] transition-colors"
                >
                  Daftar Sekarang
                </Link>
              </motion.span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
