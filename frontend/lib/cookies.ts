import Cookies from "js-cookie";

/**
 * Utility to clear all cookies from the browser
 */
export const clearAllCookies = () => {
  try {
    console.log("Starting cookie cleanup...");
    const cookies = document.cookie.split(";");
    const paths = ["/", "", "/user", "/admin", "/superadmin", "/api"];
    const domain = window.location.hostname;
    
    // Try these domains too
    const domains = [
      domain,
      `.${domain}`,
      domain.includes('.') ? domain.substring(domain.indexOf('.')) : domain,
    ];

    // Log all cookies we're about to clear
    console.log(`Found ${cookies.length} cookies to clear:`, cookies);

    // For all cookies found in document.cookie
    cookies.forEach((cookie) => {
      const cookieName = cookie.split("=")[0].trim();
      if (!cookieName) return;

      console.log(`Attempting to clear cookie: ${cookieName}`);

      // Try removing with different paths and domains
      paths.forEach((path) => {
        domains.forEach(domainVar => {
          // Standard removal with js-cookie
          Cookies.remove(cookieName, { path });
          Cookies.remove(cookieName, { path, domain: domainVar });
  
          // Direct document.cookie approach for stubborn cookies
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path};`;
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}; domain=${domainVar};`;
          document.cookie = `${cookieName}=; max-age=0; path=${path};`;
          document.cookie = `${cookieName}=; max-age=0; path=${path}; domain=${domainVar};`;
          
          // Handle secure cookies
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}; secure;`;
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}; domain=${domainVar}; secure;`;
        });
      });
    });

    // Target Laravel and authentication cookies specifically
    const authCookies = [
      // Auth tokens
      "auth_token",
      "auth_session",
      "user_role",
      "role_name",
      // Laravel specific
      "laravel_session",
      "XSRF-TOKEN",
      "PHPSESSID",
      "laravel_cookie_consent",
      // Remember tokens
      "remember_web_",
      "jwt",
    ];
    
    // Extra aggressive approach for auth cookies
    authCookies.forEach(name => {
      paths.forEach(path => {
        domains.forEach(domainVar => {
          // Clear both exact and prefix matches
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path};`;
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}; domain=${domainVar};`;
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}; secure;`;
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}; domain=${domainVar}; secure;`;
          document.cookie = `${name}=; max-age=0; path=${path};`;
          document.cookie = `${name}=; max-age=0; path=${path}; domain=${domainVar};`;
          
          // Some cookies might use SameSite attribute
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}; SameSite=None; Secure;`;
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}; domain=${domainVar}; SameSite=None; Secure;`;
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}; SameSite=Lax;`;
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}; domain=${domainVar}; SameSite=Lax;`;
        });
      });
    });

    console.log("Cookie cleanup completed.");
    console.log("Cookies remaining:", document.cookie);
  } catch (error) {
    console.error("Error during cookie cleanup:", error);
  }
};

/**
 * Set a cookie with consistent options
 */
export const setCookie = (name: string, value: string, options = {}) => {
  const defaultOptions = {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
  };

  Cookies.set(name, value, { ...defaultOptions, ...options });
};

/**
 * Get a cookie value
 */
export const getCookie = (name: string) => {
  return Cookies.get(name);
};
