"use client";

import React, { useState } from "react";
import Link from "next/link";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  const FormInput = ({
    label,
    type = "text",
    placeholder,
    showPasswordToggle = false,
    required = false,
  }: {
    label?: string;
    type?: "text" | "password" | "email";
    placeholder: string;
    showPasswordToggle?: boolean;
    required?: boolean;
  }) => {
    return (
      <div className="w-full mb-6">
        {label && (
          <label className="block mb-3 font-bold text-black">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <input
            type={showPasswordToggle ? (showPassword ? "text" : "password") : type}
            placeholder={placeholder}
            className="w-full px-4 py-3 rounded-md border-orange-200 border-[3px] text-neutral-800 bg-blue-50 outline-none"
            required={required}
          />
          {showPasswordToggle && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>
    );
  };

  const Button = ({
    children,
    variant = "primary",
    className = "",
    type = "button",
  }: {
    children: React.ReactNode;
    variant?: "primary" | "secondary";
    className?: string;
    type?: "button" | "submit" | "reset";
  }) => {
    const styles = {
      primary: "bg-orange-500 text-white hover:bg-orange-600",
      secondary: "bg-transparent text-orange-500 hover:text-orange-600",
    };

    return (
      <button
        type={type}
        className={`px-4 py-3 rounded-md font-semibold transition-colors ${styles[variant]} ${className}`}
      >
        {children}
      </button>
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Login button clicked (no backend)");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#FFF7EA]">
      <div className="flex flex-col md:flex-row items-center gap-8 max-w-6xl w-full px-4">
        <div className="w-full md:w-1/2">
          <img src="frontend/public/page1.png" className="w-full"  />
        </div>

        <div className="w-full md:w-1/2 flex justify-center">
          <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Masuk</h1>

            <form onSubmit={handleSubmit}>
              <FormInput
                label="Email"
                type="email"
                placeholder="Masukkan email"
                required
              />

              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <label className="font-bold text-black">Password</label>
                  <Link href="/forgot-password" className="text-orange-500 font-bold">
                    Lupa Password?
                  </Link>

                </div>

                <FormInput
                  type="password"
                  placeholder="Masukkan Password"
                  showPasswordToggle
                  required
                />
              </div>

              <Button type="submit" className="w-full mb-6">
                Masuk
              </Button>

              <div className="flex justify-center items-center gap-2">
                <p className="text-gray-400">Belum punya akun?</p>
                <Link href="/register" className="text-orange-500 font-bold">
                  Daftar
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;

