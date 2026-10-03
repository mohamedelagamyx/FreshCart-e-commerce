import { Suspense } from "react";
import BrandsView from "@/Templates/BrandsView";
export const metadata = {
  title: "Brands - FreshCart",
  description:
    "Shop grocery items and household essentials by your favorite certified food, beverage, and household brands on FreshCart.",
};
function BrandsFallback() {
  return (
    <div className="w-full">
      <div className="h-8 w-64 bg-gray-200 rounded-lg animate-pulse mx-auto mb-10" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={`brand-skel-${i}`}
            className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col items-center gap-3 animate-pulse"
          >
            <div className="w-20 h-20 rounded-xl bg-gray-200" />
            <div className="h-4 w-20 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
export default function BrandsPage() {
  return (
    <div className="w-full">
      <Suspense fallback={<BrandsFallback />}>
        <BrandsView />
      </Suspense>
    </div>
  );
}
