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
  const roleName = request.cookies.get("role_name")?.value;

  // In Next.js, auth_session isn't automatically set - we need to check
  // for our own session cookie or token
  const sessionToken = request.cookies.get("auth_session")?.value;
  const isAuthenticated = Boolean(userRole); // Use userRole as authentication indicator

  const path = request.nextUrl.pathname;

  // Debug information
  console.log({
    path,
    userRole,
    roleName,
    isAuthenticated,
  });

  // Skip middleware for public routes that don't need auth
  const publicRoutes = ["/login", "/register", "/forgot-password", "/"];
  if (
    publicRoutes.some((route) => path === route || path.startsWith(route + "?"))
  ) {
    // Only redirect login/register pages, not the root path
    if (isAuthenticated && path !== "/") {
      if (userRole === String(ROLE_SUPERADMIN)) {
        return NextResponse.redirect(new URL("/superadmin", request.url));
      } else if (userRole === String(ROLE_ADMIN)) {
        return NextResponse.redirect(new URL("/admin", request.url));
      } else if (userRole === String(ROLE_USER)) {
        return NextResponse.redirect(new URL("/user", request.url));
      }
    }
    return NextResponse.next();
  }

  // If not authenticated and trying to access protected route, redirect to login
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Role-based route protection
  if (path.startsWith("/superadmin")) {
    if (userRole !== String(ROLE_SUPERADMIN)) {
      // Instead of redirecting to root, send to a specific dashboard based on role
      if (userRole === String(ROLE_ADMIN)) {
        return NextResponse.redirect(new URL("/admin", request.url));
      } else {
        return NextResponse.redirect(new URL("/user", request.url));
      }
    }
  } else if (path.startsWith("/admin")) {
    if (
      userRole !== String(ROLE_ADMIN) &&
      userRole !== String(ROLE_SUPERADMIN)
    ) {
      // Redirect to user dashboard instead of root
      return NextResponse.redirect(new URL("/user", request.url));
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
    // Match all paths except:
    // - Next.js static files (_next/static, _next/image)
    // - Standard static files (favicon.ico, images)
    // - API routes (/api)
    // - Image routes from backend or any path containing 'images' or 'img'
    // - File extensions typically used for images (.jpg, .jpeg, .png, .gif, .svg, .webp)
    "/((?!_next/static|_next/image|favicon.ico|images|img|api|\\.jpg|\\.jpeg|\\.png|\\.gif|\\.svg|\\.webp).*)",
  ],
};
