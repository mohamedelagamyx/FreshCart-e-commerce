import { Metadata } from "next";
import WishlistView from "@/Templates/WishlistView";
export const metadata: Metadata = {
  title: "My Wishlist | FreshCart",
  description:
    "View and manage your saved fresh groceries, produce, and daily essentials.",
};
export default function WishlistPage() {
  return <WishlistView />;
}
