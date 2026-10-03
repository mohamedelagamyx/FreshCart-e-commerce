import { NextResponse } from "next/server";
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://ecommerce.routemisr.com";
export async function GET() {
  try {
    const response = await fetch(`${API_BASE}/api/v1/brands`, {
      next: { revalidate: 3600 },
    });
    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Failed to fetch brands",
        },
        { status: response.status },
      );
    }
    return NextResponse.json({
      success: true,
      data: data.data || [],
    });
  } catch (error) {
    console.error("Brands API route error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected network error occurred while fetching brands",
      },
      { status: 500 },
    );
  }
}
