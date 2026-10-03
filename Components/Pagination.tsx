"use client";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
interface PaginationProps {
  currentPage: number;
  numberOfPages: number;
  onPageChange: (page: number) => void;
}
export default function Pagination({
  currentPage,
  numberOfPages,
  onPageChange,
}: PaginationProps) {
  if (numberOfPages <= 1) return null;
  const getPages = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    if (numberOfPages <= maxVisible) {
      for (let i = 1; i <= numberOfPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) {
        pages.push("...");
      }
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(numberOfPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (currentPage < numberOfPages - 2) {
        pages.push("...");
      }
      pages.push(numberOfPages);
    }
    return pages;
  };
  const pages = getPages();
  return (
    <div className="flex items-center justify-center gap-1.5 pt-8 pb-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 text-gray-700 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-700 transition-all cursor-pointer"
        aria-label="Previous page"
      >
        <IconChevronLeft size={18} />
      </button>

      {pages.map((p, idx) => {
        if (p === "...") {
          return (
            <span
              key={`ellipsis-${idx}`}
              className="w-10 h-10 flex items-center justify-center text-gray-400 font-bold"
            >
              ...
            </span>
          );
        }
        const isCurrent = p === currentPage;
        return (
          <button
            key={`page-${p}`}
            onClick={() => onPageChange(p as number)}
            className={`w-10 h-10 rounded-xl font-bold text-sm transition-all cursor-pointer ${
              isCurrent
                ? "bg-primary-600 text-white shadow-md shadow-primary-200"
                : "border border-gray-200 text-gray-700 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-300"
            }`}
            aria-current={isCurrent ? "page" : undefined}
          >
            {p}
          </button>
        );
      })}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= numberOfPages}
        className="flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 text-gray-700 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-700 transition-all cursor-pointer"
        aria-label="Next page"
      >
        <IconChevronRight size={18} />
      </button>
    </div>
  );
}
