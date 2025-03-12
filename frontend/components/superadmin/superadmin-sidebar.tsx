"use client";

import {
  Home,
  Users,
  Store,
  Tags,
  Package,
  Gavel,
  ArrowUpDown,
  Receipt,
  Shield,
  Truck,
  MessageCircle,
  Bell,
  ChevronRight,
  LayoutDashboard,
  PieChart,
  Settings,
  BarChart3,
  ClipboardList,
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
import { useState } from "react";
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
    label: "Auction",
    icon: Gavel,
    items: [
      { title: "Auctions", url: "/superadmin/lelang", icon: Gavel, badge: "" },
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

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  return (
    <aside className="flex h-screen flex-col border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <ProfileCard />

      <ScrollArea className="flex-1 py-2">
        <div className="space-y-4 py-4">
          {menuGroups.map((group) => (
            <Collapsible
              key={group.label}
              open={openGroups.includes(group.label)}
              onOpenChange={() => toggleGroup(group.label)}
              className="px-3"
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "group flex w-full items-center justify-between p-2 hover:bg-accent/50",
                    openGroups.includes(group.label) && "bg-accent"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <group.icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{group.label}</span>
                  </div>
                  <ChevronRight
                    className={cn(
                      "h-4 w-4 text-muted-foreground transition-transform duration-200",
                      openGroups.includes(group.label) && "rotate-90"
                    )}
                  />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="relative space-y-1 px-2 pt-2">
                {/* Vertical line connector */}
                <div className="absolute left-[17px] top-0 h-full w-px bg-border/50" />

                {group.items.map((item) => (
                  <Link
                    key={item.title}
                    href={item.url}
                    className={cn(
                      "relative flex items-center justify-between rounded-md px-3 py-2 text-sm transition-all duration-200",
                      pathname === item.url
                        ? "bg-accent font-medium text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground hover:translate-x-1"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon
                        className={cn(
                          "h-4 w-4 transition-colors",
                          pathname === item.url
                            ? "text-foreground"
                            : "text-muted-foreground"
                        )}
                      />
                      <span>{item.title}</span>
                    </div>
                    {item.badge && (
                      <Badge
                        variant="secondary"
                        className="ml-auto h-5 px-2 text-xs"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                ))}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </ScrollArea>
      <div className="mt-auto border-t bg-accent/5 p-4">
        <Logout />
      </div>
    </aside>
  );
}
