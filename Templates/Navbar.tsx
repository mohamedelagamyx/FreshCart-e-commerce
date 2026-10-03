"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  IconChevronDown,
  IconGift,
  IconHeadset,
  IconHeart,
  IconLogout,
  IconMail,
  IconMenu2,
  IconPhone,
  IconSearch,
  IconShoppingCart,
  IconTruckDelivery,
  IconUser,
  IconX,
} from "@tabler/icons-react";
import logo from "@/Assets/images/freshcart-logo.svg";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import styles from "./Navbar.module.css";
export default function Navbar() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { itemCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [topBarHidden, setTopBarHidden] = useState(false);
  const categoriesRef = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    function closeCategories(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !categoriesRef.current?.contains(event.target)
      ) {
        categoriesRef.current?.removeAttribute("open");
      }
    }
    document.addEventListener("pointerdown", closeCategories);
    return () => document.removeEventListener("pointerdown", closeCategories);
  }, []);
  useEffect(() => {
    let previousScrollY = Math.max(0, window.scrollY);
    function handleScroll() {
      const scrollY = Math.max(0, window.scrollY);
      const difference = scrollY - previousScrollY;
      if (scrollY <= 41) {
        setTopBarHidden(false);
        previousScrollY = scrollY;
        return;
      }
      if (Math.abs(difference) < 6) return;
      setTopBarHidden(difference > 0);
      previousScrollY = scrollY;
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMobileOpen(false);
    router.push(
      search.trim()
        ? `/products?search=${encodeURIComponent(search.trim())}`
        : "/products",
    );
  }
  async function signOut() {
    setMobileOpen(false);
    await logout();
  }
  return (
    <header
      className={
        styles.header + (topBarHidden ? " " + styles.topBarHidden : "")
      }
    >
      <div
        className={styles.topBar}
        inert={topBarHidden}
        aria-hidden={topBarHidden}
      >
        <div className={styles.container + " " + styles.topInner}>
          <div className={styles.promotions}>
            <span>
              <IconTruckDelivery size={16} aria-hidden="true" />
              Free Shipping on Orders 500 EGP
            </span>
            <span>
              <IconGift size={16} aria-hidden="true" />
              New Arrivals Daily
            </span>
          </div>
          <div className={styles.topRight}>
            <a href="tel:+18001234567">
              <IconPhone size={14} aria-hidden="true" />
              +1 (800) 123-4567
            </a>
            <a href="mailto:support@freshcart.com" className={styles.email}>
              <IconMail size={14} aria-hidden="true" />
              support@freshcart.com
            </a>
            <div className={styles.account}>
              {isLoading ? (
                <span
                  aria-label="Loading account"
                  className={styles.accountLoading}
                />
              ) : isAuthenticated ? (
                <>
                  <Link href="/account">
                    <IconUser size={14} aria-hidden="true" />
                    <span className={styles.name}>
                      {user?.name?.split(" ")[0] || "Account"}
                    </span>
                  </Link>
                  <button type="button" onClick={signOut}>
                    <IconLogout size={14} aria-hidden="true" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <IconUser size={14} aria-hidden="true" />
                    Sign In
                  </Link>
                  <Link href="/signup">Sign Up</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.container + " " + styles.mainRow}>
        <Link href="/" className={styles.logo} aria-label="FreshCart home">
          <Image src={logo} alt="FreshCart" width={160} height={31} priority />
        </Link>
        <form role="search" onSubmit={submitSearch} className={styles.search}>
          <label htmlFor="header-product-search" className="sr-only">
            Search products
          </label>
          <input
            id="header-product-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search for products, brands and more..."
          />
          <button type="submit" aria-label="Search catalog">
            <IconSearch size={18} aria-hidden="true" />
          </button>
        </form>

        <nav aria-label="Main navigation" className={styles.desktopNav}>
          <Link href="/">Home</Link>
          <Link href="/products">Shop</Link>
          <details
            ref={categoriesRef}
            className={styles.categories}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.currentTarget.open = false;
                event.currentTarget.querySelector("summary")?.focus();
              }
            }}
            onBlur={(event) => {
              if (
                !event.currentTarget.contains(
                  event.relatedTarget as Node | null,
                )
              )
                event.currentTarget.open = false;
            }}
          >
            <summary>
              Categories
              <IconChevronDown size={14} aria-hidden="true" />
            </summary>
            <div className={styles.categoryMenu}>
              {[
                ["All Categories", "/categories"],
                ["Electronics", "/products?category=6439d2d167d9aa4ca970649f"],
                [
                  "Women's Fashion",
                  "/products?category=6439d58a0049ad0b52b9003f",
                ],
                [
                  "Men's Fashion",
                  "/products?category=6439d5b90049ad0b52b90048",
                ],
                [
                  "Beauty & Health",
                  "/products?category=6439d30b67d9aa4ca97064b1",
                ],
              ].map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => {
                    categoriesRef.current?.removeAttribute("open");
                  }}
                >
                  {label}
                </Link>
              ))}
            </div>
          </details>
          <Link href="/brands">Brands</Link>
        </nav>

        <a
          href="mailto:support@freshcart.com"
          className={styles.support}
          aria-label="Contact FreshCart support"
        >
          <span className={styles.supportIcon}>
            <IconHeadset size={20} aria-hidden="true" />
          </span>
          <span>
            <span className={styles.supportLabel}>Support</span>
            <strong>24/7 Help</strong>
          </span>
        </a>

        <div className={styles.actions}>
          <Link
            href="/wishlist"
            aria-label={`View wishlist, ${wishlistCount} items`}
            className={styles.action}
          >
            <IconHeart size={26} stroke={1.8} aria-hidden="true" />
            {wishlistCount > 0 && (
              <span className={styles.badge + " " + styles.wishlistBadge}>
                {wishlistCount}
              </span>
            )}
          </Link>
          <Link
            href="/cart"
            aria-label={`View shopping cart, ${itemCount} items`}
            className={styles.action}
          >
            <IconShoppingCart size={26} stroke={1.8} aria-hidden="true" />
            {itemCount > 0 && (
              <span className={styles.badge + " " + styles.cartBadge}>
                {itemCount}
              </span>
            )}
          </Link>
          {isAuthenticated ? (
            <Link
              href="/account"
              aria-label="View my account"
              className={styles.action + " " + styles.addresses}
            >
              <IconUser size={26} aria-hidden="true" />
            </Link>
          ) : (
            <Link href="/login" className={styles.signIn}>
              <IconUser size={16} aria-hidden="true" />
              Sign In
            </Link>
          )}
          <button
            type="button"
            className={styles.action + " " + styles.mobileToggle}
            aria-label={
              mobileOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? (
              <IconX size={24} aria-hidden="true" />
            ) : (
              <IconMenu2 size={24} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className={styles.mobileNav}
        >
          {[
            ["Home", "/"],
            ["Shop", "/products"],
            ["Categories", "/categories"],
            ["Brands", "/brands"],
            ["Wishlist", "/wishlist"],
            ["Shopping Cart", "/cart"],
            ["Orders", "/orders"],
            ["Saved Addresses", "/addresses"],
          ].map(([label, href]) => (
            <Link key={href} href={href} onClick={() => setMobileOpen(false)}>
              {label}
            </Link>
          ))}
          <a href="mailto:support@freshcart.com">Support, 24/7 Help</a>
          {!isLoading &&
            (isAuthenticated ? (
              <button type="button" onClick={signOut}>
                Sign Out ({user?.name?.split(" ")[0] || "Account"})
              </button>
            ) : (
              <div className={styles.mobileAuth}>
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  Sign In
                </Link>
                <Link href="/signup" onClick={() => setMobileOpen(false)}>
                  Create Account
                </Link>
              </div>
            ))}
        </nav>
      )}
    </header>
  );
}
