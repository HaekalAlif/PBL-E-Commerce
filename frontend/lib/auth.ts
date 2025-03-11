import axios from "./axios";
import { clearAllCookies } from "./cookies";
import { getCsrfToken } from "./axios";

/**
 * More aggressive cookie clearing function specifically for HTTP-only cookies
 */
const clearHttpOnlyCookies = () => {
  const domain = window.location.hostname;
  // Try root domain and all subdomains
  const domains = [
    domain,
    `.${domain}`,
    domain.includes(".") ? domain.substring(domain.indexOf(".")) : domain,
  ];

  // Try various paths
  const paths = ["/", "", "/user", "/admin", "/superadmin", "/api"];

  // Critical cookies that need to be forcibly removed
  const cookieNames = [
    "laravel_session",
    "auth_token",
    "XSRF-TOKEN",
    "PHPSESSID",
    "laravel_cookie_consent",
    "remember_web_",
    "jwt",
    "session",
    "sid",
  ];

  for (const name of cookieNames) {
    for (const path of paths) {
      for (const domainVar of domains) {
        // Try with different options
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path};`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}; domain=${domainVar};`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}; secure;`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}; domain=${domainVar}; secure;`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}; samesite=strict;`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}; domain=${domainVar}; samesite=strict;`;
        document.cookie = `${name}=; max-age=0; path=${path};`;
        document.cookie = `${name}=; max-age=0; path=${path}; domain=${domainVar};`;
      }
    }
  }
};

/**
 * Server-side cookie clearing for HTTP-only cookies
 */
const clearServerSideCookies = async () => {
  try {
    // Create an image request to the server endpoint
    // This approach works for HTTP-only cookies as it creates a proper HTTP request
    const img = new Image();
    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
    img.src = `${backendUrl}/api/clear-session-cookies?t=${new Date().getTime()}`;

    // Also try with fetch which is more reliable for cookie operations
    await fetch(`${backendUrl}/api/clear-session-cookies`, {
      method: "GET",
      credentials: "include", // Important: includes cookies in the request
    });

    console.log("Server-side cookie clearing initiated");

    // Return a promise that resolves after a short delay
    return new Promise((resolve) => setTimeout(resolve, 500));
  } catch (error) {
    console.error("Error in server-side cookie clearing:", error);
  }
};

/**
 * Complete logout function that ensures all authentication tokens are removed
 */
export const logout = async () => {
  try {
    console.log("Executing complete logout process");

    // Clear browser storage first
    localStorage.clear();
    sessionStorage.clear();

    // First attempt - call the backend logout endpoint
    try {
      // Get a fresh CSRF token
      await getCsrfToken();

      // Get the token from cookie
      const tokenCookie = document.cookie
        .split(";")
        .find((cookie) => cookie.trim().startsWith("XSRF-TOKEN="));

      const csrfToken = tokenCookie
        ? decodeURIComponent(tokenCookie.split("=")[1])
        : null;

      await axios.post(
        "/api/logout",
        {},
        {
          withCredentials: true,
          headers: {
            "X-XSRF-TOKEN": csrfToken || "",
          },
        }
      );
      console.log("logout API call successful");
    } catch (logoutError) {
      console.warn("logout error", logoutError);
    }
  } catch (error) {
    console.error("Error during logout process:", error);
  }
};

/**
 * Check if user is authenticated by checking for auth cookies
 */
export const isAuthenticated = () => {
  const hasAuthToken = document.cookie.includes("auth_token");
  const hasSession = document.cookie.includes("laravel_session");
  const hasUserRole = document.cookie.includes("user_role");

  return hasAuthToken && hasSession;
};
