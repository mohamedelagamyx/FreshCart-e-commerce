"use client";
import { useEffect, useState, useCallback } from "react";
import {
  Product,
  ProductCategory,
  PaginationMetadata,
} from "@/types/product.types";
import ProductCard from "@/Components/ProductCard";
import StoreHeading from "@/Components/StoreHeading";
import { IconPackage } from "@tabler/icons-react";
import ProductSkeleton from "@/Components/ProductSkeleton";
import ProductFilters from "@/Components/ProductFilters";
import Pagination from "@/Components/Pagination";
import { useProductFilters } from "@/hooks/useProductFilters";
import { IconFilter } from "@tabler/icons-react";
interface ProductsViewProps {
  initialLimit?: number;
  pageTitle?: string;
  pageSubtitle?: string;
}
export default function ProductsView({
  initialLimit = 40,
  pageTitle = "All Products",
  pageSubtitle = "Explore our complete product collection",
}: ProductsViewProps) {
  const {
    filters,
    searchInput,
    setSearchInput,
    setCategory,
    setBrand,
    setPriceRange,
    setSort,
    setPage,
    clearAllFilters,
    removeFilter,
    activeFiltersCount,
  } = useProductFilters();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [metadata, setMetadata] = useState<PaginationMetadata | null>(null);
  const [, setTotalResults] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    async function loadCategoryNames() {
      try {
        const response = await fetch("/api/categories", {
          signal: controller.signal,
        });
        const data = await response.json();
        if (response.ok && data.success && Array.isArray(data.data)) {
          setCategories(data.data);
        }
      } catch {}
    }
    loadCategoryNames();
    return () => controller.abort();
  }, []);
  const fetchProducts = useCallback(
    async (signal?: AbortSignal) => {
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        params.set("page", String(filters.page));
        params.set("limit", String(initialLimit));
        if (filters.sort) params.set("sort", filters.sort);
        if (filters.category) params.set("category", filters.category);
        if (filters.brand) params.set("brand", filters.brand);
        if (filters.minPrice) params.set("minPrice", filters.minPrice);
        if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
        if (filters.search.trim()) params.set("keyword", filters.search.trim());
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
        console.error("Products fetch error:", err);
        setError(
          "Unable to connect to the catalog server. Please check your internet connection.",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [
      filters.page,
      filters.sort,
      filters.category,
      filters.brand,
      filters.minPrice,
      filters.maxPrice,
      filters.search,
      initialLimit,
    ],
  );
  useEffect(() => {
    const controller = new AbortController();
    fetchProducts(controller.signal);
    return () => controller.abort();
  }, [fetchProducts]);
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 200, behavior: "smooth" });
  };
  const hasActiveFilters = activeFiltersCount > 0;
  const selectedCategoryName =
    categories.find((category) => category._id === filters.category)?.name ||
    products.find((product) => product.category?._id === filters.category)
      ?.category.name;
  const headingTitle = filters.category
    ? selectedCategoryName || "Category Products"
    : pageTitle;
  const headingSubtitle = filters.category
    ? selectedCategoryName
      ? `Explore our ${selectedCategoryName} collection`
      : "Explore products in this category"
    : pageSubtitle;
  return (
    <div className="store-screen">
      <StoreHeading
        title={headingTitle}
        subtitle={headingSubtitle}
        icon={<IconPackage size={32} />}
        banner
      />
      <div className="store-container store-body">
        <div className="flex items-center justify-between gap-4 mb-6">
          <p className="store-muted">Showing {products.length} products</p>
          <button
            className="store-muted inline-flex gap-2 items-center"
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            aria-expanded={mobileDrawerOpen}
          >
            <IconFilter size={16} />
            Filters{activeFiltersCount > 0 && ` (${activeFiltersCount})`}
          </button>
        </div>
        {mobileDrawerOpen && (
          <div className="store-card p-6 mb-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="catalog-search" className="store-muted">
                  Search products
                </label>
                <input
                  id="catalog-search"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search products..."
                  className="form-control w-full mt-2 mb-4"
                />
                <label htmlFor="catalog-sort" className="store-muted">
                  Sort products
                </label>
                <select
                  id="catalog-sort"
                  value={filters.sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="form-control w-full mt-2"
                >
                  <option value="">Featured</option>
                  <option value="price">Price: Low to High</option>
                  <option value="-price">Price: High to Low</option>
                  <option value="-ratingsAverage">Top Rated</option>
                  <option value="-createdAt">Newest Arrivals</option>
                </select>
              </div>
              <ProductFilters
                activeCategory={filters.category}
                activeBrand={filters.brand}
                minPrice={filters.minPrice}
                maxPrice={filters.maxPrice}
                activeSearch={filters.search}
                activeSort={filters.sort}
                onSelectCategory={setCategory}
                onSelectBrand={setBrand}
                onApplyPriceRange={setPriceRange}
                onClearAll={clearAllFilters}
                onRemoveFilter={removeFilter}
              />
            </div>
          </div>
        )}
        {hasActiveFilters && (
          <button className="store-link mb-6" onClick={clearAllFilters}>
            Clear filters ({activeFiltersCount})
          </button>
        )}
        {error && (
          <div className="store-error">
            <p>{error}</p>
            <button
              onClick={() => fetchProducts()}
              className="store-button mt-4"
            >
              Try Again
            </button>
          </div>
        )}
        {isLoading ? (
          <div className="catalog-grid">
            {Array.from({ length: 15 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : !error && products.length > 0 ? (
          <div className="catalog-grid">
            {products.map((product) => (
              <ProductCard
                key={product._id || product.id}
                product={product}
                variant="related"
              />
            ))}
          </div>
        ) : (
          !error && (
            <div className="store-card store-empty">
              <h2>No products found</h2>
              <p>Try another search or clear your filters.</p>
              <button className="store-button" onClick={clearAllFilters}>
                Clear Filters
              </button>
            </div>
          )
        )}
        {metadata && metadata.numberOfPages > 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={filters.page}
              numberOfPages={metadata.numberOfPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}
