import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth-utils";
import { addressSchema } from "@/schemas/address.schema";
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
    const response = await fetch(`${API_BASE}/api/v1/addresses`, {
      headers: {
        token,
      },
      cache: "no-store",
    });
    if (response.status === 404) {
      return NextResponse.json(
        { success: true, data: [] },
        { status: 200, headers: NO_CACHE_HEADERS },
      );
    }
    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Failed to fetch saved addresses",
        },
        { status: response.status, headers: NO_CACHE_HEADERS },
      );
    }
    return NextResponse.json(
      {
        success: true,
        data: data.data || [],
      },
      { headers: NO_CACHE_HEADERS },
    );
  } catch (error) {
    console.error("Addresses GET proxy error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to communicate with addresses service",
      },
      { status: 500, headers: NO_CACHE_HEADERS },
    );
  }
}
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const validation = addressSchema.safeParse(body);
    if (!validation.success) {
      const firstError =
        validation.error.errors[0]?.message || "Invalid address data";
      return NextResponse.json(
        {
          success: false,
          message: firstError,
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400, headers: NO_CACHE_HEADERS },
      );
    }
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Please sign in to save delivery addresses",
        },
        { status: 401, headers: NO_CACHE_HEADERS },
      );
    }
    const response = await fetch(`${API_BASE}/api/v1/addresses`, {
      method: "POST",
      headers: {
        token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validation.data),
    });
    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Failed to add address",
        },
        { status: response.status, headers: NO_CACHE_HEADERS },
      );
    }
    return NextResponse.json(
      {
        success: true,
        message: data.message || "Address added successfully",
        data: data.data || [],
      },
      { headers: NO_CACHE_HEADERS },
    );
  } catch (error) {
    console.error("Addresses POST proxy error:", error);
    return NextResponse.json(
      { success: false, message: "An unexpected network error occurred" },
      { status: 500, headers: NO_CACHE_HEADERS },
    );
  }
}
