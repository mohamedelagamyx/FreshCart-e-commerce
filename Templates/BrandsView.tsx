"use client";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import StoreHeading from "@/Components/StoreHeading";
import Link from "next/link";
import { ProductBrand } from "@/types/product.types";
import { IconRefresh, IconBuildingStore } from "@tabler/icons-react";
export default function BrandsView() {
  const [brands, setBrands] = useState<ProductBrand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [failedImageIds, setFailedImageIds] = useState<Record<string, boolean>>(
    {},
  );
  const fetchBrands = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/brands", { signal });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to load brands");
      }
      setBrands(json.data || []);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") {
        return;
      }
      console.error("Brands fetch error:", err);
      setError(
        "Unable to connect to the brands directory. Please check your internet connection.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    fetchBrands(controller.signal);
    return () => controller.abort();
  }, [fetchBrands]);
  const handleImageError = (id: string) => {
    setFailedImageIds((prev) => ({ ...prev, [id]: true }));
  };
  return (
    <div className="store-screen">
      <StoreHeading
        title="Top Brands"
        breadcrumb="Brands"
        subtitle="Shop from your favorite brands"
        icon={<IconBuildingStore size={32} />}
        banner
        purple
      />
      <div className="store-container store-body">
        {error && (
          <div className="store-error">
            <p>{error}</p>
            <button onClick={() => fetchBrands()} className="store-button mt-4">
              <IconRefresh size={16} />
              Try Again
            </button>
          </div>
        )}
        <div className="directory-grid directory-brands">
          {isLoading
            ? Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="store-card directory-card animate-pulse"
                >
                  <div className="directory-image" />
                  <div className="h-4 bg-gray-100 mt-5 rounded" />
                </div>
              ))
            : !error &&
              brands.map((brand) => (
                <Link
                  key={brand._id}
                  href={`/products?brand=${brand._id}`}
                  className="store-card directory-card"
                >
                  <div className="directory-image">
                    {brand.image && !failedImageIds[brand._id] ? (
                      <Image
                        src={brand.image}
                        alt={brand.name}
                        fill
                        sizes="(max-width: 767px) 45vw, 15vw"
                        onError={() => handleImageError(brand._id)}
                      />
                    ) : (
                      <IconBuildingStore size={48} className="text-gray-400" />
                    )}
                  </div>
                  <h2>{brand.name}</h2>
                </Link>
              ))}
        </div>
        {!isLoading && !error && brands.length === 0 && (
          <div className="store-empty">
            <h2>No brands found</h2>
            <button className="store-button" onClick={() => fetchBrands()}>
              Refresh
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
