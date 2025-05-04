"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaRecycle,
  FaLeaf,
} from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RegisterFormData } from "../types";

interface RegisterFormProps {
  formData: RegisterFormData;
  error: string;
  loading: boolean;
  showPassword: boolean;
  showConfirmPassword: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  togglePasswordVisibility: () => void;
  toggleConfirmPasswordVisibility: () => void;
  handleCheckboxChange: (checked: boolean) => void;
}

export function RegisterForm({
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
}: RegisterFormProps) {
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-6 border border-amber-100 relative">
      {/* Decorative Elements */}
      <div className="absolute -top-6 -right-6 w-12 h-12 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center transform rotate-12">
        <FaRecycle className="w-6 h-6 text-amber-500/60" />
      </div>

      <div className="relative">
        {/* Header with refined typography */}
        <div className="text-center space-y-1 mb-6">
          <h1 className="text-[26px] font-bold bg-gradient-to-r from-[#F79E0E] to-[#FFB648] bg-clip-text text-transparent tracking-tight">
            Daftar Akun Baru
          </h1>
          <p className="text-[15px] text-gray-600 font-normal">
            Bergabung dan mulai transaksi di marketplace barang bekas
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded-r-lg animate-shake">
            <p className="font-semibold">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Personal Information */}
          <div className="space-y-4">
            {/* Name & Username Fields - Single column on mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[13px] font-medium text-gray-700 block mb-1.5">
                  Nama Lengkap<span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl text-[14px] font-normal
                           border-2 border-gray-100 focus:border-amber-500/50
                           bg-white/50 focus:ring-2 focus:ring-amber-500/10
                           placeholder:text-gray-400 transition-all duration-200"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="text-[13px] font-medium text-gray-700 block mb-1.5">
                  Username<span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl text-[14px] font-normal
                           border-2 border-gray-100 focus:border-amber-500/50
                           bg-white/50 focus:ring-2 focus:ring-amber-500/10
                           placeholder:text-gray-400 transition-all duration-200"
                  placeholder="********"
                  required
                />
              </div>
            </div>

            {/* Contact Fields - Single column on mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[13px] font-medium text-gray-700 block mb-1.5">
                  Email<span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-lg text-[14px] font-normal
                           border-2 border-gray-100 focus:border-amber-500/50
                           bg-white/50 focus:ring-2 focus:ring-amber-500/10
                           placeholder:text-gray-400 transition-all duration-200"
                  placeholder="email@example.com"
                  required
                />
              </div>
              <div>
                <label className="text-[13px] font-medium text-gray-700 block mb-1.5">
                  No. HP<span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  name="no_hp"
                  type="tel"
                  value={formData.no_hp}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-lg text-[14px] font-normal
                           border-2 border-gray-100 focus:border-amber-500/50
                           bg-white/50 focus:ring-2 focus:ring-amber-500/10
                           placeholder:text-gray-400 transition-all duration-200"
                  placeholder="08123456789"
                  required
                />
              </div>
            </div>

            {/* Birth Date - Full width */}
            <div>
              <label className="text-[13px] font-medium text-gray-700 block mb-1.5">
                Tanggal Lahir<span className="text-red-500 ml-1">*</span>
              </label>
              <input
                name="tanggal_lahir"
                type="date"
                value={formData.tanggal_lahir}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-lg text-[14px] font-normal
                         border-2 border-gray-100 focus:border-amber-500/50
                         bg-white/50 focus:ring-2 focus:ring-amber-500/10
                         text-gray-700 cursor-pointer transition-all duration-200
                         [&::-webkit-calendar-picker-indicator]:opacity-70
                         [&::-webkit-calendar-picker-indicator]:hover:opacity-100"
                required
              />
            </div>

            {/* Password Fields - Single column on mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1.5">
                  Password<span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-amber-500">
                    <FaLock className="w-4 h-4" />
                  </div>
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-11 pr-10 py-2 rounded-lg text-sm font-small
                             border-2 border-gray-100 focus:border-amber-500/50
                             bg-white/50 backdrop-blur-sm"
                    placeholder="Masukkan password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={togglePasswordVisibility}
                    tabIndex={-1}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <FaEyeSlash className="w-4 h-4 text-gray-400 hover:text-amber-500" />
                    ) : (
                      <FaEye className="w-4 h-4 text-gray-400 hover:text-amber-500" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1.5">
                  Konfirmasi Password
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-amber-500">
                    <FaLock className="w-4 h-4" />
                  </div>
                  <Input
                    name="password_confirmation"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.password_confirmation}
                    onChange={handleInputChange}
                    className="pl-11 pr-8 py-2 rounded-lg text-sm font-small
                             border-2 border-gray-100 focus:border-amber-500/50
                             bg-white/50 backdrop-blur-sm"
                    placeholder="Masukkan konfirmasi password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={toggleConfirmPasswordVisibility}
                    tabIndex={-1}
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash className="w-4 h-4 text-gray-400 hover:text-amber-500" />
                    ) : (
                      <FaEye className="w-4 h-4 text-gray-400 hover:text-amber-500" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Agreement & Submit Button - Already full width */}
          <div className="space-y-4 pt-2">
            <label className="flex items-start gap-2 cursor-pointer">
              <Checkbox
                id="agreement"
                name="agreement"
                checked={formData.agreement}
                onCheckedChange={handleCheckboxChange}
                className="mt-1 text-amber-500 rounded-[4px]"
              />
              <span className="text-[13px] leading-relaxed text-gray-600">
                Dengan mendaftar, saya menyetujui{" "}
                <a
                  href="#"
                  className="font-medium text-amber-600 hover:text-amber-700 underline decoration-amber-600/30 hover:decoration-amber-600"
                >
                  Syarat dan Ketentuan
                </a>{" "}
                serta{" "}
                <a
                  href="#"
                  className="font-medium text-amber-600 hover:text-amber-700 underline decoration-amber-600/30 hover:decoration-amber-600"
                >
                  Kebijakan Privasi
                </a>
              </span>
            </label>

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-[15px] text-white
                     bg-gradient-to-r from-[#F79E0E] to-[#FFB648] 
                     hover:from-[#E08D0D] hover:to-[#FFA635]
                     focus:ring-4 focus:ring-amber-500/30
                     disabled:opacity-50 shadow-sm hover:shadow-md
                     transition-all duration-300"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {loading ? "Mendaftar..." : "Daftar Sekarang"}
            </motion.button>

            <p className="text-center mt-4 text-[14px] text-gray-500">
              Sudah punya akun?{" "}
              <Link
                href="/login"
                className="font-medium text-amber-600 hover:text-amber-700"
              >
                Masuk di sini
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
