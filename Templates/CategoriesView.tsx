"use client";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import StoreHeading from "@/Components/StoreHeading";
import Link from "next/link";
import { ProductCategory } from "@/types/product.types";
import { IconRefresh, IconCategory } from "@tabler/icons-react";
export default function CategoriesView() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [failedImageIds, setFailedImageIds] = useState<Record<string, boolean>>(
    {},
  );
  const fetchCategories = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/categories", { signal });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to load categories");
      }
      setCategories(json.data || []);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") {
        return;
      }
      console.error("Categories fetch error:", err);
      setError(
        "Unable to connect to the categories service. Please check your internet connection.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    fetchCategories(controller.signal);
    return () => controller.abort();
  }, [fetchCategories]);
  const handleImageError = (id: string) => {
    setFailedImageIds((prev) => ({ ...prev, [id]: true }));
  };
  return (
    <div className="store-screen">
      <StoreHeading
        title="All Categories"
        breadcrumb="Categories"
        subtitle="Browse our wide range of product categories"
        icon={<IconCategory size={32} />}
        banner
      />
      <div className="store-container store-body">
        {error && (
          <div className="store-error">
            <p>{error}</p>
            <button
              onClick={() => fetchCategories()}
              className="store-button mt-4"
            >
              <IconRefresh size={16} />
              Try Again
            </button>
          </div>
        )}
        <div className="directory-grid ">
          {isLoading
            ? Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="store-card directory-card animate-pulse"
                >
                  <div className="directory-image" />
                  <div className="h-4 bg-gray-100 mt-5 rounded" />
                </div>
              ))
            : !error &&
              categories.map((category) => (
                <Link
                  key={category._id}
                  href={`/products?category=${category._id}`}
                  className="store-card directory-card"
                >
                  <div className="directory-image">
                    {category.image && !failedImageIds[category._id] ? (
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        sizes="(max-width: 767px) 45vw, 18vw"
                        onError={() => handleImageError(category._id)}
                      />
                    ) : (
                      <IconCategory size={48} className="text-gray-400" />
                    )}
                  </div>
                  <h2>{category.name}</h2>
                  <span>View Subcategories →</span>
                </Link>
              ))}
        </div>
        {!isLoading && !error && categories.length === 0 && (
          <div className="store-empty">
            <h2>No categories found</h2>
            <button className="store-button" onClick={() => fetchCategories()}>
              Refresh
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
