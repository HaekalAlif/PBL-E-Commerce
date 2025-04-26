"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth";
import { getCsrfToken } from "@/lib/axios";

interface LogoutButtonProps {
  className?: string;
}

export default function LogoutButton({ className }: LogoutButtonProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    console.log("Starting logout process...");

    try {
      // Execute the logout function
      await logout();
      
      console.log("Logout completed, redirecting...");
      
      // Redirect to login page after a short delay
      setTimeout(() => {
        // Force a complete page refresh to ensure all state is reset
        window.location.href = "/";
      }, 300);
    } catch (error) {
      console.error("Logout failed with error:", error);

      // Still redirect to login even if logout API fails
      window.location.href = "/";
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-70 ${className}`}
    >
      {isLoggingOut ? "Logging out..." : "Logout"}
    </button>
  );
}
