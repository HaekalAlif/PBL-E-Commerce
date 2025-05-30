import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("Broadcasting auth request:", body);
    console.log("Request cookies:", request.headers.get("cookie"));

    // Get all cookies from the request
    const cookieHeader = request.headers.get("cookie") || "";

    // Check if we have authentication cookies
    if (
      !cookieHeader.includes("laravel_session") &&
      !cookieHeader.includes("auth_session")
    ) {
      console.error("No authentication cookies found");
      return NextResponse.json(
        {
          error: "No authentication session found",
          message: "Please log in first",
        },
        { status: 401 }
      );
    }

    // Forward the request to Laravel backend with all necessary headers
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      // Forward all cookies for authentication
      Cookie: cookieHeader,
      // Forward other important headers
      "X-Requested-With": "XMLHttpRequest",
      "User-Agent": request.headers.get("user-agent") || "",
      // Forward referer and origin for CORS
      Referer: request.headers.get("referer") || "",
      Origin: request.headers.get("origin") || "",
      // Forward any authorization header if present
      Authorization: request.headers.get("authorization") || "",
    };

    // Extract CSRF token from cookies if present
    const csrfMatch = cookieHeader.match(/XSRF-TOKEN=([^;]+)/);
    if (csrfMatch) {
      headers["X-XSRF-TOKEN"] = decodeURIComponent(csrfMatch[1]);
      console.log("Added CSRF token to headers");
    }

    const backendResponse = await fetch(
      `${BACKEND_URL}/api/broadcasting/auth`,
      {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      }
    );

    const responseText = await backendResponse.text();
    console.log("Backend response:", backendResponse.status, responseText);

    if (!backendResponse.ok) {
      console.error(
        `Backend error: ${backendResponse.status} - ${responseText}`
      );

      return NextResponse.json(
        {
          error: "Authentication failed",
          debug: responseText,
          status: backendResponse.status,
        },
        { status: backendResponse.status }
      );
    }

    const data = JSON.parse(responseText);
    console.log("Broadcasting auth successful:", data);

    return NextResponse.json(data, {
      status: backendResponse.status,
    });
  } catch (error: any) {
    console.error("Error in broadcasting auth API:", error);
    return NextResponse.json(
      {
        error: "Failed to authenticate broadcasting",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
