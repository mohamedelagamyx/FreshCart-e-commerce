"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  IconArrowRight,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import heroImage from "@/Assets/images/home-slider-1.png";
import styles from "./Home.module.css";
const slides = [
  {
    title: ["Fresh Products Delivered", "to your Door"],
    subtitle: "Get 20% off your first order",
    badge: "Free Shipping on Orders Over 500 EGP",
    primary: "Shop Now",
    secondary: "View Deals",
    secondaryLink: "#home-deals",
    accent: "green",
  },
  {
    title: ["Premium Quality", "Guaranteed"],
    subtitle: "Fresh from farm to your table",
    badge: "Premium Quality Guaranteed",
    primary: "Shop Now",
    secondary: "Learn More",
    secondaryLink: "/categories",
    accent: "blue",
  },
  {
    title: ["Fast & Free Delivery"],
    subtitle: "Same day delivery available",
    badge: "Free Shipping on Orders Over 500 EGP",
    primary: "Order Now",
    secondary: "Delivery Info",
    secondaryLink: "#shopping-benefits",
    accent: "purple",
  },
] as const;
export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [interacting, setInteracting] = useState(false);
  useEffect(() => {
    if (
      interacting ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const timer = window.setInterval(
      () => setCurrent((value) => (value + 1) % slides.length),
      6000,
    );
    return () => window.clearInterval(timer);
  }, [interacting, current]);
  const slide = slides[current];
  function move(direction: number) {
    setCurrent((value) => (value + direction + slides.length) % slides.length);
  }
  return (
    <section
      className={styles.hero}
      aria-label="FreshCart promotions"
      aria-roledescription="carousel"
      onMouseEnter={() => setInteracting(true)}
      onMouseLeave={() => setInteracting(false)}
      onFocusCapture={() => setInteracting(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null))
          setInteracting(false);
      }}
    >
      <Image
        src={heroImage}
        alt=""
        fill
        priority
        sizes="(max-width: 1568px) 100vw, 1504px"
        className={styles.heroImage}
      />
      <div className={styles.heroOverlay} />
      <div
        className={styles.heroContent}
        role="group"
        aria-roledescription="slide"
        aria-label={`${current + 1} of ${slides.length}`}
      >
        <span className={styles.heroBadge}>{slide.badge}</span>
        <h1>
          {slide.title.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h1>
        <p>{slide.subtitle}</p>
        <div className={styles.heroActions}>
          <Link
            href="/products"
            className={`${styles.heroPrimary} ${styles[slide.accent]}`}
          >
            {slide.primary}
            <IconArrowRight size={18} />
          </Link>
          <Link href={slide.secondaryLink} className={styles.heroSecondary}>
            {slide.secondary}
          </Link>
        </div>
      </div>
      <button
        type="button"
        className={`${styles.heroArrow} ${styles.previous}`}
        onClick={() => move(-1)}
        aria-label="Previous promotion"
      >
        <IconChevronLeft size={24} />
      </button>
      <button
        type="button"
        className={`${styles.heroArrow} ${styles.next}`}
        onClick={() => move(1)}
        aria-label="Next promotion"
      >
        <IconChevronRight size={24} />
      </button>
      <div className={styles.heroDots}>
        {slides.map((item, index) => (
          <button
            key={item.accent}
            type="button"
            aria-label={`Show promotion ${index + 1}: ${item.title.join(" ")}`}
            aria-current={index === current ? "true" : undefined}
            className={index === current ? styles.activeDot : ""}
            onClick={() => setCurrent(index)}
          />
        ))}
      </div>
    </section>
  );
}
