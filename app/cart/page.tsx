import type { Metadata } from "next";
import CartView from "@/Templates/CartView";
export const metadata: Metadata = {
  title: "Shopping Cart - FreshCart",
  description:
    "Review and manage items in your FreshCart shopping cart before proceeding to checkout.",
};
export default function CartPage() {
  return <CartView />;
}
