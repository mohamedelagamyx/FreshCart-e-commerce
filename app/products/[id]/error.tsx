"use client";
import { useEffect } from "react";
import Link from "next/link";
import {
  IconAlertTriangle,
  IconRefresh,
  IconArrowLeft,
} from "@tabler/icons-react";
interface ProductErrorProps {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}
export default function ProductError({ error, reset }: ProductErrorProps) {
  useEffect(() => {
    console.error("Product details runtime error:", error);
  }, [error]);
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full text-center flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-6 border border-red-100 shadow-xs">
          <IconAlertTriangle size={32} />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Unable to Load Product
        </h1>
        <p className="mt-3 text-sm text-gray-500 max-w-sm">
          We encountered an unexpected error while retrieving this product's
          details. Please check your connection and try again.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-all shadow-xs cursor-pointer"
          >
            <IconRefresh size={18} />
            <span>Try Again</span>
          </button>
          <Link
            href="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-gray-200 hover:border-gray-300 bg-white text-gray-700 font-medium text-sm transition-all cursor-pointer"
          >
            <IconArrowLeft size={18} />
            <span>Return to Catalog</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
