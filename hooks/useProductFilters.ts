"use client";
import {
  useState,
  useEffect,
  useCallback,
  useTransition,
  useMemo,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
export interface ProductFilterState {
  search: string;
  category: string;
  brand: string;
  minPrice: string;
  maxPrice: string;
  sort: string;
  page: number;
}
export function useProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const urlSearch =
    searchParams.get("search") || searchParams.get("keyword") || "";
  const urlCategory =
    searchParams.get("category") || searchParams.get("category[in]") || "";
  const urlBrand = searchParams.get("brand") || "";
  const urlMinPrice =
    searchParams.get("minPrice") || searchParams.get("price[gte]") || "";
  const urlMaxPrice =
    searchParams.get("maxPrice") || searchParams.get("price[lte]") || "";
  const urlSort = searchParams.get("sort") || "";
  const urlPage = parseInt(searchParams.get("page") || "1", 10);
  const safePage = isNaN(urlPage) || urlPage < 1 ? 1 : urlPage;
  const [searchInput, setSearchInput] = useState(urlSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(urlSearch);
  useEffect(() => {
    setSearchInput(urlSearch);
    setDebouncedSearch(urlSearch);
  }, [urlSearch]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);
  const updateUrl = useCallback(
    (updates: Partial<ProductFilterState>) => {
      const params = new URLSearchParams(searchParams.toString());
      if ("search" in updates) {
        if (updates.search && updates.search.trim()) {
          params.set("search", updates.search.trim());
          params.delete("keyword");
        } else {
          params.delete("search");
          params.delete("keyword");
        }
        params.delete("page");
      }
      if ("category" in updates) {
        if (updates.category) {
          params.set("category", updates.category);
          params.delete("category[in]");
        } else {
          params.delete("category");
          params.delete("category[in]");
        }
        params.delete("page");
      }
      if ("brand" in updates) {
        if (updates.brand) {
          params.set("brand", updates.brand);
        } else {
          params.delete("brand");
        }
        params.delete("page");
      }
      if ("minPrice" in updates) {
        if (updates.minPrice) {
          params.set("minPrice", updates.minPrice);
          params.delete("price[gte]");
        } else {
          params.delete("minPrice");
          params.delete("price[gte]");
        }
        params.delete("page");
      }
      if ("maxPrice" in updates) {
        if (updates.maxPrice) {
          params.set("maxPrice", updates.maxPrice);
          params.delete("price[lte]");
        } else {
          params.delete("maxPrice");
          params.delete("price[lte]");
        }
        params.delete("page");
      }
      if ("sort" in updates) {
        if (updates.sort) {
          params.set("sort", updates.sort);
        } else {
          params.delete("sort");
        }
      }
      if ("page" in updates) {
        if (updates.page && updates.page > 1) {
          params.set("page", String(updates.page));
        } else {
          params.delete("page");
        }
      }
      const queryString = params.toString();
      const currentQuery = searchParams.toString();
      if (queryString !== currentQuery) {
        const newUrl = queryString
          ? `?${queryString}`
          : window.location.pathname;
        startTransition(() => {
          router.replace(newUrl, { scroll: false });
        });
      }
    },
    [router, searchParams],
  );
  useEffect(() => {
    if (debouncedSearch !== urlSearch) {
      updateUrl({ search: debouncedSearch });
    }
  }, [debouncedSearch, urlSearch, updateUrl]);
  const setCategory = useCallback(
    (catId: string) => {
      updateUrl({ category: catId === urlCategory ? "" : catId });
    },
    [updateUrl, urlCategory],
  );
  const setBrand = useCallback(
    (brandId: string) => {
      updateUrl({ brand: brandId === urlBrand ? "" : brandId });
    },
    [updateUrl, urlBrand],
  );
  const setPriceRange = useCallback(
    (min: string, max: string) => {
      updateUrl({ minPrice: min, maxPrice: max });
    },
    [updateUrl],
  );
  const setSort = useCallback(
    (sortOption: string) => {
      updateUrl({ sort: sortOption });
    },
    [updateUrl],
  );
  const setPage = useCallback(
    (pageNumber: number) => {
      updateUrl({ page: pageNumber });
    },
    [updateUrl],
  );
  const clearAllFilters = useCallback(() => {
    setSearchInput("");
    setDebouncedSearch("");
    startTransition(() => {
      router.replace(window.location.pathname, { scroll: false });
    });
  }, [router]);
  const removeFilter = useCallback(
    (key: "search" | "category" | "brand" | "price" | "sort") => {
      if (key === "search") {
        setSearchInput("");
        updateUrl({ search: "" });
      } else if (key === "category") {
        updateUrl({ category: "" });
      } else if (key === "brand") {
        updateUrl({ brand: "" });
      } else if (key === "price") {
        updateUrl({ minPrice: "", maxPrice: "" });
      } else if (key === "sort") {
        updateUrl({ sort: "" });
      }
    },
    [updateUrl],
  );
  const activeFiltersCount = useMemo(
    () =>
      (urlSearch ? 1 : 0) +
      (urlCategory ? 1 : 0) +
      (urlBrand ? 1 : 0) +
      (urlMinPrice || urlMaxPrice ? 1 : 0) +
      (urlSort ? 1 : 0),
    [urlSearch, urlCategory, urlBrand, urlMinPrice, urlMaxPrice, urlSort],
  );
  const filters = useMemo<ProductFilterState>(
    () => ({
      search: urlSearch,
      category: urlCategory,
      brand: urlBrand,
      minPrice: urlMinPrice,
      maxPrice: urlMaxPrice,
      sort: urlSort,
      page: safePage,
    }),
    [
      urlSearch,
      urlCategory,
      urlBrand,
      urlMinPrice,
      urlMaxPrice,
      urlSort,
      safePage,
    ],
  );
  return {
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
  };
}
