import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth-utils";
import { Cart } from "@/types/cart.types";
export const dynamic = "force-dynamic";
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://ecommerce.routemisr.com";
const NO_CACHE_HEADERS = {
  "Cache-Control": "private, no-store, no-cache, must-revalidate",
};
interface RouteProps {
  params: Promise<{
    productId: string;
  }>;
}
export async function PUT(request: Request, props: RouteProps) {
  try {
    const { productId } = await props.params;
    if (!productId) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400, headers: NO_CACHE_HEADERS },
      );
    }
    const body = await request.json();
    const { count } = body;
    if (typeof count !== "number" || count < 1) {
      return NextResponse.json(
        {
          success: false,
          message: "Count must be a number greater than or equal to 1",
        },
        { status: 400, headers: NO_CACHE_HEADERS },
      );
    }
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthenticated" },
        { status: 401, headers: NO_CACHE_HEADERS },
      );
    }
    const response = await fetch(`${API_BASE}/api/v1/cart/${productId}`, {
      method: "PUT",
      headers: {
        token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ count }),
    });
    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Failed to update item quantity",
        },
        { status: response.status, headers: NO_CACHE_HEADERS },
      );
    }
    const normalizedCart: Cart = {
      cartId: data.cartId || data.data?._id || null,
      cartOwner: data.data?.cartOwner,
      products: data.data?.products || [],
      totalCartPrice: data.data?.totalCartPrice || 0,
      numOfCartItems: data.numOfCartItems || data.data?.products?.length || 0,
      updatedAt: data.data?.updatedAt,
    };
    return NextResponse.json(
      { success: true, data: normalizedCart },
      { headers: NO_CACHE_HEADERS },
    );
  } catch (error) {
    console.error("Cart item PUT proxy error:", error);
    return NextResponse.json(
      { success: false, message: "An unexpected network error occurred" },
      { status: 500, headers: NO_CACHE_HEADERS },
    );
  }
}
export async function DELETE(_request: Request, props: RouteProps) {
  try {
    const { productId } = await props.params;
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
        { success: false, message: "Unauthenticated" },
        { status: 401, headers: NO_CACHE_HEADERS },
      );
    }
    const response = await fetch(`${API_BASE}/api/v1/cart/${productId}`, {
      method: "DELETE",
      headers: {
        token,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Failed to remove item from cart",
        },
        { status: response.status, headers: NO_CACHE_HEADERS },
      );
    }
    const normalizedCart: Cart = {
      cartId: data.cartId || data.data?._id || null,
      cartOwner: data.data?.cartOwner,
      products: data.data?.products || [],
      totalCartPrice: data.data?.totalCartPrice || 0,
      numOfCartItems: data.numOfCartItems || data.data?.products?.length || 0,
      updatedAt: data.data?.updatedAt,
    };
    return NextResponse.json(
      { success: true, data: normalizedCart },
      { headers: NO_CACHE_HEADERS },
    );
  } catch (error) {
    console.error("Cart item DELETE proxy error:", error);
    return NextResponse.json(
      { success: false, message: "An unexpected network error occurred" },
      { status: 500, headers: NO_CACHE_HEADERS },
    );
  }
}
