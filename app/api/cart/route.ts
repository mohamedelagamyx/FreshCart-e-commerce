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
function emptyCartPayload(): Cart {
  return {
    cartId: null,
    products: [],
    totalCartPrice: 0,
    numOfCartItems: 0,
  };
}
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthenticated" },
        { status: 401, headers: NO_CACHE_HEADERS },
      );
    }
    const response = await fetch(`${API_BASE}/api/v1/cart`, {
      headers: {
        token,
      },
      cache: "no-store",
    });
    if (response.status === 404) {
      return NextResponse.json(
        { success: true, data: emptyCartPayload() },
        { status: 200, headers: NO_CACHE_HEADERS },
      );
    }
    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Failed to fetch cart",
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
    console.error("Cart GET proxy error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to communicate with cart service" },
      { status: 500, headers: NO_CACHE_HEADERS },
    );
  }
}
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, quantity = 1 } = body;
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
        { success: false, message: "Please sign in to add items to your cart" },
        { status: 401, headers: NO_CACHE_HEADERS },
      );
    }
    const addRes = await fetch(`${API_BASE}/api/v1/cart`, {
      method: "POST",
      headers: {
        token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId }),
    });
    const addData = await addRes.json();
    if (!addRes.ok) {
      return NextResponse.json(
        {
          success: false,
          message: addData.message || "Failed to add product to cart",
        },
        { status: addRes.status, headers: NO_CACHE_HEADERS },
      );
    }
    if (quantity > 1) {
      try {
        await fetch(`${API_BASE}/api/v1/cart/${productId}`, {
          method: "PUT",
          headers: {
            token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ count: quantity }),
        });
      } catch (err) {
        console.error("Failed to update extra quantity on add:", err);
      }
    }
    const getRes = await fetch(`${API_BASE}/api/v1/cart`, {
      headers: { token },
      cache: "no-store",
    });
    let finalCart: Cart;
    if (getRes.ok) {
      const getData = await getRes.json();
      finalCart = {
        cartId: getData.cartId || getData.data?._id || null,
        cartOwner: getData.data?.cartOwner,
        products: getData.data?.products || [],
        totalCartPrice: getData.data?.totalCartPrice || 0,
        numOfCartItems:
          getData.numOfCartItems || getData.data?.products?.length || 0,
        updatedAt: getData.data?.updatedAt,
      };
    } else {
      finalCart = {
        cartId: addData.cartId || addData.data?._id || null,
        cartOwner: addData.data?.cartOwner,
        products: [],
        totalCartPrice: addData.data?.totalCartPrice || 0,
        numOfCartItems: addData.numOfCartItems || 1,
        updatedAt: addData.data?.updatedAt,
      };
    }
    return NextResponse.json(
      {
        success: true,
        message: addData.message || "Product added successfully to your cart",
        data: finalCart,
      },
      { headers: NO_CACHE_HEADERS },
    );
  } catch (error) {
    console.error("Cart POST proxy error:", error);
    return NextResponse.json(
      { success: false, message: "An unexpected network error occurred" },
      { status: 500, headers: NO_CACHE_HEADERS },
    );
  }
}
export async function DELETE() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthenticated" },
        { status: 401, headers: NO_CACHE_HEADERS },
      );
    }
    const response = await fetch(`${API_BASE}/api/v1/cart`, {
      method: "DELETE",
      headers: { token },
    });
    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Failed to clear cart",
        },
        { status: response.status, headers: NO_CACHE_HEADERS },
      );
    }
    return NextResponse.json(
      {
        success: true,
        message: "Cart cleared successfully",
        data: emptyCartPayload(),
      },
      { headers: NO_CACHE_HEADERS },
    );
  } catch (error) {
    console.error("Cart clear proxy error:", error);
    return NextResponse.json(
      { success: false, message: "An unexpected network error occurred" },
      { status: 500, headers: NO_CACHE_HEADERS },
    );
  }
}
