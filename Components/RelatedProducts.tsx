import { getRelatedProducts } from "@/services/products.service";
import ProductCard from "@/Components/ProductCard";
import RelatedProductsCarousel from "@/Components/RelatedProductsCarousel";
export default async function RelatedProducts({
  categoryId,
  currentProductId,
}: {
  categoryId?: string;
  currentProductId: string;
}) {
  if (!categoryId) return null;
  const products = await getRelatedProducts(categoryId, currentProductId, 12);
  if (!products.length) return null;
  return (
    <RelatedProductsCarousel>
      {products.map((product) => (
        <ProductCard
          key={product._id || product.id}
          product={product}
          variant="related"
        />
      ))}
    </RelatedProductsCarousel>
  );
}
