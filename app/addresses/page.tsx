import { Metadata } from "next";
import AddressesView from "@/Templates/AddressesView";
export const metadata: Metadata = {
  title: "Delivery Addresses | FreshCart",
  description:
    "Manage your saved delivery addresses for fast and seamless checkout.",
};
export default function AddressesPage() {
  return <AddressesView />;
}
