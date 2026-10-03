"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  IconMinus,
  IconPlus,
  IconShoppingCart,
  IconHeart,
  IconLoader2,
  IconBolt,
  IconShare,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
export default function ProductActions({
  productId,
  title,
  stock,
  price,
}: {
  productId: string;
  title: string;
  stock: number;
  price: number;
}) {
  const { addToCart, mutatingProductId } = useCart();
  const { isInWishlist, toggleWishlist, isMutating } = useWishlist();
  const router = useRouter();
  const [quantity, setQuantity] = useState(stock > 0 ? 1 : 0);
  const [pending, setPending] = useState(false);
  const unavailable = stock <= 0;
  const busy = pending || mutatingProductId === productId;
  const saved = isInWishlist(productId);
  async function purchase(checkout = false) {
    if (busy || unavailable) return;
    setPending(true);
    try {
      const result = await addToCart(productId, quantity);
      if (checkout && result.success) router.push("/checkout");
    } finally {
      setPending(false);
    }
  }
  async function share() {
    try {
      if (navigator.share)
        await navigator.share({ title, url: window.location.href });
      else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Product link copied");
      }
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError"))
        toast.error("Unable to share this product");
    }
  }
  const button =
    "flex h-13 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-3 text-sm font-medium transition-colors sm:px-4 sm:text-base disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600";
  return (
    <div className="space-y-6">
      <div>
        <label
          htmlFor="product-quantity"
          className="mb-2 block text-sm font-medium"
        >
          Quantity
        </label>
        <div className="flex items-center gap-4">
          <div className="flex h-13 items-center overflow-hidden rounded-lg border-2 border-gray-200">
            <button
              type="button"
              aria-label="Decrease quantity"
              disabled={quantity <= 1 || unavailable || busy}
              onClick={() => setQuantity((q) => q - 1)}
              className="flex h-12 w-13 items-center justify-center hover:bg-gray-50 disabled:opacity-50"
            >
              <IconMinus size={20} />
            </button>
            <input
              id="product-quantity"
              type="number"
              min={unavailable ? 0 : 1}
              max={stock}
              step={1}
              value={quantity}
              disabled={unavailable || busy}
              onChange={(e) =>
                setQuantity(
                  Math.max(
                    1,
                    Math.min(stock, Math.trunc(Number(e.target.value)) || 1),
                  ),
                )
              }
              className="w-16 text-center text-lg outline-primary-600"
            />
            <button
              type="button"
              aria-label="Increase quantity"
              disabled={quantity >= stock || unavailable || busy}
              onClick={() => setQuantity((q) => q + 1)}
              className="flex h-12 w-13 items-center justify-center hover:bg-gray-50 disabled:opacity-50"
            >
              <IconPlus size={20} />
            </button>
          </div>
          <span className="text-sm text-gray-500">{stock} available</span>
        </div>
      </div>
      <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
        <span className="text-gray-600">Total Price:</span>
        <span
          aria-live="polite"
          className="text-2xl font-bold text-primary-600"
        >
          {(price * quantity).toFixed(2)} EGP
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => purchase()}
          disabled={unavailable || busy}
          className={
            button +
            " bg-primary-600 text-white shadow-lg shadow-primary-600/25 hover:bg-primary-700"
          }
        >
          {busy ? (
            <IconLoader2 size={20} className="animate-spin" />
          ) : (
            <IconShoppingCart size={20} />
          )}
          {unavailable ? "Unavailable" : busy ? "Adding…" : "Add to Cart"}
        </button>
        <button
          type="button"
          onClick={() => purchase(true)}
          disabled={unavailable || busy}
          className={button + " bg-gray-900 text-white hover:bg-gray-800"}
        >
          <IconBolt size={20} fill="currentColor" />
          Buy Now
        </button>
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() =>
            toggleWishlist({ id: productId, _id: productId, title })
          }
          disabled={isMutating(productId)}
          aria-pressed={saved}
          className={
            button +
            " flex-1 border-2 border-gray-200 text-gray-700 hover:bg-gray-50"
          }
        >
          <IconHeart
            size={20}
            className={saved ? "fill-red-500 text-red-500" : ""}
          />
          {saved ? "Remove from Wishlist" : "Add to Wishlist"}
        </button>
        <button
          type="button"
          onClick={share}
          aria-label="Share product"
          className={
            button +
            " w-14 border-2 border-gray-200 text-gray-700 hover:bg-gray-50"
          }
        >
          <IconShare size={20} />
        </button>
      </div>
    </div>
  );
}
