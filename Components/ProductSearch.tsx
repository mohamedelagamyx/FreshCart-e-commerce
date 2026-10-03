"use client";
import { IconSearch, IconX, IconArrowsSort } from "@tabler/icons-react";
interface ProductSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  totalFilteredCount: number;
}
export default function ProductSearch({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  totalFilteredCount,
}: ProductSearchProps) {
  return (
    <div className="bg-white rounded-2xl p-4 md:p-6 border border-gray-100 shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
      <div className="relative flex-1 max-w-xl">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search products by title or category..."
          className="w-full pl-11 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all text-sm font-medium"
        />
        <IconSearch
          size={20}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
        />
        {searchTerm && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer p-0.5"
            aria-label="Clear search"
          >
            <IconX size={16} />
          </button>
        )}
      </div>

      <div className="flex items-center justify-between md:justify-end gap-4">
        <span className="text-xs text-gray-500 font-medium">
          <strong className="text-gray-800">{totalFilteredCount}</strong> items
        </span>

        <div className="relative flex items-center gap-2">
          <label htmlFor="catalog-sort" className="sr-only">
            Sort products
          </label>
          <div className="relative">
            <select
              id="catalog-sort"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="appearance-none pl-9 pr-8 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:border-primary-500 cursor-pointer transition-all"
            >
              <option value="">Featured</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
              <option value="-ratingsAverage">Top Rated</option>
              <option value="-sold">Best Selling</option>
              <option value="-createdAt">Newest Arrivals</option>
            </select>
            <IconArrowsSort
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
