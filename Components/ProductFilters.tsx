"use client";
import { useState, useEffect } from "react";
import {
  IconFilter,
  IconX,
  IconChevronDown,
  IconChevronUp,
  IconRotate,
  IconSearch,
} from "@tabler/icons-react";
import { ProductCategory, ProductBrand } from "@/types/product.types";
interface ProductFiltersProps {
  categories?: ProductCategory[];
  brands?: ProductBrand[];
  activeCategory: string;
  activeBrand: string;
  minPrice: string;
  maxPrice: string;
  activeSearch: string;
  activeSort: string;
  onSelectCategory: (catId: string) => void;
  onSelectBrand: (brandId: string) => void;
  onApplyPriceRange: (min: string, max: string) => void;
  onClearAll: () => void;
  onRemoveFilter: (
    key: "search" | "category" | "brand" | "price" | "sort",
  ) => void;
  className?: string;
}
export default function ProductFilters({
  categories: initialCategories,
  brands: initialBrands,
  activeCategory,
  activeBrand,
  minPrice,
  maxPrice,
  activeSearch,
  onSelectCategory,
  onSelectBrand,
  onApplyPriceRange,
  onClearAll,
  onRemoveFilter,
  className = "",
}: ProductFiltersProps) {
  const [categories, setCategories] = useState<ProductCategory[]>(
    initialCategories || [],
  );
  const [brands, setBrands] = useState<ProductBrand[]>(initialBrands || []);
  const [localMinPrice, setLocalMinPrice] = useState(minPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice);
  const [categoriesOpen, setCategoriesOpen] = useState(true);
  const [brandsOpen, setBrandsOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);
  useEffect(() => {
    setLocalMinPrice(minPrice);
  }, [minPrice]);
  useEffect(() => {
    setLocalMaxPrice(maxPrice);
  }, [maxPrice]);
  useEffect(() => {
    if (!initialCategories || initialCategories.length === 0) {
      fetch("/api/categories")
        .then((res) => res.json())
        .then((json) => {
          if (json.success && Array.isArray(json.data)) {
            setCategories(json.data);
          }
        })
        .catch((err) => console.error("Filter categories load error:", err));
    }
  }, [initialCategories]);
  useEffect(() => {
    if (!initialBrands || initialBrands.length === 0) {
      fetch("/api/brands")
        .then((res) => res.json())
        .then((json) => {
          if (json.success && Array.isArray(json.data)) {
            setBrands(json.data);
          }
        })
        .catch((err) => console.error("Filter brands load error:", err));
    }
  }, [initialBrands]);
  const handlePriceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApplyPriceRange(localMinPrice, localMaxPrice);
  };
  const selectedCategoryObj = categories.find((c) => c._id === activeCategory);
  const selectedBrandObj = brands.find((b) => b._id === activeBrand);
  const hasAnyFilter = Boolean(
    activeCategory || activeBrand || minPrice || maxPrice || activeSearch,
  );
  return (
    <div className={`space-y-6 ${className}`}>
      {hasAnyFilter && (
        <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
              <IconFilter size={14} />
              <span>Active Filters</span>
            </span>
            <button
              onClick={onClearAll}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <IconRotate size={13} />
              <span>Reset All</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {activeSearch && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white text-emerald-800 text-xs font-medium border border-emerald-200 shadow-2xs">
                <IconSearch size={12} />
                <span className="truncate max-w-[120px]">
                  &quot;{activeSearch}&quot;
                </span>
                <button
                  onClick={() => onRemoveFilter("search")}
                  className="hover:text-red-500 cursor-pointer ml-0.5"
                  aria-label="Remove search filter"
                >
                  <IconX size={13} />
                </button>
              </span>
            )}

            {selectedCategoryObj && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white text-emerald-800 text-xs font-medium border border-emerald-200 shadow-2xs">
                <span>{selectedCategoryObj.name}</span>
                <button
                  onClick={() => onRemoveFilter("category")}
                  className="hover:text-red-500 cursor-pointer ml-0.5"
                  aria-label="Remove category filter"
                >
                  <IconX size={13} />
                </button>
              </span>
            )}

            {selectedBrandObj && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white text-emerald-800 text-xs font-medium border border-emerald-200 shadow-2xs">
                <span>{selectedBrandObj.name}</span>
                <button
                  onClick={() => onRemoveFilter("brand")}
                  className="hover:text-red-500 cursor-pointer ml-0.5"
                  aria-label="Remove brand filter"
                >
                  <IconX size={13} />
                </button>
              </span>
            )}

            {(minPrice || maxPrice) && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white text-emerald-800 text-xs font-medium border border-emerald-200 shadow-2xs">
                <span>
                  {minPrice ? `${minPrice} EGP` : "0"} –{" "}
                  {maxPrice ? `${maxPrice} EGP` : "Max"}
                </span>
                <button
                  onClick={() => onRemoveFilter("price")}
                  className="hover:text-red-500 cursor-pointer ml-0.5"
                  aria-label="Remove price filter"
                >
                  <IconX size={13} />
                </button>
              </span>
            )}
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs">
        <button
          onClick={() => setCategoriesOpen(!categoriesOpen)}
          className="w-full flex items-center justify-between text-left font-bold text-gray-900 text-sm cursor-pointer select-none"
        >
          <span>Categories</span>
          {categoriesOpen ? (
            <IconChevronUp size={16} />
          ) : (
            <IconChevronDown size={16} />
          )}
        </button>

        {categoriesOpen && (
          <div className="mt-3.5 space-y-1.5 max-h-56 overflow-y-auto pr-1">
            {categories.map((cat) => {
              const isSelected = cat._id === activeCategory;
              return (
                <button
                  key={cat._id}
                  onClick={() => onSelectCategory(cat._id)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? "bg-emerald-50 text-emerald-800 font-bold border border-emerald-200"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs">
        <button
          onClick={() => setBrandsOpen(!brandsOpen)}
          className="w-full flex items-center justify-between text-left font-bold text-gray-900 text-sm cursor-pointer select-none"
        >
          <span>Brands</span>
          {brandsOpen ? (
            <IconChevronUp size={16} />
          ) : (
            <IconChevronDown size={16} />
          )}
        </button>

        {brandsOpen && (
          <div className="mt-3.5 space-y-1.5 max-h-56 overflow-y-auto pr-1">
            {brands.map((brand) => {
              const isSelected = brand._id === activeBrand;
              return (
                <button
                  key={brand._id}
                  onClick={() => onSelectBrand(brand._id)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? "bg-emerald-50 text-emerald-800 font-bold border border-emerald-200"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <span className="truncate">{brand.name}</span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs">
        <button
          onClick={() => setPriceOpen(!priceOpen)}
          className="w-full flex items-center justify-between text-left font-bold text-gray-900 text-sm cursor-pointer select-none"
        >
          <span>Price Range (EGP)</span>
          {priceOpen ? (
            <IconChevronUp size={16} />
          ) : (
            <IconChevronDown size={16} />
          )}
        </button>

        {priceOpen && (
          <form onSubmit={handlePriceSubmit} className="mt-3.5 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-gray-500 font-medium block mb-1">
                  Min (EGP)
                </label>
                <input
                  type="number"
                  min="0"
                  value={localMinPrice}
                  onChange={(e) => setLocalMinPrice(e.target.value)}
                  placeholder="0"
                  className="w-full px-2.5 py-1.5 bg-gray-50 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-[11px] text-gray-500 font-medium block mb-1">
                  Max (EGP)
                </label>
                <input
                  type="number"
                  min="0"
                  value={localMaxPrice}
                  onChange={(e) => setLocalMaxPrice(e.target.value)}
                  placeholder="1000"
                  className="w-full px-2.5 py-1.5 bg-gray-50 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              Apply Price
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
