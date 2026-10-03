import Link from "next/link";
import { IconArrowRight, IconFlame, IconSparkles } from "@tabler/icons-react";
import styles from "./Home.module.css";
export default function PromoBanners() {
  return (
    <section
      id="home-deals"
      className={styles.promos}
      aria-label="FreshCart offers"
    >
      <article className={styles.fruitPromo}>
        <span className={styles.promoBadge}>
          <IconFlame size={14} />
          Deal of the Day
        </span>
        <h2>Fresh Organic Fruits</h2>
        <p>Get up to 40% off on selected organic fruits</p>
        <div className={styles.promoOffer}>
          <strong>40% OFF</strong>
          <span>
            Use code: <b>ORGANIC40</b>
          </span>
        </div>
        <Link href="/products?category=6439d41c67d9aa4ca97064d5">
          Shop Now
          <IconArrowRight size={16} />
        </Link>
      </article>
      <article className={styles.vegetablePromo}>
        <span className={styles.promoBadge}>
          <IconSparkles size={14} />
          New Arrivals
        </span>
        <h2>Exotic Vegetables</h2>
        <p>Discover our latest collection of premium vegetables</p>
        <div className={styles.promoOffer}>
          <strong>25% OFF</strong>
          <span>
            Use code: <b>FRESH25</b>
          </span>
        </div>
        <Link href="/products?category=6439d41c67d9aa4ca97064d5&sort=-createdAt">
          Explore Now
          <IconArrowRight size={16} />
        </Link>
      </article>
    </section>
  );
}
