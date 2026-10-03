import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth-utils";
export const dynamic = "force-dynamic";
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://ecommerce.routemisr.com";
const NO_CACHE_HEADERS = {
  "Cache-Control": "private, no-store, no-cache, must-revalidate",
};
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthenticated" },
        { status: 401, headers: NO_CACHE_HEADERS },
      );
    }
    const response = await fetch(`${API_BASE}/api/v1/wishlist`, {
      headers: {
        token,
      },
      cache: "no-store",
    });
    if (response.status === 404) {
      return NextResponse.json(
        { success: true, count: 0, data: [] },
        { status: 200, headers: NO_CACHE_HEADERS },
      );
    }
    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Failed to fetch wishlist items",
        },
        { status: response.status, headers: NO_CACHE_HEADERS },
      );
    }
    return NextResponse.json(
      {
        success: true,
        count: data.count || (Array.isArray(data.data) ? data.data.length : 0),
        data: data.data || [],
      },
      { headers: NO_CACHE_HEADERS },
    );
  } catch (error) {
    console.error("Wishlist GET proxy error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to communicate with wishlist service",
      },
      { status: 500, headers: NO_CACHE_HEADERS },
    );
  }
}
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { productId } = body;
    if (!productId) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400, headers: NO_CACHE_HEADERS },
      );
    }
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Please sign in to save items to your wishlist",
        },
        { status: 401, headers: NO_CACHE_HEADERS },
      );
    }
    const response = await fetch(`${API_BASE}/api/v1/wishlist`, {
      method: "POST",
      headers: {
        token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId }),
    });
    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Failed to add item to wishlist",
        },
        { status: response.status, headers: NO_CACHE_HEADERS },
      );
    }
    return NextResponse.json(
      {
        success: true,
        message: data.message || "Product added successfully to your wishlist",
        data: data.data || [],
      },
      { headers: NO_CACHE_HEADERS },
    );
  } catch (error) {
    console.error("Wishlist POST proxy error:", error);
    return NextResponse.json(
      { success: false, message: "An unexpected network error occurred" },
      { status: 500, headers: NO_CACHE_HEADERS },
    );
  }
}
