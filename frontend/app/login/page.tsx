"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "@/lib/axios";
import { getCsrfToken } from "@/lib/axios";
import { FaUser, FaLock } from "react-icons/fa";
import Cookies from "js-cookie";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // First, get the CSRF cookie using our helper function
      console.log("Getting fresh CSRF token before login");
      await getCsrfToken();

      // Check for XSRF-TOKEN cookie
      const xsrfToken = document.cookie
        .split(";")
        .find((cookie) => cookie.trim().startsWith("XSRF-TOKEN="));

      console.log("XSRF-TOKEN cookie present:", !!xsrfToken);

      // Then make the login request
      console.log("Attempting login...");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/login`,
        {
          email,
          password,
          remember: rememberMe,
        }
      );

      // Log the full response to debug
      console.log("Login response:", response.data);

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

      // Set cookies with proper configuration - set path to root
      const cookieOptions = {
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict" as const,
      };

      // Store session and role info in cookies
      Cookies.set("auth_session", "authenticated", cookieOptions);
      Cookies.set("user_role", role.toString(), cookieOptions);
      Cookies.set("role_name", roleName, cookieOptions);

      console.log("Stored in cookies:", {
        auth_session: "authenticated",
        user_role: role.toString(),
        role_name: roleName,
      });

      // Redirect after a short delay to ensure cookies are set
      setTimeout(() => {
        if (role === 0) {
          router.push("/superadmin");
        } else if (role === 1) {
          router.push("/admin");
        } else {
          router.push("/user");
        }
      }, 300);
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Failed to connect to server");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-600 mb-8">
            Sign in to continue to your account
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-700"
              >
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <Link
                href="/forgot-password"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition duration-150"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Register now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
