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
    addressId: string;
  }>;
}
export async function DELETE(_request: Request, props: RouteProps) {
  try {
    const { addressId } = await props.params;
    if (!addressId) {
      return NextResponse.json(
        { success: false, message: "Address ID is required" },
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
    const response = await fetch(`${API_BASE}/api/v1/addresses/${addressId}`, {
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
          message: data.message || "Failed to remove address",
        },
        { status: response.status, headers: NO_CACHE_HEADERS },
      );
    }
    return NextResponse.json(
      {
        success: true,
        message: data.message || "Address removed successfully",
        data: data.data || [],
      },
      { headers: NO_CACHE_HEADERS },
    );
  } catch (error) {
    console.error("Addresses DELETE proxy error:", error);
    return NextResponse.json(
      { success: false, message: "An unexpected network error occurred" },
      { status: 500, headers: NO_CACHE_HEADERS },
    );
  }
}
