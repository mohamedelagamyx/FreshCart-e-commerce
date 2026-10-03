import { Suspense } from "react";
import type { Metadata } from "next";
import HeroSlider from "@/Components/HeroSlider";
import FeatureBadges from "@/Components/FeatureBadges";
import CategorySlider from "@/Components/CategorySlider";
import PromoBanners from "@/Components/PromoBanners";
import ProductGrid from "@/Components/ProductGrid";
import ProductSkeleton from "@/Components/ProductSkeleton";
import NewsletterBanner from "@/Components/NewsletterBanner";
export const metadata: Metadata = {
  title: "FreshCart - Fresh Online Groceries & Daily Essentials",
  description:
    "Shop organic vegetables, fresh fruits, dairy, bakery, snacks, and daily household essentials online with fast delivery.",
};
function ProductGridFallback() {
  return (
    <div className="w-full my-8">
      <div className="h-8 w-64 bg-gray-200 rounded-lg animate-pulse mb-6" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: 15 }).map((_, i) => (
          <ProductSkeleton key={`home-skel-${i}`} />
        ))}
      </div>
    </div>
  );
}
export default function HomePage() {
  return (
    <div className="w-full bg-white">
      <div className="bg-gray-50 py-6">
        <div className="store-container">
          <HeroSlider />

          <FeatureBadges />
        </div>
      </div>
      <div className="store-container">
        <CategorySlider />

        <PromoBanners />

        <Suspense fallback={<ProductGridFallback />}>
          <ProductGrid
            initialLimit={40}
            title="Featured Products"
            showToolbar={false}
          />
        </Suspense>

        <NewsletterBanner />
      </div>
    </div>
  );
}
