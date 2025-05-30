import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    console.log(
      `Fetching product: ${slug} from ${BACKEND_URL}/api/products/${slug}`
    );

    // Forward the request to Laravel backend
    const backendResponse = await fetch(`${BACKEND_URL}/api/products/${slug}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        // Forward cookies for authentication if needed
        Cookie: request.headers.get("cookie") || "",
      },
    });

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      console.error(`Backend error: ${backendResponse.status} - ${errorText}`);

      return NextResponse.json(
        {
          status: "error",
          message: "Failed to fetch product from backend",
          debug: errorText,
        },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    console.log("Product data received:", data);

    return NextResponse.json(data, {
      status: backendResponse.status,
    });
  } catch (error: any) {
    console.error("Error in product API:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to fetch product",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
