import { NextResponse } from "next/server";
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://ecommerce.routemisr.com";
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawPage = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "16";
    const sort = searchParams.get("sort") || "";
    const category =
      searchParams.get("category") || searchParams.get("category[in]") || "";
    const brand = searchParams.get("brand") || "";
    const minPrice =
      searchParams.get("minPrice") || searchParams.get("price[gte]") || "";
    const maxPrice =
      searchParams.get("maxPrice") || searchParams.get("price[lte]") || "";
    const keyword =
      searchParams.get("keyword") || searchParams.get("search") || "";
    const parsedPage = parseInt(rawPage, 10);
    const safePage =
      isNaN(parsedPage) || parsedPage < 1 ? "1" : String(parsedPage);
    const query = new URLSearchParams();
    query.set("page", safePage);
    query.set("limit", limit);
    if (sort) query.set("sort", sort);
    if (category) query.set("category[in]", category);
    if (brand) query.set("brand", brand);
    if (minPrice) query.set("price[gte]", minPrice);
    if (maxPrice) query.set("price[lte]", maxPrice);
    if (keyword) query.set("keyword", keyword);
    const response = await fetch(
      `${API_BASE}/api/v1/products?${query.toString()}`,
      {
        next: { revalidate: 60 },
      },
    );
    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Failed to fetch products",
        },
        { status: response.status },
      );
    }
    let products = data.data || [];
    if (keyword) {
      const q = keyword.toLowerCase().trim();
      products = products.filter(
        (p: {
          title?: string;
          category?: {
            name?: string;
          };
          brand?: {
            name?: string;
          };
        }) =>
          p.title?.toLowerCase().includes(q) ||
          p.category?.name?.toLowerCase().includes(q) ||
          p.brand?.name?.toLowerCase().includes(q),
      );
    }
    const pageSize = parseInt(limit, 10) || 16;
    const computedPages = keyword
      ? Math.ceil(products.length / pageSize) || 1
      : data.metadata?.numberOfPages;
    return NextResponse.json({
      success: true,
      results: keyword ? products.length : data.results,
      metadata: {
        ...data.metadata,
        numberOfPages: computedPages,
      },
      data: products,
    });
  } catch (error) {
    console.error("Products API route error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected network error occurred while fetching products",
      },
      { status: 500 },
    );
  }
}
