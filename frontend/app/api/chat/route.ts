import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function GET(request: NextRequest) {
  try {
    console.log("Fetching chat rooms");

    // Forward the request to Laravel backend
    const backendResponse = await fetch(`${BACKEND_URL}/api/chat`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        // Forward cookies for authentication
        Cookie: request.headers.get("cookie") || "",
      },
    });

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      console.error(`Backend error: ${backendResponse.status} - ${errorText}`);

      return NextResponse.json(
        {
          status: "error",
          message: "Failed to fetch chat rooms from backend",
          debug: errorText,
        },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    console.log("Chat rooms data received:", data);

    return NextResponse.json(data, {
      status: backendResponse.status,
    });
  } catch (error: any) {
    console.error("Error in chat rooms API:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to fetch chat rooms",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Creating chat room:", body);

    // Forward the request to Laravel backend
    const backendResponse = await fetch(`${BACKEND_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        // Forward cookies for authentication
        Cookie: request.headers.get("cookie") || "",
      },
      body: JSON.stringify(body),
    });

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      console.error(`Backend error: ${backendResponse.status} - ${errorText}`);

      return NextResponse.json(
        {
          status: "error",
          message: "Failed to create chat room",
          debug: errorText,
        },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    console.log("Chat room created successfully:", data);

    return NextResponse.json(data, {
      status: backendResponse.status,
    });
  } catch (error: any) {
    console.error("Error in create chat room API:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to create chat room",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
