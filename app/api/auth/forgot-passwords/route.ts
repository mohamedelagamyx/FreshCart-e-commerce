import { NextResponse } from "next/server";
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://ecommerce.routemisr.com";
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;
    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 },
      );
    }
    const response = await fetch(`${API_BASE}/api/v1/auth/forgotPasswords`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message:
            data.message ||
            "Failed to send reset code. Please verify your email.",
        },
        { status: response.status },
      );
    }
    return NextResponse.json({
      success: true,
      message: data.message || "Reset code sent to your email address",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { success: false, message: "An unexpected network error occurred" },
      { status: 500 },
    );
  }
}
