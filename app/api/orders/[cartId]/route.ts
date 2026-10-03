import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth-utils";
export const dynamic = "force-dynamic";
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://ecommerce.routemisr.com";
const NO_CACHE_HEADERS = {
  "Cache-Control": "private, no-store, no-cache, must-revalidate",
};
interface RouteProps {
  params: Promise<{
    cartId: string;
  }>;
}
export async function POST(request: Request, props: RouteProps) {
  try {
    const { cartId } = await props.params;
    if (!cartId) {
      return NextResponse.json(
        { success: false, message: "Cart ID is required" },
        { status: 400, headers: NO_CACHE_HEADERS },
      );
    }
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Please sign in to complete checkout" },
        { status: 401, headers: NO_CACHE_HEADERS },
      );
    }
    const body = await request.json();
    const { shippingAddress } = body;
    if (
      !shippingAddress ||
      !shippingAddress.details ||
      !shippingAddress.phone ||
      !shippingAddress.city
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Complete shipping address (details, phone, city) is required",
        },
        { status: 400, headers: NO_CACHE_HEADERS },
      );
    }
    const response = await fetch(`${API_BASE}/api/v1/orders/${cartId}`, {
      method: "POST",
      headers: {
        token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ shippingAddress }),
    });
    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Failed to create cash order",
        },
        { status: response.status, headers: NO_CACHE_HEADERS },
      );
    }
    return NextResponse.json(
      {
        success: true,
        message: data.message || "Order placed successfully",
        data: data.data,
      },
      { status: 201, headers: NO_CACHE_HEADERS },
    );
  } catch (error) {
    console.error("Cash order creation error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Network error occurred while creating order",
      },
      { status: 500, headers: NO_CACHE_HEADERS },
    );
  }
}
