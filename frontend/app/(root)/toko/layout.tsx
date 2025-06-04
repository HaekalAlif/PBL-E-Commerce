"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Store,
  Package,
  ShoppingBag,
  Wallet,
  LogOut,
  ChevronRight,
} from "lucide-react";
import ProfileCardStore from "@/components/common/profile-card-store";

const sidebarLinks = [
  {
    label: "Informasi Toko",
    icon: Store,
    href: "/toko/profile",
  },
  {
    label: "Produk",
    icon: Package,
    children: [
      {
        label: "Semua Produk",
        href: "/toko/produk",
        icon: Package,
      },
      {
        label: "Tambah Produk",
        href: "/toko/produk/create",
        icon: Package,
      },
    ],
  },
  {
    label: "Pesanan",
    icon: ShoppingBag,
    href: "/toko/pesanan",
  },
  {
    label: "Keuangan",
    icon: Wallet,
    href: "/toko/keuangan",
  },
];

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-[100dvh] flex flex-col bg-gray-50">
      <div className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto h-full">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm px-2">
            <ol className="flex items-center space-x-2">
              <li>
                <Link href="/" className="text-gray-500 hover:text-[#F79E0E]">
                  Beranda
                </Link>
              </li>
              <li className="text-gray-400">/</li>
              <li className="text-[#F79E0E] font-medium">Manajemen Toko</li>
            </ol>
          </nav>

          <div className="flex flex-col md:flex-row gap-6 h-[calc(100dvh-12rem)]">
            {/* Sidebar Section */}
            <div className="w-full md:w-64 flex flex-col gap-4">
              {/* Profile Card */}
              <div className="flex-shrink-0">
                <ProfileCardStore />
              </div>

              {/* Navigation Menu */}
              <motion.nav
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden flex-grow md:overflow-y-auto flex flex-col"
              >
                {/* Menu Header */}
                <div className="p-4 bg-gradient-to-r from-[#F79E0E] to-[#FFB648] text-white">
                  <h2 className="text-lg font-semibold">Menu Toko</h2>
                </div>

                {/* Menu Items Container */}
                <div className="flex flex-col h-full">
                  {/* Navigation Links */}
                  <nav className="flex-grow p-3 space-y-1">
                    {sidebarLinks.map((item, index) => (
                      <div key={index} className="mb-2">
                        {item.children ? (
                          <>
                            <div className="flex items-center gap-3 px-3 py-2 text-gray-900">
                              <item.icon className="w-5 h-5 text-[#F79E0E]" />
                              <span className="text-sm font-medium">
                                {item.label}
                              </span>
                            </div>
                            <div className="mt-1 ml-7 space-y-1 border-l-2 border-orange-100 pl-4">
                              {item.children.map((child) => {
                                const isActive = pathname === child.href;
                                return (
                                  <Link
                                    key={child.href}
                                    href={child.href}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-sm ${
                                      isActive
                                        ? "bg-orange-50 text-[#F79E0E] font-medium"
                                        : "text-gray-600 hover:bg-gray-50/80 hover:text-gray-900"
                                    }`}
                                  >
                                    <child.icon
                                      className={`w-4 h-4 ${
                                        isActive
                                          ? "text-[#F79E0E]"
                                          : "text-gray-400"
                                      }`}
                                    />
                                    <span>{child.label}</span>
                                    {isActive && (
                                      <ChevronRight className="w-4 h-4 text-[#F79E0E] ml-auto" />
                                    )}
                                  </Link>
                                );
                              })}
                            </div>
                          </>
                        ) : (
                          <Link
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                              pathname === item.href
                                ? "bg-orange-50 text-[#F79E0E] font-medium"
                                : "text-gray-600 hover:bg-gray-50/80 hover:text-gray-900"
                            }`}
                          >
                            <item.icon className="w-5 h-5 text-[#F79E0E]" />
                            <span className="text-sm">{item.label}</span>
                            {pathname === item.href && (
                              <ChevronRight className="w-4 h-4 text-[#F79E0E] ml-auto" />
                            )}
                          </Link>
                        )}
                      </div>
                    ))}
                  </nav>
                </div>
              </motion.nav>
            </div>

            {/* Main Content */}
            <motion.main
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="flex-grow bg-white rounded-xl shadow-sm border border-gray-100 overflow-y-auto"
            >
              <div className="p-6">{children}</div>
            </motion.main>
          </div>
        </div>
      </div>
    </div>
  );
}
