import Link from "next/link";
import Image from "next/image";
import logo from "@/Assets/images/freshcart-logo.svg";
import {
  IconTruck,
  IconRotateClockwise,
  IconShieldHalfFilled,
  IconHeadset,
  IconPhoneFilled,
  IconMailFilled,
  IconMapPinFilled,
  IconBrandFacebookFilled,
  IconBrandTwitterFilled,
  IconBrandInstagram,
  IconBrandYoutubeFilled,
  IconCreditCard,
} from "@tabler/icons-react";
const columns = [
  [
    "Shop",
    [
      ["All Products", "/products"],
      ["Categories", "/categories"],
      ["Brands", "/brands"],
      ["Electronics", "/products?category=6439d2d167d9aa4ca970649f"],
      ["Men's Fashion", "/products?category=6439d5b90049ad0b52b90048"],
      ["Women's Fashion", "/products?category=6439d58a0049ad0b52b9003f"],
    ],
  ],
  [
    "Account",
    [
      ["My Account", "/account"],
      ["Order History", "/orders"],
      ["Wishlist", "/wishlist"],
      ["Shopping Cart", "/cart"],
      ["Sign In", "/login"],
      ["Create Account", "/signup"],
    ],
  ],
  [
    "Support",
    [
      ["Contact Us", "mailto:support@freshcart.com"],
      ["Help Center", "mailto:support@freshcart.com"],
      ["Shipping Info", "#shopping-benefits"],
      ["Returns & Refunds", "#shopping-benefits"],
      ["Track Order", "/orders"],
    ],
  ],
  [
    "Legal",
    [
      [
        "Privacy Policy",
        "mailto:support@freshcart.com?subject=Privacy%20Policy",
      ],
      [
        "Terms of Service",
        "mailto:support@freshcart.com?subject=Terms%20of%20Service",
      ],
      ["Cookie Policy", "mailto:support@freshcart.com?subject=Cookie%20Policy"],
    ],
  ],
] as const;
export default function Footer() {
  return (
    <>
      <section
        id="shopping-benefits"
        className="footer-trust"
        aria-label="Shopping benefits"
      >
        <div className="store-container footer-trust-grid">
          {[
            [IconTruck, "Free Shipping", "On orders over 500 EGP"],
            [IconRotateClockwise, "Easy Returns", "14-day return policy"],
            [IconShieldHalfFilled, "Secure Payment", "100% secure checkout"],
            [IconHeadset, "24/7 Support", "Contact us anytime"],
          ].map(([Icon, title, copy]) => {
            const BenefitIcon = Icon as typeof IconTruck;
            return (
              <div key={title as string}>
                <BenefitIcon size={22} aria-hidden="true" />
                <div>
                  <h3>{title as string}</h3>
                  <p>{copy as string}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      <footer className="store-footer">
        <div className="store-container footer-columns">
          <div className="footer-brand">
            <Link href="/">
              <Image src={logo} alt="FreshCart" width={164} height={32} />
            </Link>
            <p>
              FreshCart is your one-stop destination for quality products. From
              fashion to electronics, we bring you the best brands at
              competitive prices with a seamless shopping experience.
            </p>
            <div className="footer-contact">
              <a href="tel:+18001234567">
                <IconPhoneFilled size={16} />
                +1 (800) 123-4567
              </a>
              <a href="mailto:support@freshcart.com">
                <IconMailFilled size={16} />
                support@freshcart.com
              </a>
              <p>
                <IconMapPinFilled size={16} />
                123 Commerce Street, New York, NY 10001
              </p>
            </div>
            <div className="footer-social">
              {[
                [
                  IconBrandFacebookFilled,
                  "Facebook",
                  "https://www.facebook.com",
                ],
                [IconBrandTwitterFilled, "Twitter", "https://twitter.com"],
                [IconBrandInstagram, "Instagram", "https://www.instagram.com"],
                [IconBrandYoutubeFilled, "YouTube", "https://www.youtube.com"],
              ].map(([Icon, name, href]) => {
                const SocialIcon = Icon as typeof IconBrandFacebookFilled;
                return (
                  <a
                    key={name as string}
                    href={href as string}
                    aria-label={name as string}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <SocialIcon size={18} />
                  </a>
                );
              })}
            </div>
          </div>
          {columns.map(([title, links]) => (
            <div key={title}>
              <h3>{title}</h3>
              <ul>
                {links.map(([label, href]) => (
                  <li key={label}>
                    <Link href={href}>{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <div className="store-container">
            <p>© {new Date().getFullYear()} FreshCart. All rights reserved.</p>
            <div className="footer-payments">
              {["Visa", "Mastercard", "PayPal"].map((name) => (
                <span key={name}>
                  <IconCreditCard size={16} />
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
