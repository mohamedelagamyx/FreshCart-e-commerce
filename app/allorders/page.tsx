import type { Metadata } from "next";
import OrdersView from "@/Templates/OrdersView";
export const metadata: Metadata = {
  title: "My Orders & Receipts - FreshCart",
  description:
    "View your past FreshCart grocery orders, delivery receipts, and fulfillment status.",
};
export default function AllOrdersPage() {
  return <OrdersView />;
}
