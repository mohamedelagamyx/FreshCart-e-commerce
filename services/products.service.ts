import {
  Product,
  ProductDetailsApiResponse,
  ProductsApiResponse,
} from "@/types/product.types";
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://ecommerce.routemisr.com";
export async function getProductById(id: string): Promise<Product | null> {
  if (!id || typeof id !== "string") {
    return null;
  }
  try {
    const response = await fetch(
      `${API_BASE}/api/v1/products/${encodeURIComponent(id)}`,
      {
        next: { revalidate: 60 },
      },
    );
    if (response.status === 404 || response.status === 400) {
      return null;
    }
    if (!response.ok) {
      console.error(
        `Upstream product fetch failed with status ${response.status}`,
      );
      return null;
    }
    const json: ProductDetailsApiResponse = await response.json();
    return json.data || null;
  } catch (error) {
    console.error("Error in getProductById:", error);
    return null;
  }
}
export async function getRelatedProducts(
  categoryId: string,
  currentProductId: string,
  limit: number = 6,
): Promise<Product[]> {
  if (!categoryId) {
    return [];
  }
  try {
    const query = new URLSearchParams();
    query.set("category[in]", categoryId);
    query.set("limit", String(limit));
    const response = await fetch(
      `${API_BASE}/api/v1/products?${query.toString()}`,
      {
        next: { revalidate: 60 },
      },
    );
    if (!response.ok) {
      return [];
    }
    const json: ProductsApiResponse = await response.json();
    const items = json.data || [];
    return items
      .filter((item) => (item._id || item.id) !== currentProductId)
      .slice(0, limit);
  } catch (error) {
    console.error("Error in getRelatedProducts:", error);
    return [];
  }
}
