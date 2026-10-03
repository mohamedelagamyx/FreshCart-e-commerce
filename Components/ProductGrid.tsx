"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Product, PaginationMetadata } from "@/types/product.types";
import ProductCard from "./ProductCard";
import styles from "./Home.module.css";
import ProductSkeleton from "./ProductSkeleton";
import ProductSearch from "./ProductSearch";
import Pagination from "./Pagination";
import {
  IconAlertTriangle,
  IconRefresh,
  IconMoodEmpty,
} from "@tabler/icons-react";
interface ProductGridProps {
  initialLimit?: number;
  initialCategory?: string;
  title?: string;
  showToolbar?: boolean;
}
export default function ProductGrid({
  initialLimit = 25,
  initialCategory = "",
  title = "Featured Products",
  showToolbar = true,
}: ProductGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get("search") || "";
  const urlPage = parseInt(searchParams.get("page") || "1", 10);
  const safeInitialPage = isNaN(urlPage) || urlPage < 1 ? 1 : urlPage;
  const urlSort = searchParams.get("sort") || "";
  const [searchTerm, setSearchTerm] = useState(urlSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(urlSearch);
  const [currentPage, setCurrentPage] = useState(safeInitialPage);
  const [sortBy, setSortBy] = useState(urlSort);
  const [products, setProducts] = useState<Product[]>([]);
  const [metadata, setMetadata] = useState<PaginationMetadata | null>(null);
  const [totalResults, setTotalResults] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch((prev) => {
        if (searchTerm !== prev) {
          setCurrentPage(1);
        }
        return searchTerm;
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch.trim()) {
      params.set("search", debouncedSearch.trim());
    }
    if (currentPage > 1) {
      params.set("page", String(currentPage));
    }
    if (sortBy) {
      params.set("sort", sortBy);
    }
    const newQuery = params.toString();
    const currentQuery = searchParams.toString();
    if (newQuery !== currentQuery) {
      const targetUrl = newQuery ? `?${newQuery}` : window.location.pathname;
      router.replace(targetUrl, { scroll: false });
    }
  }, [debouncedSearch, currentPage, sortBy, router, searchParams]);
  const fetchProducts = useCallback(
    async (signal?: AbortSignal) => {
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        params.set("page", String(currentPage));
        params.set("limit", String(initialLimit));
        if (sortBy) params.set("sort", sortBy);
        if (initialCategory) params.set("category", initialCategory);
        if (debouncedSearch.trim())
          params.set("keyword", debouncedSearch.trim());
        const response = await fetch(`/api/products?${params.toString()}`, {
          signal,
        });
        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to load products");
        }
        setProducts(data.data || []);
        setMetadata(data.metadata || null);
        setTotalResults(data.results ?? null);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
        console.error("Product fetch error:", err);
        setError(
          "Unable to connect to the catalog server. Please check your internet connection.",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [currentPage, initialLimit, sortBy, initialCategory, debouncedSearch],
  );
  useEffect(() => {
    const controller = new AbortController();
    fetchProducts(controller.signal);
    return () => controller.abort();
  }, [fetchProducts]);
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 750, behavior: "smooth" });
  };
  return (
    <section id="home-featured" className={styles.featured}>
      <div className={styles.sectionHeading}>
        <h2>
          {title === "Featured Products" ? (
            <>
              Featured <span>Products</span>
            </>
          ) : (
            title
          )}
        </h2>
      </div>

      {showToolbar && (
        <ProductSearch
          searchTerm={searchTerm}
          onSearchChange={(val) => {
            setSearchTerm(val);
          }}
          sortBy={sortBy}
          onSortChange={(val) => {
            setSortBy(val);
            setCurrentPage(1);
          }}
          totalFilteredCount={totalResults ?? products.length}
        />
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center my-8">
          <div className="inline-flex p-3 bg-red-100 text-red-600 rounded-full mb-3">
            <IconAlertTriangle size={24} />
          </div>
          <h3 className="text-lg font-bold text-red-800 mb-1">
            Catalog Connection Error
          </h3>
          <p className="text-sm text-red-600 max-w-md mx-auto mb-4">{error}</p>
          <button
            onClick={() => fetchProducts()}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold text-sm shadow-md transition-all cursor-pointer"
          >
            <IconRefresh size={16} />
            <span>Try Again</span>
          </button>
        </div>
      )}

      {isLoading && (
        <div className="catalog-grid">
          {Array.from({ length: 15 }).map((_, i) => (
            <ProductSkeleton key={`skeleton-${i}`} />
          ))}
        </div>
      )}

      {!isLoading && !error && products.length === 0 && debouncedSearch && (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center my-8 shadow-sm">
          <div className="inline-flex p-4 bg-emerald-50 text-emerald-600 rounded-full mb-4">
            <IconMoodEmpty size={36} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            No matching products found
          </h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
            We could not find any items matching &ldquo;{debouncedSearch}
            &rdquo;. Try checking for spelling errors, using simpler keywords,
            or browsing our full catalog.
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setCurrentPage(1);
            }}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm shadow-md transition-all cursor-pointer"
          >
            Clear Search Filter
          </button>
        </div>
      )}

      {!isLoading && !error && products.length === 0 && !debouncedSearch && (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center my-8 shadow-sm">
          <div className="inline-flex p-4 bg-emerald-50 text-emerald-600 rounded-full mb-4">
            <IconMoodEmpty size={36} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            No products currently available
          </h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
            Our grocery shelves are being restocked. Please check back shortly
            or refresh the page.
          </p>
          <button
            onClick={() => fetchProducts()}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm shadow-md transition-all cursor-pointer"
          >
            Refresh Catalog
          </button>
        </div>
      )}

      {!isLoading && !error && products.length > 0 && (
        <>
          <div className="catalog-grid">
            {products.map((product) => (
              <ProductCard
                key={product.id || product._id}
                product={product}
                variant="related"
              />
            ))}
          </div>

          {metadata && metadata.numberOfPages > 1 && (
            <Pagination
              currentPage={currentPage}
              numberOfPages={metadata.numberOfPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </section>
  );
}
