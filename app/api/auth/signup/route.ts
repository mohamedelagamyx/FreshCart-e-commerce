import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "@/types/auth.types";
import { AUTH_COOKIE_NAME, AUTH_COOKIE_MAX_AGE } from "@/lib/auth-utils";
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://ecommerce.routemisr.com";
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, rePassword, phone } = body;
    if (!name || !email || !password || !rePassword || !phone) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 },
      );
    }
    const response = await fetch(`${API_BASE}/api/v1/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, rePassword, phone }),
    });
    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message:
            data.message || "Failed to create account. Please try again.",
        },
        { status: response.status },
      );
    }
    let userId = data.user?.id;
    if (!userId && data.token) {
      try {
        const decoded = jwtDecode<DecodedToken>(data.token);
        userId = decoded.id;
      } catch {}
    }
    const user = {
      id: userId,
      name: data.user?.name,
      email: data.user?.email,
      role: data.user?.role || "user",
    };
    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE_NAME, data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: AUTH_COOKIE_MAX_AGE,
      path: "/",
    });
    return NextResponse.json({
      success: true,
      message: "Account created successfully",
      user,
    });
  } catch (error) {
    console.error("Sign up error:", error);
    return NextResponse.json(
      { success: false, message: "An unexpected network error occurred" },
      { status: 500 },
    );
  }
}
