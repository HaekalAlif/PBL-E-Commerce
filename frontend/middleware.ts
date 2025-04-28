import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Role constants matching backend
const ROLE_SUPERADMIN = 0;
const ROLE_ADMIN = 1;
const ROLE_USER = 2;

// Role names matching backend
const roleNames = {
  [ROLE_SUPERADMIN]: "superadmin",
  [ROLE_ADMIN]: "admin",
  [ROLE_USER]: "user",
};

export function middleware(request: NextRequest) {
  // Get cookies
  const userRole = request.cookies.get("user_role")?.value;
  const path = request.nextUrl.pathname;

  // Debug information
  console.log("Middleware Path:", path);
  console.log("User Role:", userRole);

  // Allow access to public routes and assets without authentication
  const publicPaths = [
    "/",
    "/login",
    "/register",
    "/forgot-password",
    "/storage",
    "/assets",
    "/images",
    "/api/featured-products",
    "/api/recommended-products"
  ];

  // Check if the path starts with any of these patterns
  const isPublicAsset = (path: string) =>
    path.startsWith("/_next") ||
    path.startsWith("/storage") ||
    path.startsWith("/images") ||
    path.includes(".") || // Files with extensions (images, etc)
    publicPaths.some(publicPath => path === publicPath || path.startsWith(publicPath + "/"));

  // Allow access to public paths and assets
  if (isPublicAsset(path)) {
    return NextResponse.next();
  }

  // If not authenticated and trying to access protected route, redirect to login
  if (!userRole) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Role-based route protection
  if (path.startsWith("/superadmin")) {
    if (userRole !== String(ROLE_SUPERADMIN)) {
      // Instead of redirecting to root, send to a specific dashboard based on role
      if (userRole === String(ROLE_ADMIN)) {
        return NextResponse.redirect(new URL("/admin", request.url));
      } else {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
  } else if (path.startsWith("/admin")) {
    if (
      userRole !== String(ROLE_ADMIN) &&
      userRole !== String(ROLE_SUPERADMIN)
    ) {
      // Redirect to user dashboard instead of root
      return NextResponse.redirect(new URL("/", request.url));
    }
  } else if (path.startsWith("/user")) {
    if (
      userRole !== String(ROLE_USER) &&
      userRole !== String(ROLE_ADMIN) &&
      userRole !== String(ROLE_SUPERADMIN)
    ) {
      // This should rarely happen if authentication is working properly
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|storage/|assets/|images/|api/featured-products|api/recommended-products).*)",
  ],
};
