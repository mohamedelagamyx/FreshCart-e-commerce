import { Suspense } from "react";
import ProductsView from "@/Templates/ProductsView";
import ProductSkeleton from "@/Components/ProductSkeleton";
export const metadata = {
  title: "Products & Grocery Catalog - FreshCart",
  description:
    "Browse all grocery items, fresh produce, household essentials, and daily necessities on FreshCart with multi-faceted search and filters.",
};
function CatalogFallback() {
  return (
    <div className="w-full py-8">
      <div className="h-8 w-64 bg-gray-200 rounded-lg animate-pulse mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductSkeleton key={`catalog-skel-${i}`} />
        ))}
      </div>
    </div>
  );
}
export default function ProductsPage() {
  return (
    <div className="w-full">
      <Suspense fallback={<CatalogFallback />}>
        <ProductsView
          initialLimit={40}
          pageTitle="All Products"
          pageSubtitle="Explore our complete product collection"
        />
      </Suspense>
    </div>
  );
}
