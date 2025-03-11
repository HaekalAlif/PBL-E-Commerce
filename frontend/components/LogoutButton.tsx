"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth";

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
      // Use direct fetch request to clear HTTP-only cookies first
      try {
        const backendUrl =
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
        // Fix API path - ensure we're calling the correct endpoint
        await fetch(`${backendUrl}/api/clear-session-cookies`, {
          method: "GET",
          credentials: "include", // Include cookies in the request
        });
        console.log("Server-side cookie clearing initiated");
      } catch (clearError) {
        console.error("Error clearing server-side cookies:", clearError);
      }

      // Then use our comprehensive logout utility
      await logout();

      // Redirect to login page
      setTimeout(() => {
        // Force a complete page refresh to ensure all state is reset
        window.location.href = "/login";
      }, 500);
    } catch (error) {
      console.error("Logout failed with error:", error);

      // Still redirect to login even if logout API fails
      window.location.href = "/login";
    } finally {
      setIsLoggingOut(false);
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
