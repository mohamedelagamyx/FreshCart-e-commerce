"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import StoreHeading from "@/Components/StoreHeading";
import { IconLockFilled, IconShoppingBag, IconTag } from "@tabler/icons-react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import {
  IconTrash,
  IconPlus,
  IconMinus,
  IconShoppingCart,
  IconTruck,
  IconArrowRight,
  IconArrowLeft,
  IconShieldCheck,
  IconAlertTriangle,
  IconLoader2,
} from "@tabler/icons-react";
export default function CartView() {
  const router = useRouter();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const {
    cart,
    totalPrice,
    isLoading: isCartLoading,
    mutatingProductId,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();
  const [showClearModal, setShowClearModal] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push("/login?returnUrl=/cart");
    }
  }, [isAuthLoading, isAuthenticated, router]);
  const freeShippingThreshold = 500;
  const qualifiesForFreeShipping = totalPrice >= freeShippingThreshold;
  const remainingForFreeShipping = Math.max(
    0,
    freeShippingThreshold - totalPrice,
  );
  const shippingFee = totalPrice === 0 ? 0 : qualifiesForFreeShipping ? 0 : 30;
  const grandTotal = totalPrice + shippingFee;
  const handleConfirmClear = async () => {
    setIsClearing(true);
    try {
      await clearCart();
      setShowClearModal(false);
    } finally {
      setIsClearing(false);
    }
  };
  if (isAuthLoading || (isCartLoading && !cart)) {
    return (
      <div className="container mx-auto px-4 py-8 lg:py-12 max-w-7xl animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded-lg mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-4">
            <div className="h-14 bg-gray-200 rounded-xl" />
            <div className="h-28 bg-gray-200 rounded-2xl" />
            <div className="h-28 bg-gray-200 rounded-2xl" />
            <div className="h-28 bg-gray-200 rounded-2xl" />
          </div>
          <div className="lg:col-span-4">
            <div className="h-80 bg-gray-200 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
          <IconShoppingCart size={32} />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Redirecting to Sign In
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Please sign in to access your saved shopping cart.
        </p>
        <Link
          href="/login?returnUrl=/cart"
          className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors shadow-xs"
        >
          Sign In Now
        </Link>
      </div>
    );
  }
  if (!cart || cart.products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 lg:py-20 max-w-4xl">
        <div className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-14 text-center shadow-xs">
          <div className="w-24 h-24 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-6">
            <IconShoppingCart size={48} stroke={1.5} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">
            Your shopping cart is empty
          </h1>
          <p className="text-gray-500 max-w-md mx-auto mb-8 text-sm sm:text-base leading-relaxed">
            Explore our products and add your favorites to get started.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
          >
            <span>Explore Catalog</span>
            <IconArrowRight size={18} stroke={2.5} />
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="store-screen" style={{ background: "#f8f9fa" }}>
      <StoreHeading
        title="Shopping Cart"
        subtitle={
          <>
            You have{" "}
            <strong className="text-primary-600">
              {cart.products.length} items
            </strong>{" "}
            in your cart
          </>
        }
        icon={<IconShoppingCart size={36} />}
      />
      <div className="store-container store-body store-columns">
        <div>
          <div className="cart-items">
            {cart.products.map((item) => {
              const product = item.product;
              const id = product._id;
              const busy = mutatingProductId === id;
              return (
                <article key={item._id} className="store-card cart-item">
                  <div className="cart-photo">
                    <Link href={`/products/${id}`}>
                      <Image
                        src={product.imageCover || "/product-placeholder.svg"}
                        alt={product.title}
                        fill
                        sizes="128px"
                      />
                    </Link>
                    <span className="store-stock">In Stock</span>
                  </div>
                  <div className="cart-info">
                    <Link href={`/products/${id}`}>
                      <h2>{product.title}</h2>
                    </Link>
                    <span className="cart-category">
                      {product.category?.name || "Product"}
                    </span>
                    <span className="cart-sku">
                      · SKU: {id.slice(-6).toUpperCase()}
                    </span>
                    <p className="cart-price">
                      {item.price.toLocaleString()} EGP<small>per unit</small>
                    </p>
                    <div className="cart-bottom">
                      <div className="store-quantity">
                        <button
                          onClick={() => updateQuantity(id, item.count - 1)}
                          disabled={busy || item.count <= 1}
                          aria-label={`Decrease quantity of ${product.title}`}
                        >
                          <IconMinus size={18} />
                        </button>
                        <span aria-live="polite">{item.count}</span>
                        <button
                          onClick={() => updateQuantity(id, item.count + 1)}
                          disabled={busy}
                          aria-label={`Increase quantity of ${product.title}`}
                        >
                          {busy ? (
                            <IconLoader2 size={18} className="animate-spin" />
                          ) : (
                            <IconPlus size={18} />
                          )}
                        </button>
                      </div>
                      <div className="cart-total">
                        <small>Total</small>
                        <strong>
                          {(item.price * item.count).toLocaleString()}
                        </strong>
                        <span>EGP</span>
                      </div>
                      <button
                        className="store-trash"
                        onClick={() => removeItem(id)}
                        disabled={busy}
                        aria-label={`Remove ${product.title} from cart`}
                      >
                        <IconTrash size={18} />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          <div className="cart-links">
            <Link href="/products" className="store-link">
              <IconArrowLeft size={16} />
              Continue Shopping
            </Link>
            <button
              onClick={() => setShowClearModal(true)}
              className="store-muted flex gap-2 items-center"
            >
              <IconTrash size={16} />
              Clear all items
            </button>
          </div>
        </div>
        <aside className="store-card store-summary">
          <div className="store-card-head">
            <h2>
              <IconShoppingBag size={20} />
              Order Summary
            </h2>
            <p>{cart.products.length} items in your cart</p>
          </div>
          <div className="store-card-body">
            <div className="summary-note">
              <IconTruck size={24} />
              <div>
                <strong>
                  {qualifiesForFreeShipping ? "Free Shipping!" : "Delivery"}
                </strong>
                {qualifiesForFreeShipping
                  ? "You qualify for free delivery"
                  : `Add ${remainingForFreeShipping.toLocaleString()} EGP for free delivery`}
              </div>
            </div>
            <div className="summary-lines">
              <div>
                <span>Subtotal</span>
                <span>{totalPrice.toLocaleString()} EGP</span>
              </div>
              <div>
                <span>Shipping</span>
                <span className="text-primary-600">
                  {shippingFee === 0 ? "FREE" : `${shippingFee} EGP`}
                </span>
              </div>
              <div className="summary-total">
                <span>Total</span>
                <strong>
                  {grandTotal.toLocaleString()}
                  <small> EGP</small>
                </strong>
              </div>
            </div>
            <button
              className="promo-toggle"
              onClick={() =>
                toast.info("Promo codes are currently unavailable.")
              }
            >
              <IconTag size={16} />
              Apply Promo Code
            </button>
            <Link href="/checkout" className="store-button wide">
              <IconLockFilled size={18} />
              Secure Checkout
            </Link>
            <div className="summary-trust">
              <span>
                <IconShieldCheck size={14} />
                Secure Payment
              </span>
              <span>
                <IconTruck size={14} />
                Fast Delivery
              </span>
            </div>
            <div className="text-center">
              <Link href="/products" className="store-link">
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </aside>
      </div>

      {showClearModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="clear-cart-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-gray-100 relative">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">
              <IconAlertTriangle size={24} stroke={2} />
            </div>

            <h3
              id="clear-cart-modal-title"
              className="text-lg sm:text-xl font-bold text-gray-900 mb-2"
            >
              Clear your shopping cart?
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-6">
              Are you sure you want to remove all items from your cart? This
              action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowClearModal(false)}
                disabled={isClearing}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmClear}
                disabled={isClearing}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {isClearing && (
                  <IconLoader2 size={16} className="animate-spin" />
                )}
                <span>{isClearing ? "Clearing..." : "Yes, Clear Cart"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
