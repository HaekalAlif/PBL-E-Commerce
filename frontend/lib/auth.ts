import axios from "./axios";
import { clearAllCookies } from "./cookies";
import { getCsrfToken } from "./axios";

export const logout = async () => {
  try {
    console.log("Executing complete logout process");

    // Clear browser storage first
    localStorage.clear();
    sessionStorage.clear();

    // Get a fresh CSRF token and wait for it
    await getCsrfToken();

    // Get the token manually to ensure it's available
    const tokenCookie = document.cookie
      .split(";")
      .find((cookie) => cookie.trim().startsWith("XSRF-TOKEN="));

    const csrfToken = tokenCookie
      ? decodeURIComponent(tokenCookie.split("=")[1])
      : "";

    console.log(
      "CSRF Token for logout:",
      csrfToken ? `${csrfToken.substring(0, 10)}...` : "none"
    );

    // Call the logout endpoint with explicit headers
    try {
      const response = await axios.post(
        "/api/logout",
        {},
        {
          withCredentials: true,
          headers: {
            "X-XSRF-TOKEN": csrfToken,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Logout response:", response.status, response.data);

      // Clear all cookies after successful logout
      clearAllCookies();
    } catch (logoutError: any) {
      console.error(
        "Logout API error:",
        logoutError?.response?.status,
        logoutError?.response?.data || logoutError
      );
      // Still clear cookies even on error
      clearAllCookies();
    }
  } catch (error) {
    console.error("Error during logout process:", error);
    // Clear cookies as a last resort
    clearAllCookies();
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
