"use client";

import { Toaster as SonnerToaster } from "sonner";
import { cn } from "@/lib/utils";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        className: "bg-amber-50 border-[#F79E0E] text-[#F79E0E] font-medium",
        style: {
          background: "#FFF8EF", // light amber bg
          color: "#F79E0E", // orange text
          border: "1px solid #F79E0E", // orange border
          boxShadow: "0 2px 8px rgba(247, 158, 14, 0.08)",
        },
      }}
      richColors={false}
    />
  );
}
