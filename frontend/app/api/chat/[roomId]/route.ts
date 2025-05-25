import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function GET(
  request: NextRequest,
  { params }: { params: { roomId: string } }
) {
  try {
    const { roomId } = params;

    console.log(`Fetching chat room: ${roomId}`);

    // Forward the request to Laravel backend
    const backendResponse = await fetch(`${BACKEND_URL}/api/chat/${roomId}`, {
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
          message: "Failed to fetch chat room from backend",
          debug: errorText,
        },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    console.log("Chat room data received:", data);

    return NextResponse.json(data, {
      status: backendResponse.status,
    });
  } catch (error: any) {
    console.error("Error in chat room API:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to fetch chat room",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
