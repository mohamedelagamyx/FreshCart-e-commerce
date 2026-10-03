"use client";
import { useState, useRef } from "react";
import {
  IconPackage,
  IconStar,
  IconStarFilled,
  IconStarHalfFilled,
  IconTruckDelivery,
  IconCheck,
  IconRotateClockwise,
  IconShieldHalfFilled,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { Product } from "@/types/product.types";
function illustrativeRatings(product: Product) {
  let seed = 2166136261;
  for (const character of product._id || product.id || product.title) {
    seed = Math.imul(seed ^ character.charCodeAt(0), 16777619) >>> 0;
  }
  const weights = [5, 4, 3, 2, 1].map((stars) => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return (
      Math.exp(-((stars - (product.ratingsAverage ?? 3)) ** 2) / 2) *
      (0.6 + seed / 4294967296)
    );
  });
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  const percentages = weights.map((weight) =>
    Math.floor((weight / total) * 100),
  );
  const largest = weights.indexOf(Math.max(...weights));
  percentages[largest] +=
    100 - percentages.reduce((sum, value) => sum + value, 0);
  return percentages;
}
export default function ProductDetailsTabs({ product }: { product: Product }) {
  const percentages = illustrativeRatings(product);
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const tabs = [
    { title: "Product Details", icon: IconPackage },
    {
      title: `Reviews (${product.ratingsQuantity ?? 0})`,
      icon: IconStarFilled,
    },
    { title: "Shipping & Returns", icon: IconTruckDelivery },
  ];
  const rows = [
    ["Category", product.category?.name],
    ["Subcategory", product.subcategory?.map((s) => s.name).join(", ")],
    ["Brand", product.brand?.name],
    [
      "Items Sold",
      product.sold != null
        ? `${product.sold.toLocaleString()}+ sold`
        : undefined,
    ],
  ];
  return (
    <section className="mt-14 overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-gray-100">
      <div
        role="tablist"
        aria-label="Product information"
        className="flex overflow-x-auto border-b border-gray-100"
      >
        {tabs.map(({ title, icon: Icon }, index) => (
          <button
            key={title}
            ref={(element) => {
              refs.current[index] = element;
            }}
            role="tab"
            id={`product-tab-${index}`}
            aria-selected={active === index}
            aria-controls={`product-panel-${index}`}
            tabIndex={active === index ? 0 : -1}
            onClick={() => setActive(index)}
            onKeyDown={(event) => {
              let next = index;
              if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
              else if (event.key === "ArrowLeft")
                next = (index + tabs.length - 1) % tabs.length;
              else if (event.key === "Home") next = 0;
              else if (event.key === "End") next = tabs.length - 1;
              else return;
              event.preventDefault();
              setActive(next);
              refs.current[next]?.focus();
            }}
            className={`flex shrink-0 items-center gap-2 border-b-2 px-6 py-4 font-medium focus-visible:outline-2 focus-visible:outline-primary-600 ${active === index ? "border-primary-500 bg-primary-50/50 text-primary-600" : "border-transparent text-gray-600 hover:bg-gray-50"}`}
          >
            <Icon size={18} />
            {title}
          </button>
        ))}
      </div>
      {tabs.map((_, index) => (
        <div
          key={index}
          role="tabpanel"
          id={`product-panel-${index}`}
          aria-labelledby={`product-tab-${index}`}
          hidden={active !== index}
          tabIndex={0}
          className="p-6"
        >
          {index === 0 && (
            <div className="space-y-6">
              <div>
                <h2 className="mb-3 text-lg font-semibold text-gray-900">
                  About this Product
                </h2>
                <p className="leading-[26px] text-gray-600">
                  {product.description || "No description available."}
                </p>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-lg bg-gray-50 p-4">
                  <h3 className="mb-3 font-medium text-gray-900">
                    Product Information
                  </h3>
                  <dl className="space-y-2 text-sm">
                    {rows
                      .filter(([, value]) => value)
                      .map(([label, value]) => (
                        <div key={label} className="flex justify-between gap-4">
                          <dt className="text-gray-500">{label}</dt>
                          <dd className="text-right text-gray-900">{value}</dd>
                        </div>
                      ))}
                  </dl>
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                  <h3 className="mb-3 font-medium text-gray-900">
                    Key Features
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    {[
                      "Premium Quality Product",
                      "100% Authentic Guarantee",
                      "Fast & Secure Packaging",
                      "Quality Tested",
                    ].map((text) => (
                      <li key={text} className="flex items-center gap-2">
                        <IconCheck size={18} className="text-primary-500" />
                        {text}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
          {index === 1 && (
            <div>
              <div className="grid items-center gap-8 pb-8 md:grid-cols-[160px_1fr]">
                <div className="text-center">
                  <h2
                    className="mb-2 text-5xl font-bold text-gray-900"
                    aria-label="Average customer rating"
                  >
                    {product.ratingsAverage ?? 0}
                  </h2>
                  <div
                    className="mb-3 flex justify-center gap-0.5 text-amber-400"
                    aria-label={`${product.ratingsAverage ?? 0} out of 5 stars`}
                  >
                    {Array.from({ length: 5 }, (_, star) => {
                      const rating = product.ratingsAverage ?? 0;
                      const Star =
                        rating >= star + 1
                          ? IconStarFilled
                          : rating > star
                            ? IconStarHalfFilled
                            : IconStar;
                      return <Star key={star} size={22} aria-hidden="true" />;
                    })}
                  </div>
                  <p className="text-sm text-gray-500">
                    Based on {product.ratingsQuantity ?? 0} reviews
                  </p>
                </div>
                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map((stars, index) => (
                    <div
                      key={stars}
                      className="flex items-center gap-3 text-sm text-gray-500"
                    >
                      <span className="w-8 shrink-0">
                        {stars}
                        <br />
                        star
                      </span>
                      <div
                        className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200"
                        role="meter"
                        aria-label={`Illustrative ${stars} star percentage`}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={percentages[index]}
                      >
                        <div
                          className="h-full rounded-full bg-amber-400"
                          style={{ width: `${percentages[index]}%` }}
                        />
                      </div>
                      <span className="w-10 text-right">
                        {percentages[index]}%
                      </span>
                    </div>
                  ))}
                  <p className="text-xs text-gray-400">
                    Illustrative breakdown, randomly generated for preview.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center border-t border-gray-200 py-12 text-center">
                <IconStarFilled
                  size={42}
                  className="mb-4 text-gray-300"
                  aria-hidden="true"
                />
                <p className="mb-4 text-gray-500">
                  Customer reviews will be displayed here.
                </p>
                <button
                  type="button"
                  className="font-medium text-primary-600 hover:underline"
                  onClick={() =>
                    toast.info("Writing reviews is not available yet.")
                  }
                >
                  Write a Review
                </button>
              </div>
            </div>
          )}
          {index === 2 && (
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {[
                  {
                    title: "Shipping Information",
                    icon: IconTruckDelivery,
                    items: [
                      "Free shipping on orders over 500 EGP",
                      "Standard delivery: 3-5 business days",
                      "Express delivery available (1-2 business days)",
                      "Track your order in real-time",
                    ],
                  },
                  {
                    title: "Returns & Refunds",
                    icon: IconRotateClockwise,
                    items: [
                      "30-day hassle-free returns",
                      "Full refund or exchange available",
                      "Free return shipping on defective items",
                      "Easy online return process",
                    ],
                  },
                ].map(({ title, icon: Icon, items }) => (
                  <div
                    key={title}
                    className="rounded-lg bg-gradient-to-br from-green-50 to-green-100 p-6"
                  >
                    <div className="mb-4 flex items-center gap-3">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-600 text-white">
                        <Icon size={26} aria-hidden="true" />
                      </span>
                      <h2 className="font-semibold text-gray-900">{title}</h2>
                    </div>
                    <ul className="space-y-3 text-sm text-gray-600">
                      {items.map((text) => (
                        <li key={text} className="flex items-start gap-2">
                          <IconCheck
                            size={20}
                            className="shrink-0 text-primary-600"
                            aria-hidden="true"
                          />
                          {text}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 rounded-lg bg-gray-50 p-6">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-600">
                  <IconShieldHalfFilled size={28} aria-hidden="true" />
                </span>
                <div>
                  <h2 className="mb-1 font-semibold text-gray-900">
                    Buyer Protection Guarantee
                  </h2>
                  <p className="text-sm leading-relaxed text-gray-600">
                    Get a full refund if your order doesn&apos;t arrive or
                    isn&apos;t as described. We ensure your shopping experience
                    is safe and secure.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </section>
  );
}
