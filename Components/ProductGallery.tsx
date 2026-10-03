"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
export default function ProductGallery({
  images,
  title,
  imageCover,
}: {
  images: string[];
  title: string;
  imageCover?: string;
}) {
  const productImages = (images || []).filter((url) => Boolean(url?.trim()));
  const allImages = Array.from(
    new Set(
      productImages.length
        ? productImages
        : [imageCover || "/product-placeholder.svg"],
    ),
  );
  const [activeImage, setActiveImage] = useState(
    allImages[allImages.length - 1] || "/product-placeholder.svg",
  );
  const thumbnails = useRef<HTMLDivElement>(null);
  const positioned = useRef(false);
  const activeIndex = allImages.indexOf(activeImage);
  useEffect(() => {
    const strip = thumbnails.current;
    const selected = strip?.children[activeIndex] as HTMLElement | undefined;
    if (strip && selected) {
      const left =
        strip.scrollLeft +
        selected.getBoundingClientRect().left -
        strip.getBoundingClientRect().left -
        (strip.clientWidth - selected.clientWidth) / 2;
      strip.scrollTo({
        left: Math.max(0, left),
        behavior:
          positioned.current &&
          !window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "smooth"
            : "instant",
      });
      positioned.current = true;
    }
  }, [activeIndex]);
  return (
    <div className="overflow-hidden rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
      <div className="relative aspect-[344/469] w-full">
        <Image
          src={activeImage}
          alt={title}
          fill
          sizes="(max-width: 767px) 90vw, 344px"
          className="object-contain"
          priority
          onError={() => setActiveImage("/product-placeholder.svg")}
        />
      </div>
      {allImages.length > 1 && (
        <div
          ref={thumbnails}
          className="flex gap-0.5 overflow-x-auto py-[5px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {allImages.map((url, index) => (
            <button
              key={url}
              type="button"
              onClick={() => setActiveImage(url)}
              aria-label={`View photo ${index + 1} of ${title}`}
              aria-pressed={activeImage === url}
              className={`relative h-[133px] w-[100px] shrink-0 border-4 bg-white focus-visible:outline-2 focus-visible:outline-primary-600 ${activeImage === url ? "border-gray-500" : "border-transparent hover:border-gray-300"}`}
            >
              <Image
                src={url}
                alt={`${title}, photo ${index + 1}`}
                fill
                sizes="92px"
                className="object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
