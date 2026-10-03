import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "@/types/auth.types";
import { UserOrder } from "@/types/order.types";
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
        { success: false, message: "Please sign in to view your orders" },
        { status: 401, headers: NO_CACHE_HEADERS },
      );
    }
    let decoded: DecodedToken;
    try {
      decoded = jwtDecode<DecodedToken>(token);
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid session token" },
        { status: 401, headers: NO_CACHE_HEADERS },
      );
    }
    if (!decoded || !decoded.id) {
      return NextResponse.json(
        { success: false, message: "Customer identifier missing from session" },
        { status: 401, headers: NO_CACHE_HEADERS },
      );
    }
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      return NextResponse.json(
        { success: false, message: "Session expired. Please sign in again" },
        { status: 401, headers: NO_CACHE_HEADERS },
      );
    }
    const userId = decoded.id;
    const response = await fetch(`${API_BASE}/api/v1/orders/user/${userId}`, {
      method: "GET",
      headers: {
        token,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
    if (response.status === 404) {
      return NextResponse.json(
        { success: true, data: [] },
        { status: 200, headers: NO_CACHE_HEADERS },
      );
    }
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          success: false,
          message: errorData.message || "Failed to retrieve orders",
        },
        { status: response.status, headers: NO_CACHE_HEADERS },
      );
    }
    const rawData = await response.json();
    const ordersList: UserOrder[] = Array.isArray(rawData)
      ? rawData
      : Array.isArray(rawData?.data)
        ? rawData.data
        : [];
    ordersList.sort((a, b) => {
      const timeA = new Date(a.createdAt || 0).getTime();
      const timeB = new Date(b.createdAt || 0).getTime();
      return timeB - timeA;
    });
    return NextResponse.json(
      {
        success: true,
        data: ordersList,
      },
      { status: 200, headers: NO_CACHE_HEADERS },
    );
  } catch (error) {
    console.error("Orders retrieval proxy error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Unable to retrieve order history at this time",
      },
      { status: 500, headers: NO_CACHE_HEADERS },
    );
  }
}
