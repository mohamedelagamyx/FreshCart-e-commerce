import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "@/types/auth.types";
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://ecommerce.routemisr.com";
const COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "freshcart_token";
const COOKIE_MAX_AGE =
  Number(process.env.AUTH_COOKIE_MAX_AGE) || 60 * 60 * 24 * 30;
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { email, newPassword } = body;
    if (!email || !newPassword) {
      return NextResponse.json(
        { success: false, message: "Email and new password are required" },
        { status: 400 },
      );
    }
    const response = await fetch(`${API_BASE}/api/v1/auth/resetPassword`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, newPassword }),
    });
    const data = await response.json();
    if (!response.ok || !data.token) {
      return NextResponse.json(
        {
          success: false,
          message:
            data.message || "Failed to reset password. Please try again.",
        },
        { status: response.status || 400 },
      );
    }
    let userId = "";
    let userName = "";
    try {
      const decoded = jwtDecode<DecodedToken>(data.token);
      userId = decoded.id;
      userName = decoded.name;
    } catch {}
    const user = {
      id: userId,
      name: userName || email.split("@")[0],
      email: email,
      role: "user",
    };
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    });
    return NextResponse.json({
      success: true,
      message: "Password reset successfully",
      token: data.token,
      user,
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { success: false, message: "An unexpected network error occurred" },
      { status: 500 },
    );
  }
}
