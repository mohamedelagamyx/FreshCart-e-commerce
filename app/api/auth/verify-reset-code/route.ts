import { NextResponse } from "next/server";
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://ecommerce.routemisr.com";
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { resetCode } = body;
    if (!resetCode) {
      return NextResponse.json(
        { success: false, message: "Reset code is required" },
        { status: 400 },
      );
    }
    const response = await fetch(`${API_BASE}/api/v1/auth/verifyResetCode`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ resetCode: String(resetCode) }),
    });
    const data = await response.json();
    if (!response.ok || data.status !== "Success") {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Reset code is invalid or has expired",
        },
        { status: response.status || 400 },
      );
    }
    return NextResponse.json({
      success: true,
      message: "Reset code verified successfully",
    });
  } catch (error) {
    console.error("Verify reset code error:", error);
    return NextResponse.json(
      { success: false, message: "An unexpected network error occurred" },
      { status: 500 },
    );
  }
}
