"use client";

import {
  Home,
  Users,
  Store,
  Tags,
  Package,
  ArrowUpDown,
  Receipt,
  Shield,
  Truck,
  MessageCircle,
  Bell,
  ChevronRight,
  PieChart,
  Settings,
  BarChart3,
  ClipboardList,
  CircleDollarSign,
  Wallet,
  Activity,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import ProfileCard from "@/components/common/profile-card";
import { useState, useEffect } from "react";
import Logout from "@/components/auth/LogoutButton";

const menuGroups = [
  {
    label: "Overview",
    icon: PieChart,
    items: [{ title: "Dashboard", url: "/superadmin", icon: Home, badge: "" }],
  },
  {
    label: "Management",
    icon: Settings,
    items: [
      { title: "Users", url: "/superadmin/user", icon: Users, badge: "" },
      { title: "Stores", url: "/superadmin/toko", icon: Store, badge: "" },
      {
        title: "Categories",
        url: "/superadmin/kategori",
        icon: Tags,
        badge: "",
      },
      {
        title: "Products",
        url: "/superadmin/barang",
        icon: Package,
        badge: "",
      },
    ],
  },
  {
    label: "Transaction",
    icon: Receipt,
    items: [
      {
        title: "Orders",
        url: "/superadmin/pesanan",
        icon: ClipboardList,
        badge: "",
      },
      {
        title: "Payments",
        url: "/superadmin/pembayaran",
        icon: CircleDollarSign,
        badge: "",
      },
      {
        title: "Withdrawals",
        url: "/superadmin/pencairan-dana",
        icon: Wallet,
        badge: "",
      },
      {
        title: "Balances",
        url: "/superadmin/saldo",
        icon: BarChart3,
        badge: "",
      },
      {
        title: "Financial Audit",
        url: "/superadmin/audit",
        icon: Activity,
        badge: "",
      },
    ],
  },
  {
    label: "Operations",
    icon: BarChart3,
    items: [
      {
        title: "Transactions",
        url: "/superadmin/transaksi",
        icon: Receipt,
        badge: "",
      },
      { title: "Escrow", url: "/superadmin/escrow", icon: Shield, badge: "" },
      {
        title: "Shipping",
        url: "/superadmin/pengiriman",
        icon: Truck,
        badge: "",
      },
      {
        title: "Complaints",
        url: "/superadmin/komplain",
        icon: MessageCircle,
        badge: "",
      },
      {
        title: "Notifications",
        url: "/superadmin/notifikasi",
        icon: Bell,
        badge: "",
      },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<string[]>([]);

  // Automatically open the group containing the current path
  useEffect(() => {
    const currentGroup = menuGroups.find((group) =>
      group.items.some((item) => pathname === item.url)
    );

    if (currentGroup && !openGroups.includes(currentGroup.label)) {
      setOpenGroups((prev) => [...prev, currentGroup.label]);
    }
  }, [pathname]);

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  return (
    <aside className="flex h-screen flex-col border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="p-4 border-b">
        <ProfileCard />
      </div>

      <ScrollArea className="flex-1">
        <div className="px-2 py-2">
          {menuGroups.map((group) => (
            <Collapsible
              key={group.label}
              open={openGroups.includes(group.label)}
              onOpenChange={() => toggleGroup(group.label)}
              className="mb-1.5"
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors hover:bg-accent/50",
                    openGroups.includes(group.label)
                      ? "bg-accent/40 font-medium"
                      : "text-muted-foreground"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <group.icon
                      className={cn(
                        "h-4 w-4",
                        openGroups.includes(group.label)
                          ? "text-foreground"
                          : "text-muted-foreground"
                      )}
                    />
                    <span>{group.label}</span>
                  </div>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      openGroups.includes(group.label)
                        ? "transform rotate-180"
                        : ""
                    )}
                  />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-2 space-y-0.5 mt-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.url;
                  return (
                    <Link
                      key={item.title}
                      href={item.url}
                      className={cn(
                        "flex items-center justify-between rounded-md px-3 py-2 text-sm transition-all",
                        isActive
                          ? "bg-accent text-foreground font-medium shadow-sm"
                          : "text-muted-foreground hover:bg-accent/30 hover:text-foreground"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <item.icon
                          className={cn(
                            "h-4 w-4",
                            isActive
                              ? "text-foreground"
                              : "text-muted-foreground"
                          )}
                        />
                        <span>{item.title}</span>
                      </div>
                      {item.badge && (
                        <Badge
                          variant="secondary"
                          className="h-5 px-1.5 text-xs font-normal"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  );
                })}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </ScrollArea>
      <div className="border-t p-4">
        <Logout />
      </div>
    </aside>
  );
}
