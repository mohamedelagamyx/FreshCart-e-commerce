"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import StoreHeading from "@/Components/StoreHeading";
import { IconCalendar, IconMapPin, IconPhone } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { UserOrder } from "@/types/order.types";
import {
  IconReceipt,
  IconShoppingBag,
  IconChevronDown,
  IconChevronUp,
  IconCreditCard,
  IconCash,
  IconCheck,
  IconClock,
  IconPackage,
} from "@tabler/icons-react";
export default function OrdersView() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [expandedOrderIds, setExpandedOrderIds] = useState<Set<string>>(
    new Set(),
  );
  const fetchOrders = useCallback(async () => {
    setIsLoadingOrders(true);
    setErrorMessage(null);
    try {
      const response = await fetch("/api/orders", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        setErrorMessage(
          result.message ||
            "Failed to load your order history. Please try again.",
        );
        return;
      }
      const retrievedOrders: UserOrder[] = Array.isArray(result.data)
        ? result.data
        : [];
      setOrders(retrievedOrders);
      if (retrievedOrders.length > 0) {
        setExpandedOrderIds(new Set([retrievedOrders[0]._id]));
      }
    } catch (err) {
      console.error("Orders fetch failure:", err);
      setErrorMessage(
        "Network connection interrupted. Please verify your connection and try again.",
      );
    } finally {
      setIsLoadingOrders(false);
    }
  }, []);
  useEffect(() => {
    if (!isAuthLoading) {
      if (!isAuthenticated) {
        router.push("/login?returnUrl=/allorders");
      } else {
        fetchOrders();
      }
    }
  }, [isAuthLoading, isAuthenticated, router, fetchOrders]);
  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrderIds((prev) => {
      const updated = new Set(prev);
      if (updated.has(orderId)) {
        updated.delete(orderId);
      } else {
        updated.add(orderId);
      }
      return updated;
    });
  };
  const formatDate = (isoString?: string) => {
    if (!isoString) return "Date unavailable";
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(date);
    } catch {
      return isoString;
    }
  };
  const formatOrderId = (order: UserOrder) => {
    if (order.id) {
      return `#${order.id}`;
    }
    if (order._id) {
      return `#${order._id.slice(-8).toUpperCase()}`;
    }
    return "#ORDER";
  };
  if (isAuthLoading || (!isAuthenticated && !isAuthLoading)) {
    return (
      <main className="min-h-[70vh] bg-gray-50/50 py-10">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="animate-pulse space-y-6">
            <div className="h-6 w-48 bg-gray-200 rounded-md" />
            <div className="h-10 w-72 bg-gray-200 rounded-md" />
            <div className="space-y-4">
              <div className="h-44 bg-white border border-gray-100 rounded-2xl p-6" />
              <div className="h-44 bg-white border border-gray-100 rounded-2xl p-6" />
            </div>
          </div>
        </div>
      </main>
    );
  }
  return (
    <div className="store-screen" style={{ background: "#fff" }}>
      <StoreHeading
        title="My Orders"
        subtitle={`Track and manage your ${orders.length} orders`}
        icon={<IconShoppingBag size={28} />}
        action={
          <Link href="/products" className="store-link">
            <IconShoppingBag size={14} />
            Continue Shopping
          </Link>
        }
      />
      <div className="store-container store-body">
        {isLoadingOrders ? (
          <div className="store-card store-empty animate-pulse">
            Loading your orders...
          </div>
        ) : errorMessage ? (
          <div className="store-error" role="alert">
            <p>{errorMessage}</p>
            <button className="store-button mt-4" onClick={fetchOrders}>
              Try Again
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="store-card store-empty">
            <h2>No orders yet</h2>
            <p>
              Your order history will appear here after your first purchase.
            </p>
            <Link href="/products" className="store-button">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="order-list">
            {orders.map((order) => {
              const expanded = expandedOrderIds.has(order._id);
              const items = order.cartItems || [];
              const first =
                typeof items[0]?.product === "object"
                  ? items[0]?.product
                  : null;
              const count = items.reduce(
                (sum, item) => sum + (item.count ?? item.quantity ?? 1),
                0,
              );
              const total = Number(order.totalOrderPrice || 0);
              const shipping = Number(order.shippingPrice || 0);
              const tax = Number(order.taxPrice || 0);
              return (
                <article
                  key={order._id}
                  className={`store-card order-card ${expanded ? "open" : ""}`}
                >
                  <div className="order-header">
                    <div className="order-photo">
                      <Image
                        src={first?.imageCover || "/product-placeholder.svg"}
                        alt={first?.title || "Order products"}
                        fill
                        sizes="112px"
                      />
                      {items.length > 1 && <span>+{items.length - 1}</span>}
                    </div>
                    <div>
                      <span
                        className={`order-status ${order.isDelivered ? "delivered" : ""}`}
                      >
                        {order.isDelivered ? (
                          <IconCheck size={14} />
                        ) : (
                          <IconClock size={14} />
                        )}{" "}
                        {order.isDelivered ? "Delivered" : "Processing"}
                      </span>
                      <h2 className="order-title">{formatOrderId(order)}</h2>
                      <div className="order-meta">
                        <span>
                          <IconCalendar size={14} />
                          {formatDate(order.createdAt)}
                        </span>
                        <span>
                          <IconShoppingBag size={14} />
                          {count} {count === 1 ? "item" : "items"}
                        </span>
                        <span>
                          <IconMapPin size={14} />
                          {order.shippingAddress?.city || "Address unavailable"}
                        </span>
                      </div>
                      <p className="order-price">
                        {total.toLocaleString()}
                        <small> EGP</small>
                      </p>
                    </div>
                    <div className="order-controls">
                      {order.paymentMethodType === "cash" ? (
                        <IconCash size={20} aria-label="Cash payment" />
                      ) : (
                        <IconCreditCard size={20} aria-label="Card payment" />
                      )}
                      <button
                        onClick={() => toggleOrderExpand(order._id)}
                        aria-expanded={expanded}
                        aria-controls={`order-details-${order._id}`}
                      >
                        {expanded ? "Hide" : "Details"}
                        {expanded ? (
                          <IconChevronUp size={16} />
                        ) : (
                          <IconChevronDown size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                  {expanded && (
                    <div
                      id={`order-details-${order._id}`}
                      className="order-details"
                    >
                      <h3 className="flex gap-2 items-center">
                        <IconPackage size={18} className="text-primary-500" />
                        Order Items
                      </h3>
                      <div className="space-y-3">
                        {items.map((item, index) => {
                          const product =
                            typeof item.product === "object"
                              ? item.product
                              : null;
                          const qty = item.count ?? item.quantity ?? 1;
                          return (
                            <div
                              className="checkout-order-item bg-white border border-gray-100"
                              key={item._id || index}
                            >
                              <div className="checkout-order-photo">
                                <Image
                                  src={
                                    product?.imageCover ||
                                    "/product-placeholder.svg"
                                  }
                                  alt={product?.title || "Product"}
                                  fill
                                  sizes="48px"
                                />
                              </div>
                              <div>
                                <h3>
                                  {product?.title ||
                                    "Product details unavailable"}
                                </h3>
                                <p>
                                  {qty} × {item.price.toLocaleString()} EGP
                                </p>
                              </div>
                              <strong>
                                {(qty * item.price).toLocaleString()}
                                <small className="block text-gray-400 text-xs font-normal text-right">
                                  EGP
                                </small>
                              </strong>
                            </div>
                          );
                        })}
                      </div>
                      <div className="order-detail-grid">
                        <div>
                          <h3 className="flex gap-2 items-center">
                            <IconMapPin
                              size={18}
                              className="text-primary-500"
                            />
                            Delivery Address
                          </h3>
                          <p className="font-semibold text-gray-700">
                            {order.shippingAddress?.city}
                          </p>
                          <p>
                            {order.shippingAddress?.details ||
                              "Address details unavailable"}
                          </p>
                          <p className="flex gap-2 items-center">
                            <IconPhone size={14} />
                            {order.shippingAddress?.phone}
                          </p>
                        </div>
                        <div>
                          <h3 className="flex gap-2 items-center">
                            <IconReceipt size={18} />
                            Order Summary
                          </h3>
                          <div className="summary-lines">
                            <div>
                              <span>Subtotal</span>
                              <span>
                                {(total - shipping - tax).toLocaleString()} EGP
                              </span>
                            </div>
                            <div>
                              <span>Shipping</span>
                              <span>
                                {shipping === 0
                                  ? "Free"
                                  : `${shipping.toLocaleString()} EGP`}
                              </span>
                            </div>
                            {tax > 0 && (
                              <div>
                                <span>Tax</span>
                                <span>{tax.toLocaleString()} EGP</span>
                              </div>
                            )}
                            <div className="summary-total">
                              <span>Total</span>
                              <span>{total.toLocaleString()} EGP</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
