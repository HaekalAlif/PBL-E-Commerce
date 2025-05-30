import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { getCsrfTokenFromCookie } from "../../../../lib/axios";

interface Window {
  Pusher: any;
}
declare var window: Window;

const reverbAppKey = process.env.NEXT_PUBLIC_REVERB_APP_KEY;
const reverbHost = process.env.NEXT_PUBLIC_REVERB_HOST;
const reverbPort = process.env.NEXT_PUBLIC_REVERB_PORT;
const reverbScheme = process.env.NEXT_PUBLIC_REVERB_SCHEME;

console.log("Reverb Config:", {
  key: reverbAppKey,
  host: reverbHost,
  port: reverbPort,
  scheme: reverbScheme,
});

window.Pusher = Pusher;

const echo = new Echo({
  broadcaster: "reverb",
  key: reverbAppKey,
  wsHost: reverbHost,
  wsPort: reverbPort ? Number(reverbPort) : 8080,
  wssPort: reverbPort ? Number(reverbPort) : 8080,
  forceTLS: reverbScheme === "https",
  enabledTransports: ["ws", "wss"],
  authEndpoint: "/api/broadcasting/auth", // Use Next.js API route
  auth: {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
    },
  },
  authorizer: (channel: any, options: any) => {
    return {
      authorize: (socketId: string, callback: Function) => {
        console.log(
          "Authorizing channel:",
          channel.name,
          "with socket:",
          socketId
        );

        // First check if we're authenticated by testing a simple endpoint
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth-check`, {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
          .then((authResponse) => {
            if (!authResponse.ok) {
              throw new Error(
                `Authentication check failed: ${authResponse.status}`
              );
            }
            return authResponse.json();
          })
          .then((authData) => {
            console.log("Auth check passed:", authData);

            // Get CSRF token from cookies (no need to fetch)
            const csrfToken = getCsrfTokenFromCookie();
            console.log(
              "CSRF token from cookie:",
              csrfToken ? "found" : "not found"
            );

            // Prepare headers for broadcasting auth
            const headers: Record<string, string> = {
              "Content-Type": "application/json",
              Accept: "application/json",
              "X-Requested-With": "XMLHttpRequest",
            };

            // Add CSRF token if available
            if (csrfToken) {
              headers["X-XSRF-TOKEN"] = decodeURIComponent(csrfToken);
            }

            // Now proceed with broadcasting auth
            return fetch("/api/broadcasting/auth", {
              method: "POST",
              headers,
              credentials: "include",
              body: JSON.stringify({
                socket_id: socketId,
                channel_name: channel.name,
              }),
            });
          })
          .then((response) => {
            console.log("Broadcasting auth response status:", response.status);
            if (!response.ok) {
              return response.text().then((text) => {
                console.error("Broadcasting auth failed:", text);
                throw new Error(`HTTP ${response.status}: ${text}`);
              });
            }
            return response.json();
          })
          .then((data) => {
            console.log("Broadcasting auth successful:", data);
            callback(null, data);
          })
          .catch((error) => {
            console.error("Broadcasting auth error:", error);
            callback(error);
          });
      },
    };
  },
});

// Add connection event listeners for debugging with proper type casting
try {
  // Type assertion for Pusher connector
  const pusherConnector = echo.connector as any;

  if (pusherConnector && pusherConnector.pusher) {
    pusherConnector.pusher.connection.bind("connected", () => {
      console.log("Echo: Connected to Reverb");
    });

    pusherConnector.pusher.connection.bind("disconnected", () => {
      console.log("Echo: Disconnected from Reverb");
    });

    pusherConnector.pusher.connection.bind("error", (error: any) => {
      console.error("Echo: Connection error:", error);
    });
  } else {
    console.warn("Pusher connector not available for event binding");
  }
} catch (error) {
  console.error("Error setting up connection event listeners:", error);
}

export default echo;
