"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Store,
  Tags,
  Package,
  ClipboardList,
  CreditCard,
  Wallet,
  LineChart,
  Activity,
  BarChart,
  Truck,
  ShieldCheck,
  Megaphone,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  Home,
  Menu,
  ChevronDown,
  X,
} from "lucide-react";
import ProfileCardSuperadmin from "@/components/common/profile-card-superadmin";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Logout from "@/components/auth/LogoutButton";

const sidebarLinks = [
  {
    label: "Overview",
    icon: LayoutDashboard,
    href: "/superadmin",
  },
  {
    label: "Management",
    icon: Settings,
    children: [
      { label: "Users", href: "/superadmin/user", icon: Users },
      { label: "Stores", href: "/superadmin/toko", icon: Store },
      { label: "Categories", href: "/superadmin/kategori", icon: Tags },
      { label: "Products", href: "/superadmin/barang", icon: Package },
    ],
  },
  {
    label: "Transaction",
    icon: ClipboardList,
    children: [
      { label: "Orders", href: "/superadmin/pesanan", icon: ClipboardList },
      { label: "Payments", href: "/superadmin/pembayaran", icon: CreditCard },
      {
        label: "Withdrawals",
        href: "/superadmin/pencairan-dana",
        icon: Wallet,
      },
      { label: "Balances", href: "/transaction/balances", icon: LineChart },
      { label: "Financial Audit", href: "/transaction/audit", icon: Activity },
    ],
  },
  {
    label: "Operations",
    icon: BarChart,
    children: [
      {
        label: "Transactions",
        href: "/operations/transactions",
        icon: CreditCard,
      },
      { label: "Escrow", href: "/operations/escrow", icon: ShieldCheck },
      { label: "Shipping", href: "/operations/shipping", icon: Truck },
      { label: "Complaints", href: "/operations/complaints", icon: Megaphone },
      {
        label: "Notifications",
        href: "/operations/notifications",
        icon: Bell,
      },
    ],
  },
];

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isUserPath = pathname?.startsWith("/user") ?? false;
  const [openDropdowns, setOpenDropdowns] = useState<string[]>([]);

  const toggleDropdown = (label: string) => {
    setOpenDropdowns((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  // Get current page name for breadcrumb
  const lastPath = pathname?.split("/").pop();
  const currentPage =
    lastPath && lastPath.length > 0
      ? lastPath.charAt(0).toUpperCase() + lastPath.slice(1)
      : "Dashboard";

  const menuItems = [
    {
      title: "Dashboard",
      href: "/superadmin/dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      title: "User Management",
      href: "/superadmin/user",
      icon: <Users className="h-4 w-4" />,
    },
    {
      title: "Store Management",
      href: "/superadmin/toko",
      icon: <Store className="h-4 w-4" />,
    },
    {
      title: "Category Management",
      href: "/superadmin/kategori",
      icon: <Tags className="h-4 w-4" />,
    },
    {
      title: "Product Management",
      href: "/superadmin/barang",
      icon: <Package className="h-4 w-4" />,
    },
    {
      title: "Order Management",
      href: "/superadmin/pesanan",
      icon: <ClipboardList className="h-4 w-4" />,
    },
    {
      title: "Payment Management",
      href: "/superadmin/pembayaran",
      icon: <CreditCard className="h-4 w-4" />,
    },
    {
      title: "Withdrawal Management",
      href: "/superadmin/pencairan-dana",
      icon: <Wallet className="h-4 w-4" />,
    },
    {
      title: "Transaction Balances",
      href: "/transaction/balances",
      icon: <LineChart className="h-4 w-4" />,
    },
    {
      title: "Financial Audit",
      href: "/transaction/audit",
      icon: <Activity className="h-4 w-4" />,
    },
    {
      title: "Escrow Management",
      href: "/operations/escrow",
      icon: <ShieldCheck className="h-4 w-4" />,
    },
    {
      title: "Shipping Management",
      href: "/operations/shipping",
      icon: <Truck className="h-4 w-4" />,
    },
    {
      title: "Complaint Management",
      href: "/operations/complaints",
      icon: <Megaphone className="h-4 w-4" />,
    },
    {
      title: "Notification Management",
      href: "/operations/notifications",
      icon: <Bell className="h-4 w-4" />,
    },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-72 bg-white border-r border-gray-200 fixed left-0 top-0 z-40 h-full">
        <div className="flex flex-col h-full">
          {/* Profile Section */}
          <div className="p-4 border-b border-gray-200 bg-gradient-to-b from-white to-orange-50/30">
            <ProfileCardSuperadmin />
          </div>

          {/* Scrollable Menu Items */}
          <motion.nav
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-orange-200 scrollbar-track-transparent"
          >
            <div className="p-4 space-y-2">
              {sidebarLinks.map((item, index) => (
                <div key={index} className="mb-2 font-medium">
                  {item.children ? (
                    <div>
                      <button
                        onClick={() => toggleDropdown(item.label)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200
                          ${
                            openDropdowns.includes(item.label)
                              ? "bg-orange-50 text-[#F79E0E]"
                              : "text-gray-700 hover:bg-orange-50/50 hover:text-[#F79E0E]"
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon
                            className={`w-5 h-5 ${
                              openDropdowns.includes(item.label)
                                ? "text-[#F79E0E]"
                                : "text-[#F79E0E]"
                            }`}
                          />
                          <span className="text-sm font-medium">
                            {item.label}
                          </span>
                        </div>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 
                            ${
                              openDropdowns.includes(item.label)
                                ? "rotate-180 text-[#F79E0E]"
                                : "text-[#F79E0E]"
                            }`}
                        />
                      </button>

                      {/* Dropdown Content */}
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{
                          height: openDropdowns.includes(item.label)
                            ? "auto"
                            : 0,
                          opacity: openDropdowns.includes(item.label) ? 1 : 0,
                        }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-1 ml-7 space-y-1 border-l-2 border-orange-200 pl-4">
                          {item.children.map((child) => {
                            const isActive = pathname === child.href;
                            return (
                              <Link
                                key={child.href}
                                href={child.href}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-sm
                                  ${
                                    isActive
                                      ? "bg-orange-50 text-[#F79E0E] font-medium"
                                      : "text-gray-600 hover:bg-orange-50/50 hover:text-[#F79E0E]"
                                  }`}
                              >
                                <child.icon
                                  className={`w-4 h-4 ${
                                    isActive
                                      ? "text-[#F79E0E]"
                                      : "text-[#F79E0E]"
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
                      </motion.div>
                    </div>
                  ) : (
                    <Link
                      href={item.href!}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                        ${
                          pathname === item.href
                            ? "bg-orange-50 text-[#F79E0E] font-medium"
                            : "text-gray-700 hover:bg-orange-50/50 hover:text-[#F79E0E]"
                        }`}
                    >
                      <item.icon className="w-5 h-5 text-[#F79E0E]" />
                      <span className="text-sm">{item.label}</span>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </motion.nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-200 bg-gradient-to-t from-white to-orange-50/30">
          <Logout />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-72">
        {/* Breadcrumb */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-20 h-12 pt-4">
          <div className="mx-auto px-4 sm:px-6">
            <div className="-mt-1.5">
              {!isUserPath && (
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink
                        href="/superadmin"
                        className="flex items-center gap-2 text-[#F79E0E] hover:text-[#FFB648] transition-colors duration-200 "
                      >
                        <div className="p-1 bg-orange-100 rounded-lg">
                          <Home className="h-4 w-4" />
                        </div>
                        <span className="font-medium">Beranda</span>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="text-black" />
                    <BreadcrumbItem>
                      <BreadcrumbLink
                        className="flex items-center text-[#F79E0E] hover:text-[#FFB648] transition-colors duration-200 font-medium"
                        href="/superadmin"
                      >
                        Superadmin
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    {pathname !== "/superadmin" && (
                      <>
                        <BreadcrumbSeparator className="text-black" />
                        <BreadcrumbItem>
                          <BreadcrumbPage className="bg-orange-100 px-3 py-1 rounded-lg text-[#F79E0E] font-medium">
                            {currentPage}
                          </BreadcrumbPage>
                        </BreadcrumbItem>
                      </>
                    )}
                  </BreadcrumbList>
                </Breadcrumb>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100"
          >
            <div className="p-6">{children}</div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
