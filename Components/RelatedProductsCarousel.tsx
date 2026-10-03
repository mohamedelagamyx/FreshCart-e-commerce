"use client";
import { useRef } from "react";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
export default function RelatedProductsCarousel({
  children,
}: {
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  function move(direction: number) {
    const strip = ref.current;
    if (strip)
      strip.scrollBy({
        left: direction * (strip.clientWidth + 16),
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
  }
  return (
    <section className="mt-18">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="flex items-center gap-3 text-2xl font-bold text-gray-800">
          <span
            aria-hidden="true"
            className="h-8 w-1.5 rounded-full bg-primary-500"
          />
          You May Also <span className="-ml-1 text-primary-600">Like</span>
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Previous related products"
            onClick={() => move(-1)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
          >
            <IconChevronLeft size={20} />
          </button>
          <button
            type="button"
            aria-label="Next related products"
            onClick={() => move(1)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
          >
            <IconChevronRight size={20} />
          </button>
        </div>
      </div>
      <div
        ref={ref}
        className="grid auto-cols-[80%] grid-flow-col items-start gap-4 overflow-x-hidden pb-2 sm:auto-cols-[calc((100%_-_16px)/2)] lg:auto-cols-[calc((100%_-_64px)/5)]"
      >
        {children}
      </div>
    </section>
  );
}
