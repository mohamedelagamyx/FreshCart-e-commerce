"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  IconHeart,
  IconEye,
  IconPlus,
  IconStarFilled,
  IconStarHalfFilled,
  IconStar,
  IconRefresh,
  IconLoader2,
} from "@tabler/icons-react";
import { Product } from "@/types/product.types";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
interface ProductCardProps {
  product: Product;
  variant?: "catalog" | "related";
}
export default function ProductCard({
  product,
  variant = "catalog",
}: ProductCardProps) {
  const related = variant === "related";
  const { addToCart, mutatingProductId } = useCart();
  const { isInWishlist, toggleWishlist, isMutating } = useWishlist();
  const [imgSrc, setImgSrc] = useState(
    product.imageCover || "/product-placeholder.svg",
  );
  const productId = product._id || product.id;
  const isAdding = mutatingProductId === productId;
  const isWishlisted = isInWishlist(productId);
  const isWishlistMutating = isMutating(productId);
  const hasDiscount =
    product.priceAfterDiscount && product.priceAfterDiscount < product.price;
  const currentPrice = hasDiscount
    ? product.priceAfterDiscount!
    : product.price;
  const originalPrice = product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 15;
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAdding) return;
    await addToCart(productId, 1);
  };
  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlistMutating) return;
    await toggleWishlist(product);
  };
  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast.info(`Quick preview for ${product.title.slice(0, 22)}`);
  };
  return (
    <div
      className={
        related
          ? "group bg-white rounded-lg border border-gray-200 p-4 hover:border-primary-300 transition-colors flex flex-col justify-between relative overflow-hidden"
          : "group bg-white rounded-2xl border border-gray-100 p-3.5 sm:p-4 shadow-xs hover:shadow-xl hover:border-emerald-200 transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
      }
    >
      {(!related || hasDiscount) && (
        <span className="absolute top-3 left-3 z-10 bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-xs">
          -{discountPercentage}%
        </span>
      )}

      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
        <button
          onClick={
            related
              ? () => {
                  window.location.href = `/products/${productId}`;
                }
              : handleQuickView
          }
          type="button"
          aria-label={related ? "View product details" : "Quick view product"}
          className="order-3 w-8 h-8 rounded-full bg-white/95 backdrop-blur-xs border border-gray-200/70 flex items-center justify-center text-gray-500 hover:text-emerald-600 hover:bg-white shadow-xs hover:shadow-md transition-all cursor-pointer"
        >
          <IconEye size={16} stroke={1.8} />
        </button>
        {related && product.images?.length > 1 && (
          <button
            type="button"
            aria-label={`Next photo of ${product.title}`}
            onClick={() =>
              setImgSrc(
                product.images[
                  (product.images.indexOf(imgSrc) + 1) % product.images.length
                ],
              )
            }
            className="order-2 flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:text-primary-600"
          >
            <IconRefresh size={16} />
          </button>
        )}
        <button
          onClick={handleToggleWishlist}
          disabled={isWishlistMutating}
          type="button"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={isWishlisted}
          className="w-8 h-8 rounded-full bg-white/95 backdrop-blur-xs border border-gray-200/70 flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-white shadow-xs hover:shadow-md transition-all cursor-pointer disabled:opacity-50"
        >
          <IconHeart
            size={16}
            stroke={1.8}
            className={`transition-colors ${isWishlisted ? "text-red-500 fill-red-500" : ""}`}
          />
        </button>
      </div>

      <Link
        href={`/products/${product._id || product.id}`}
        className={
          related
            ? "block relative w-full aspect-[255/240] overflow-hidden bg-white mb-4"
            : "block relative w-full aspect-square rounded-xl overflow-hidden bg-gray-50/60 mb-3"
        }
      >
        <Image
          src={imgSrc}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={() => setImgSrc("/product-placeholder.svg")}
        />
      </Link>

      <div className="flex-1 flex flex-col">
        <span className="text-[11px] font-medium text-gray-400 mb-1 line-clamp-1">
          {product.category?.name || "General"}
        </span>

        <Link
          href={`/products/${product._id || product.id}`}
          className={
            related
              ? "font-medium text-gray-700 line-clamp-2 hover:text-primary-700 mb-1.5 text-base leading-6"
              : "font-bold text-gray-800 line-clamp-1 hover:text-emerald-700 transition-colors mb-1.5 text-xs sm:text-sm leading-snug"
          }
          title={product.title}
        >
          {product.title}
        </Link>

        <div className="flex items-center gap-1 mb-2 text-xs">
          <div className="flex items-center text-amber-400">
            {Array.from({ length: 5 }).map((_, i) => {
              const rating = product.ratingsAverage ?? 0;
              const Star =
                !related || rating >= i + 1
                  ? IconStarFilled
                  : rating > i
                    ? IconStarHalfFilled
                    : IconStar;
              return <Star key={`star-${i}`} size={related ? 18 : 12} />;
            })}
          </div>
          <span className="font-semibold text-gray-700 ml-0.5 text-[11px]">
            {related
              ? (product.ratingsAverage ?? 0)
              : product.ratingsAverage || 4.8}
          </span>
          <span className="text-gray-400 text-[10px]">
            (
            {related
              ? (product.ratingsQuantity ?? 0)
              : product.ratingsQuantity || 42}
            )
          </span>
        </div>

        <div className="mt-auto pt-2 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span
              className={
                related
                  ? `text-lg font-bold ${hasDiscount ? "text-primary-600" : "text-gray-900"}`
                  : "text-sm sm:text-base font-extrabold text-gray-900"
              }
            >
              {currentPrice}{" "}
              <span className="text-[11px] font-bold text-gray-600">EGP</span>
            </span>
            {hasDiscount && (
              <span className="text-[11px] text-gray-400 line-through">
                {originalPrice} EGP
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            type="button"
            className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 disabled:cursor-not-allowed text-white shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group-hover:scale-105 active:scale-95"
            aria-label={`Add ${product.title} to cart`}
          >
            {isAdding ? (
              <IconLoader2 size={18} className="animate-spin" />
            ) : (
              <IconPlus size={18} stroke={2.5} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
