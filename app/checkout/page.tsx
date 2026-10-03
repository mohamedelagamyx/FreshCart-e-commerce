import type { Metadata } from "next";
import CheckoutView from "@/Templates/CheckoutView";
export const metadata: Metadata = {
  title: "Checkout - FreshCart",
  description:
    "Complete your grocery order with Cash on Delivery or secure online payment.",
};
export default function CheckoutPage() {
  return <CheckoutView />;
}
