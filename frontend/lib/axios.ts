import Axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import Cookies from "js-cookie";

// Create a base Axios instance with common configuration
const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000",
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true, // Always include credentials (cookies)
});

// Helper to extract CSRF token from cookies - moved to top level and exported
export function getCsrfTokenFromCookie(): string | null {
  const match = document.cookie.match(
    new RegExp("(^|;\\s*)(XSRF-TOKEN)=([^;]*)")
  );
  return match ? match[3] : null;
}

// Track if we're already fetching a CSRF token to prevent duplicates
let csrfTokenPromise: Promise<void> | null = null;

// Function to get CSRF token - now prevents duplicate requests
export const getCsrfToken = async (): Promise<void> => {
  // If we already have a request in flight, return that instead of making a new one
  if (csrfTokenPromise) {
    return csrfTokenPromise;
  }

  // Create a new request and store it
  csrfTokenPromise = axios
    .get("/sanctum/csrf-cookie")
    .then(() => {
      // Clear the promise reference after a short delay to allow for retries if needed
      setTimeout(() => {
        csrfTokenPromise = null;
      }, 5000);
    })
    .catch((error) => {
      console.error("Failed to fetch CSRF token:", error);
      csrfTokenPromise = null;
      throw error;
    });

  return csrfTokenPromise;
};

// Request interceptor to add XSRF token from cookie
axios.interceptors.request.use(
  async (config) => {
    // Don't add CSRF token to csrf-cookie endpoint to avoid loops
    if (config.url?.includes("/sanctum/csrf-cookie")) {
      return config;
    }

    // For write operations (non-GET), ensure CSRF token
    if (
      ["post", "put", "patch", "delete"].includes(
        config.method?.toLowerCase() || ""
      )
    ) {
      // Add special handling for payment management endpoints which require strict CSRF protection
      if (
        config.url?.includes("/admin/payments/") &&
        !config.url?.includes("/stats")
      ) {
        try {
          // Always get a fresh token for sensitive payment operations
          await getCsrfToken();
        } catch (e) {
          console.error(
            "Failed to refresh CSRF token for payment operation:",
            e
          );
        }
      }

      const token = getCsrfTokenFromCookie();
      if (token) {
        config.headers["X-XSRF-TOKEN"] = decodeURIComponent(token);
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle CSRF token mismatches
axios.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // Only retry once to prevent infinite loops
    if (
      error.response?.status === 419 &&
      !originalRequest._retry &&
      originalRequest.method !== "get"
    ) {
      originalRequest._retry = true;

      // Get a fresh CSRF token
      await getCsrfToken();

      // Update the token in the original request
      const token = getCsrfTokenFromCookie();
      if (originalRequest.headers && token) {
        originalRequest.headers["X-XSRF-TOKEN"] = decodeURIComponent(token);
      }

      // Retry the request
      return axios(originalRequest);
    }

    return Promise.reject(error);
  }
);

export default axios;
