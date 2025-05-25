import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function GET(
  request: NextRequest,
  { params }: { params: { roomId: string } }
) {
  try {
    const { roomId } = params;

    console.log(`Fetching messages for room: ${roomId}`);

    // Forward the request to Laravel backend
    const backendResponse = await fetch(
      `${BACKEND_URL}/api/chat/${roomId}/messages`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          // Forward cookies for authentication
          Cookie: request.headers.get("cookie") || "",
        },
      }
    );

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      console.error(`Backend error: ${backendResponse.status} - ${errorText}`);

      return NextResponse.json(
        {
          status: "error",
          message: "Failed to fetch messages from backend",
          debug: errorText,
        },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    console.log("Messages data received:", data);

    return NextResponse.json(data, {
      status: backendResponse.status,
    });
  } catch (error: any) {
    console.error("Error in messages API:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to fetch messages",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { roomId: string } }
) {
  try {
    const { roomId } = params;
    const body = await request.json();

    console.log(`Sending message to room: ${roomId}`, body);

    // Forward the request to Laravel backend
    const backendResponse = await fetch(
      `${BACKEND_URL}/api/chat/${roomId}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          // Forward cookies for authentication
          Cookie: request.headers.get("cookie") || "",
        },
        body: JSON.stringify(body),
      }
    );

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      console.error(`Backend error: ${backendResponse.status} - ${errorText}`);

      return NextResponse.json(
        {
          status: "error",
          message: "Failed to send message to backend",
          debug: errorText,
        },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    console.log("Message sent successfully:", data);

    return NextResponse.json(data, {
      status: backendResponse.status,
    });
  } catch (error: any) {
    console.error("Error in send message API:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to send message",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
