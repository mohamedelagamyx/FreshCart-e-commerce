import { Suspense } from "react";
import CategoriesView from "@/Templates/CategoriesView";
export const metadata = {
  title: "Categories - FreshCart",
  description:
    "Explore FreshCart supermarket departments: fresh fruits, vegetables, dairy, bakery, snacks, and daily essentials.",
};
function CategoriesFallback() {
  return (
    <div className="w-full">
      <div className="h-8 w-64 bg-gray-200 rounded-lg animate-pulse mx-auto mb-10" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={`skel-${i}`}
            className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col items-center gap-3 animate-pulse"
          >
            <div className="w-28 h-28 rounded-full bg-gray-200" />
            <div className="h-4 w-24 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
export default function CategoriesPage() {
  return (
    <div className="w-full">
      <Suspense fallback={<CategoriesFallback />}>
        <CategoriesView />
      </Suspense>
    </div>
  );
}
