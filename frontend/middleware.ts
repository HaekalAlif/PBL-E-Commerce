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
  const publicRoutes = ['/login', '/register', '/forgot-password'];
  if (publicRoutes.some(route => path.startsWith(route))) {
    // If authenticated user tries to access login/register, redirect based on role
    if (isAuthenticated) {
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
  if (path.startsWith('/superadmin')) {
    if (userRole !== String(ROLE_SUPERADMIN)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } else if (path.startsWith('/admin')) {
    if (userRole !== String(ROLE_ADMIN) && userRole !== String(ROLE_SUPERADMIN)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } else if (path.startsWith('/user')) {
    if (userRole !== String(ROLE_USER) && userRole !== String(ROLE_ADMIN) && userRole !== String(ROLE_SUPERADMIN)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static files, api routes, etc.
    "/((?!_next/static|_next/image|favicon.ico|images|api).*)",
  ],
};
