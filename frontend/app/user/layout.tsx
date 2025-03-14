"use client";

import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/user/user-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

// Define a more comprehensive label mapping
const routeLabels: { [key: string]: string } = {
  superadmin: "Super Admin",
  user: "Dashboard",
  toko: "Toko",
  barang: "Barang",
  kategori: "Kategori",
  lelang: "Lelang",
  penawaran: "Penawaran",
  transaksi: "Transaksi",
  edit: "Edit",
  create: "Create",
  detail: "Detail",
};

function getBreadcrumbs(path: string) {
  const parts = path.split("/").filter(Boolean);
  const cleanParts = parts
    .map((part) => {
      // Filter out dynamic route parameters (any numeric values)
      return /^\d+$/.test(part) ? null : part;
    })
    .filter(Boolean) as string[];

  return cleanParts.map((part, index) => {
    // Get the base label from our mapping or capitalize the part
    let label =
      routeLabels[part] || part.charAt(0).toUpperCase() + part.slice(1);

    // If this is an action (edit/create/detail) and there's a previous part,
    // combine them for better context
    if (["edit", "create", "detail"].includes(part) && index > 0) {
      const parentLabel =
        routeLabels[cleanParts[index - 1]]?.split(" ")[0] ||
        cleanParts[index - 1].charAt(0).toUpperCase() +
          cleanParts[index - 1].slice(1);
      label = `${label} ${parentLabel}`;
    }

    return {
      label,
      href: "/" + cleanParts.slice(0, index + 1).join("/"),
      current: index === cleanParts.length - 1,
    };
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname);

  return (
    <SidebarProvider>
      {/* Sidebar */}
      <Sidebar>
        <AppSidebar />
      </Sidebar>

      {/* Main content */}
      <SidebarInset>
        <div className="min-h-screen bg-gray-50/30">
          {/* Header */}
          <header className="sticky pl-2 top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
              {/* Sidebar trigger */}
              <SidebarTrigger className="mr-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/superadmin">
                      <Home className="h-4 w-4" />
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {breadcrumbs.map((breadcrumb) => (
                    <BreadcrumbItem key={breadcrumb.href}>
                      <BreadcrumbSeparator>
                        <ChevronRight className="h-4 w-4" />
                      </BreadcrumbSeparator>
                      {breadcrumb.current ? (
                        <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={breadcrumb.href}>
                          {breadcrumb.label}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>

          {/* Main content area */}
          <ScrollArea className="h-[calc(100vh-4.5rem)]">
            <main className="container px-6">{children}</main>
          </ScrollArea>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
