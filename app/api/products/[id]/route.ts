import { NextResponse } from "next/server";
import { getProductById } from "@/services/products.service";
export async function GET(
  _request: Request,
  props: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  try {
    const { id } = await props.params;
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Missing product identifier" },
        { status: 400 },
      );
    }
    const product = await getProductById(id);
    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Product details API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
