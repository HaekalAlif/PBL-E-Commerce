import axios, { AxiosInstance } from "axios";

// Extend AxiosInstance to include sanctum property
interface CustomAxiosInstance extends AxiosInstance {
  sanctum?: {
    csrf: () => Promise<any>;
  };
}

// Function to get CSRF token from cookie
const getCsrfTokenFromCookie = () => {
  const tokenCookie = document.cookie
    .split(";")
    .find((cookie) => cookie.trim().startsWith("XSRF-TOKEN="));

  if (tokenCookie) {
    return decodeURIComponent(tokenCookie.split("=")[1]);
  }
  return null;
};

// Export the function for direct use
export { getCsrfTokenFromCookie };

// Create axios instance with updated CORS configuration
const instance: CustomAxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
    Accept: "application/json",
  },
  withCredentials: true, // This ensures cookies are sent with requests
});

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    // Get CSRF token from cookie
    const token = getCsrfTokenFromCookie();

    if (token) {
      // Log the token being sent (for debugging)
      console.log(`Setting X-XSRF-TOKEN header: ${token.substring(0, 10)}...`);

      // Set the X-XSRF-TOKEN header with the token value
      config.headers["X-XSRF-TOKEN"] = token;
    } else {
      console.warn("No XSRF-TOKEN cookie found for request");
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Log detailed error information for debugging
    if (error.response) {
      console.error(
        "Response error:",
        error.response.status,
        error.response.data
      );

      // If CSRF token mismatch (419) error, try to refresh the token and retry
      if (error.response.status === 419) {
        console.log(
          "CSRF token mismatch detected, attempting to refresh token"
        );

        try {
          // Get a fresh CSRF token
          await instance.get("/sanctum/csrf-cookie");

          // Clone the original request config
          const originalRequest = error.config;

          // Get the new token
          const newToken = getCsrfTokenFromCookie();
          if (newToken) {
            originalRequest.headers["X-XSRF-TOKEN"] = newToken;
          }

          // Retry the request with the new token
          console.log("Retrying request with new CSRF token");
          return axios(originalRequest);
        } catch (refreshError) {
          console.error("Failed to refresh CSRF token:", refreshError);
          return Promise.reject(error);
        }
      }
    } else if (error.request) {
      console.error("Request error (no response):", error.request);
    } else {
      console.error("Error:", error.message);
    }

    return Promise.reject(error);
  }
);

// Helper function for direct Sanctum endpoints
instance.sanctum = {
  csrf: async () => {
    try {
      const response = await instance.get("/sanctum/csrf-cookie");
      console.log("CSRF cookie refreshed");
      return response;
    } catch (error) {
      console.error("Error refreshing CSRF cookie:", error);
      throw error;
    }
  },
};

export default instance;

// Export a function to get a fresh CSRF token
export async function getCsrfToken(url = "/sanctum/csrf-cookie") {
  try {
    const response = await instance.get(url);
    const token = getCsrfTokenFromCookie();
    console.log(
      "New CSRF token obtained:",
      token ? `${token.substring(0, 10)}...` : "none"
    );
    return response;
  } catch (error) {
    console.error("Error getting CSRF token:", error);
    throw error;
  }
}
