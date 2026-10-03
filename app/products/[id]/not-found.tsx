import Link from "next/link";
import Image from "next/image";
import notFoundImage from "@/Assets/images/404.svg";
import { IconArrowLeft, IconShoppingBag } from "@tabler/icons-react";
export default function ProductNotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full text-center flex flex-col items-center">
        <div className="relative w-64 h-48 mb-6">
          <Image
            src={notFoundImage}
            alt="Product not found"
            fill
            className="object-contain"
            priority
          />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Product Not Found
        </h1>
        <p className="mt-3 text-sm text-gray-500 max-w-sm">
          We could not find the grocery item you were looking for. It may have
          been discontinued or moved to a different aisle.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
          <Link
            href="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-all shadow-xs cursor-pointer"
          >
            <IconShoppingBag size={18} />
            <span>Browse Products</span>
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-gray-200 hover:border-gray-300 bg-white text-gray-700 font-medium text-sm transition-all cursor-pointer"
          >
            <IconArrowLeft size={18} />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
