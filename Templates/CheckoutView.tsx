"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import StoreHeading from "@/Components/StoreHeading";
import {
  IconReceipt,
  IconHome,
  IconPlus,
  IconShoppingBag,
  IconLockFilled,
  IconBookmarkFilled,
} from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import {
  EGYPTIAN_GOVERNORATES,
  EgyptianGovernorate,
} from "@/constants/governorates";
import {
  checkoutSchema,
  CheckoutSchemaValues,
} from "@/schemas/checkout.schema";
import { Address } from "@/types/address.types";
import {
  IconTruck,
  IconCreditCard,
  IconCash,
  IconShieldCheck,
  IconArrowLeft,
  IconLoader2,
  IconAlertCircle,
  IconMapPin,
} from "@tabler/icons-react";
import { toast } from "sonner";
export default function CheckoutView() {
  const router = useRouter();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const {
    cart,
    cartId,
    totalPrice,
    isLoading: isCartLoading,
    clearLocalCart,
  } = useCart();
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutSchemaValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      details: "",
      phone: "",
      city: "Cairo",
      paymentMethod: "cash",
    },
  });
  const selectedPaymentMethod = watch("paymentMethod");
  useEffect(() => {
    if (!isAuthenticated) return;
    fetch("/api/addresses")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setSavedAddresses(data.data);
        }
      })
      .catch((err) =>
        console.error("Error loading saved addresses in checkout:", err),
      );
  }, [isAuthenticated]);
  const handleSelectSavedAddress = (addr: Address) => {
    setSelectedAddressId(addr._id);
    setValue("city", addr.city as EgyptianGovernorate, {
      shouldValidate: true,
    });
    setValue("details", addr.details, { shouldValidate: true });
    setValue("phone", addr.phone, { shouldValidate: true });
    toast.success(`Loaded shipping details for "${addr.name}"`);
  };
  const deliveryFee = totalPrice === 0 ? 0 : totalPrice >= 500 ? 0 : 30;
  const grandTotal = totalPrice + deliveryFee;
  useEffect(() => {
    if (!isAuthLoading && !isCartLoading) {
      if (!isAuthenticated) {
        router.push("/login?returnUrl=/checkout");
        return;
      }
      if (!cart || cart.products.length === 0 || !cartId) {
        toast.info(
          "Your shopping cart is empty. Please add items before checking out.",
        );
        router.push("/cart");
      }
    }
  }, [isAuthLoading, isCartLoading, isAuthenticated, cart, cartId, router]);
  const onFormSubmit = async (data: CheckoutSchemaValues) => {
    if (!cartId) {
      toast.error("Cart identifier is missing. Please refresh your cart.");
      return;
    }
    setIsSubmittingOrder(true);
    setSubmissionError(null);
    const shippingAddress = {
      details: data.details.trim(),
      phone: data.phone.trim(),
      city: data.city,
    };
    try {
      if (data.paymentMethod === "cash") {
        const response = await fetch(`/api/orders/${cartId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ shippingAddress }),
        });
        const resData = await response.json();
        if (response.ok && resData.success) {
          clearLocalCart();
          toast.success(
            "Order placed successfully! Thank you for shopping with FreshCart.",
          );
          router.push("/allorders");
        } else {
          const errMsg =
            resData.message ||
            "Failed to place your cash order. Please try again.";
          setSubmissionError(errMsg);
          toast.error(errMsg);
        }
      } else {
        const response = await fetch(`/api/orders/checkout-session/${cartId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ shippingAddress }),
        });
        const resData = await response.json();
        if (response.ok && resData.success && resData.sessionUrl) {
          toast.loading("Redirecting to secure Stripe checkout...");
          window.location.href = resData.sessionUrl;
        } else {
          const errMsg =
            resData.message ||
            "Failed to initialize card payment session. Please try again.";
          setSubmissionError(errMsg);
          toast.error(errMsg);
        }
      }
    } catch (err) {
      console.error("Order submission network error:", err);
      const errMsg =
        "A network error occurred while submitting your order. Please retry.";
      setSubmissionError(errMsg);
      toast.error(errMsg);
    } finally {
      setIsSubmittingOrder(false);
    }
  };
  if (
    isAuthLoading ||
    isCartLoading ||
    !isAuthenticated ||
    !cart ||
    cart.products.length === 0
  ) {
    return (
      <div className="container mx-auto px-4 py-8 lg:py-12 max-w-7xl animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded-lg mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-4">
            <div className="h-48 bg-gray-200 rounded-2xl" />
            <div className="h-40 bg-gray-200 rounded-2xl" />
          </div>
          <div className="lg:col-span-5">
            <div className="h-96 bg-gray-200 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="store-screen">
      <StoreHeading
        title="Complete Your Order"
        breadcrumb="Cart / Checkout"
        subtitle="Review your items and complete your purchase"
        icon={<IconReceipt size={34} />}
        action={
          <Link href="/cart" className="store-link">
            <IconArrowLeft size={18} />
            Back to Cart
          </Link>
        }
      />
      <form
        onSubmit={handleSubmit(onFormSubmit)}
        noValidate
        className="store-container store-body store-columns"
      >
        <div className="checkout-sections">
          <section className="store-card">
            <div className="store-card-head">
              <h2>
                <IconHome size={20} />
                Shipping Address
              </h2>
              <p>Where should we deliver your order?</p>
            </div>
            <div className="store-card-body">
              {submissionError && (
                <div role="alert" className="store-error">
                  {submissionError}
                </div>
              )}
              <h3 className="font-semibold flex gap-2 items-center">
                <IconBookmarkFilled size={18} className="text-primary-500" />
                Saved Addresses
              </h3>
              <p className="store-muted mt-3">
                Select a saved address or enter a new one below
              </p>
              {savedAddresses.map((addr) => (
                <button
                  type="button"
                  key={addr._id}
                  onClick={() => handleSelectSavedAddress(addr)}
                  className={`checkout-address ${selectedAddressId === addr._id ? "selected" : ""}`}
                  aria-pressed={selectedAddressId === addr._id}
                >
                  <IconMapPin size={20} />
                  <div>
                    <h3>{addr.name}</h3>
                    <p>{addr.details}</p>
                    <p>
                      {addr.phone}　·　{addr.city}
                    </p>
                  </div>
                </button>
              ))}
              <button
                type="button"
                className="checkout-address checkout-new-address"
                onClick={() => {
                  setSelectedAddressId(null);
                  setValue("city", "Cairo");
                  setValue("details", "");
                  setValue("phone", "");
                  document.getElementById("checkout-city")?.focus();
                }}
              >
                <IconPlus size={20} />
                <div>
                  <h3>Use a different address</h3>
                  <p>Enter a new shipping address manually</p>
                </div>
              </button>
              <div className="checkout-notice">
                <IconAlertCircle size={20} />
                <div>
                  <strong>Delivery Information</strong>Please ensure your
                  address is accurate for smooth delivery
                </div>
              </div>
              <div className="store-field">
                <label htmlFor="checkout-city">
                  City <span className="text-red-500">*</span>
                </label>
                <select
                  id="checkout-city"
                  {...register("city")}
                  disabled={isSubmittingOrder}
                >
                  {EGYPTIAN_GOVERNORATES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                {errors.city && <small>{errors.city.message}</small>}
              </div>
              <div className="store-field">
                <label htmlFor="checkout-details">
                  Street Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="checkout-details"
                  {...register("details")}
                  rows={3}
                  placeholder="Street name, building number, floor, apartment..."
                  disabled={isSubmittingOrder}
                />
                {errors.details && <small>{errors.details.message}</small>}
              </div>
              <div className="store-field mb-0">
                <label htmlFor="checkout-phone">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="checkout-phone"
                  {...register("phone")}
                  type="tel"
                  autoComplete="tel"
                  placeholder="01xxxxxxxxx"
                  disabled={isSubmittingOrder}
                />
                {errors.phone && <small>{errors.phone.message}</small>}
              </div>
            </div>
          </section>
          <section className="store-card">
            <div className="store-card-head">
              <h2>
                <IconCreditCard size={20} />
                Payment Method
              </h2>
              <p>Choose how you'd like to pay</p>
            </div>
            <div className="store-card-body">
              <label
                className={`payment-choice ${selectedPaymentMethod === "cash" ? "selected" : ""}`}
              >
                <IconCash size={22} />
                <div>
                  <strong>Cash on Delivery</strong>
                  <p>Pay when your order arrives at your doorstep</p>
                </div>
                <input
                  type="radio"
                  value="cash"
                  {...register("paymentMethod")}
                  disabled={isSubmittingOrder}
                />
              </label>
              <label
                className={`payment-choice ${selectedPaymentMethod === "online" ? "selected" : ""}`}
              >
                <IconCreditCard size={22} />
                <div>
                  <strong>Pay Online</strong>
                  <p>Secure payment with Credit/Debit Card via Stripe</p>
                  <span className="text-xs text-blue-600 mt-2">
                    VISA　 Mastercard　 AMEX
                  </span>
                </div>
                <input
                  type="radio"
                  value="online"
                  {...register("paymentMethod")}
                  disabled={isSubmittingOrder}
                />
              </label>
              <div className="summary-note">
                <IconShieldCheck size={24} />
                <div>
                  <strong>Secure & Encrypted</strong>Your payment is processed
                  securely
                </div>
              </div>
            </div>
          </section>
        </div>
        <aside className="store-card store-summary">
          <div className="store-card-head">
            <h2>
              <IconShoppingBag size={20} />
              Order Summary
            </h2>
            <p>{cart.products.length} items</p>
          </div>
          <div className="store-card-body">
            <div className="checkout-order-items">
              {cart.products.map((item) => (
                <div className="checkout-order-item" key={item._id}>
                  <div className="checkout-order-photo">
                    <Image
                      src={
                        item.product.imageCover || "/product-placeholder.svg"
                      }
                      alt={item.product.title}
                      fill
                      sizes="48px"
                    />
                  </div>
                  <div>
                    <h3>{item.product.title}</h3>
                    <p>
                      {item.count} × {item.price.toLocaleString()} EGP
                    </p>
                  </div>
                  <strong>{(item.count * item.price).toLocaleString()}</strong>
                </div>
              ))}
            </div>
            <div className="summary-lines">
              <div>
                <span>Subtotal</span>
                <span>{totalPrice.toLocaleString()} EGP</span>
              </div>
              <div>
                <span>Shipping</span>
                <span className="text-primary-600">
                  {deliveryFee === 0 ? "FREE" : `${deliveryFee} EGP`}
                </span>
              </div>
              <div className="summary-total">
                <span>Total</span>
                <strong className="text-primary-600">
                  {grandTotal.toLocaleString()}
                  <small> EGP</small>
                </strong>
              </div>
            </div>
            <button
              type="submit"
              className="store-button wide"
              disabled={isSubmittingOrder}
            >
              {isSubmittingOrder ? (
                <IconLoader2 size={18} className="animate-spin" />
              ) : (
                <IconLockFilled size={18} />
              )}{" "}
              {isSubmittingOrder
                ? "Processing..."
                : selectedPaymentMethod === "cash"
                  ? "Place Order"
                  : "Pay Online"}
            </button>
            <div className="summary-trust">
              <span>
                <IconShieldCheck size={14} />
                Secure
              </span>
              <span>
                <IconTruck size={14} />
                Fast Delivery
              </span>
              <span>Easy Returns</span>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}
