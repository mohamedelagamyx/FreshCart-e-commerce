"use client";
import { useState } from "react";
import {
  IconMail,
  IconCheck,
  IconArrowRight,
  IconBrandApple,
  IconBrandGooglePlay,
  IconStarFilled,
} from "@tabler/icons-react";
import { toast } from "sonner";
import styles from "./Home.module.css";
export default function NewsletterBanner() {
  const [email, setEmail] = useState("");
  function subscribe(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    toast.info("Newsletter subscriptions are not available yet.");
  }
  return (
    <section className={styles.newsletter}>
      <div className={styles.newsletterContent}>
        <div className={styles.newsletterLabel}>
          <span>
            <IconMail size={22} />
          </span>
          <div>
            <strong>NEWSLETTER</strong>
            <p>Fresh updates for you</p>
          </div>
        </div>
        <h2>
          Get the Freshest Updates <span>Delivered Free</span>
        </h2>
        <p>Weekly recipes, seasonal offers & exclusive member perks.</p>
        <div className={styles.newsletterBenefits}>
          {[
            "Fresh Picks Weekly",
            "Free Delivery Codes",
            "Members-Only Deals",
          ].map((text) => (
            <span key={text}>
              <IconCheck size={14} />
              {text}
            </span>
          ))}
        </div>
        <form onSubmit={subscribe}>
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
          <button type="submit">
            Subscribe
            <IconArrowRight size={18} />
          </button>
        </form>
        <small>Unsubscribe anytime. No spam, ever.</small>
      </div>
      <aside className={styles.appPanel}>
        <span className={styles.appLabel}>MOBILE APP</span>
        <h3>Shop Faster on Our App</h3>
        <p>Get app-exclusive deals & 15% off your first order.</p>
        <div className={styles.appButtons}>
          <button
            type="button"
            onClick={() =>
              toast.info("The FreshCart mobile app is coming soon.")
            }
          >
            <IconBrandApple size={26} />
            <span>
              <small>Download on the</small>App Store
            </span>
          </button>
          <button
            type="button"
            onClick={() =>
              toast.info("The FreshCart mobile app is coming soon.")
            }
          >
            <IconBrandGooglePlay size={25} />
            <span>
              <small>GET IT ON</small>Google Play
            </span>
          </button>
        </div>
        <div className={styles.appStars}>
          {Array.from({ length: 5 }, (_, index) => (
            <IconStarFilled key={index} size={13} />
          ))}
          <span>FreshCart on the go</span>
        </div>
      </aside>
    </section>
  );
}
