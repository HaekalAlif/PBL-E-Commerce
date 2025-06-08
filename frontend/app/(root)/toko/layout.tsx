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
  BarChart3,
} from "lucide-react";
import ProfileCardStore from "@/components/common/profile-card-store";
import { useStoreProfile } from "./profile/hooks/useStoreProfile";

const sidebarLinks = [
  {
    label: "Dashboard Toko",
    icon: BarChart3,
    href: "/toko/dashboard",
    requiresStore: false,
  },
  {
    label: "Informasi Toko",
    icon: Store,
    href: "/toko/profile",
    requiresStore: false,
  },
  {
    label: "Produk",
    icon: Package,
    requiresStore: true,
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
    requiresStore: true,
  },
  {
    label: "Keuangan",
    icon: Wallet,
    href: "/toko/keuangan",
    requiresStore: true,
  },
];

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { profile, loading } = useStoreProfile();

  // Filter sidebar links based on store availability
  const filteredSidebarLinks = sidebarLinks.filter((item) => {
    if (loading) return true; // Show all items while loading
    if (!item.requiresStore) return true; // Always show non-store-dependent items
    return profile !== null; // Only show store-dependent items if user has a store
  });

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
                  <nav className="flex-grow space-y-1">
                    {filteredSidebarLinks.map((item, index) => (
                      <div key={index} className="mb-2">
                        {item.children ? (
                          <>
                            <div className="flex items-center gap-3 px-3 py-2 text-gray-900">
                              <item.icon className="w-5 h-5 text-[#F79E0E]" />
                              <span className="text-sm font-medium">
                                {item.label}
                              </span>
                              {item.requiresStore && !profile && !loading && (
                                <span className="ml-auto text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                                  Perlu Toko
                                </span>
                              )}
                            </div>
                            <div className="mt-1 ml-7 space-y-1 border-l-2 border-orange-100 pl-4">
                              {item.children.map((child) => {
                                const isActive = pathname === child.href;
                                const isDisabled =
                                  item.requiresStore && !profile && !loading;

                                if (isDisabled) {
                                  return (
                                    <div
                                      key={child.href}
                                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 cursor-not-allowed"
                                    >
                                      <child.icon className="w-4 h-4 text-gray-300" />
                                      <span>{child.label}</span>
                                    </div>
                                  );
                                }

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
                          <>
                            {item.requiresStore && !profile && !loading ? (
                              <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 cursor-not-allowed">
                                <item.icon className="w-5 h-5 text-gray-300" />
                                <span className="text-sm">{item.label}</span>
                                <span className="ml-auto text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                                  Perlu Toko
                                </span>
                              </div>
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
                          </>
                        )}
                      </div>
                    ))}
                  </nav>

                  {/* Store Status Indicator */}
                  {!loading && (
                    <div className="mt-auto p-4 border-t border-gray-100 bg-gray-50/50">
                      {profile ? (
                        <div className="flex items-center gap-2 text-green-600 text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="font-medium">Toko Aktif</span>
                        </div>
                      ) : (
                        <div className="text-center space-y-3">
                          <div className="flex items-center justify-center gap-2 text-amber-600 text-sm">
                            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                            <span className="font-medium">Belum Ada Toko</span>
                          </div>
                          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                            <p className="text-xs text-amber-700 mb-2 leading-relaxed">
                              Buat toko untuk mengakses semua fitur penjualan
                            </p>
                            <Link
                              href="/toko/create"
                              className="inline-block w-full text-center text-xs bg-gradient-to-r from-[#F79E0E] to-[#FFB648] hover:from-[#E8890B] hover:to-[#F0A537] text-white font-medium px-3 py-2 rounded-md transition-all duration-200 shadow-sm"
                            >
                              Buat Toko Sekarang
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
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
