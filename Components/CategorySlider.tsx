"use client";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";
import type { ProductCategory } from "@/types/product.types";
import styles from "./Home.module.css";
export default function CategorySlider() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const loadCategories = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(false);
    try {
      const response = await fetch("/api/categories", { signal });
      const data = await response.json();
      if (!response.ok || !data.success || !Array.isArray(data.data))
        throw new Error("Categories unavailable");
      setCategories(data.data);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      setError(true);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    loadCategories(controller.signal);
    return () => controller.abort();
  }, [loadCategories]);
  return (
    <section className={styles.categories}>
      <div className={styles.sectionHeading}>
        <h2>
          Shop By <span>Category</span>
        </h2>
        <Link href="/categories">
          View All Categories
          <IconArrowRight size={16} />
        </Link>
      </div>
      {error ? (
        <div className={styles.categoryError} role="alert">
          Unable to load categories.
          <button onClick={() => loadCategories()}>Try Again</button>
        </div>
      ) : (
        <div className={styles.categoryGrid}>
          {loading
            ? Array.from({ length: 10 }, (_, index) => (
                <div
                  className={`${styles.categoryCard} animate-pulse`}
                  key={index}
                >
                  <div className={styles.categoryPhoto} />
                  <div className="h-3 w-16 bg-gray-100 rounded" />
                </div>
              ))
            : categories.map((category) => (
                <Link
                  className={styles.categoryCard}
                  href={`/products?category=${category._id}`}
                  key={category._id}
                >
                  <div className={styles.categoryPhoto}>
                    <Image
                      src={category.image || "/product-placeholder.svg"}
                      alt={category.name}
                      fill
                      sizes="80px"
                    />
                  </div>
                  <span>{category.name}</span>
                </Link>
              ))}
        </div>
      )}
      {!loading && !error && categories.length === 0 && (
        <p className="store-muted">Categories are currently unavailable.</p>
      )}
    </section>
  );
}
