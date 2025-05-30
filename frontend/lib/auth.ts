import Cookies from "js-cookie";
import axios from "./axios";

/**
 * Logout the user by clearing cookies and making a logout request
 */
export const logout = async () => {
  try {
    // Make a logout request to the server to invalidate the session
    await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/logout`,
      {},
      {
        withCredentials: true,
      }
    );
  } catch (error) {
    console.error("Error during logout:", error);
  } finally {
    // Clear all auth-related cookies regardless of server response
    Cookies.remove("auth_session", { path: "/" });
    Cookies.remove("user_role", { path: "/" });
    Cookies.remove("role_name", { path: "/" });

    // Also clear Laravel session cookies to prevent re-authentication issues
    Cookies.remove("laravel_session", { path: "/" });
    Cookies.remove("XSRF-TOKEN", { path: "/" });

    // Clear any chat-related cookies
    Cookies.remove("chat_session", { path: "/" });

    // Redirect to login page
    window.location.href = "/login";
  }
};

/**
 * Check if the user is authenticated
 * @returns Whether the user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!Cookies.get("auth_session");
};

/**
 * Get the user's role
 * @returns The user's role or null if not authenticated
 */
export const getUserRole = (): string | null => {
  return Cookies.get("role_name") || null;
};

export async function getCurrentUser() {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/user/profile`,
      {
        withCredentials: true,
      }
    );

    if (response.data.status === "success") {
      return {
        id_user: response.data.data.id_user,
        name: response.data.data.name,
        email: response.data.data.email,
      };
    }

    return null;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
}
