import type { Metadata } from "next";
import "@/Assets/styles/globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { Toaster } from "sonner";
import Navbar from "@/Templates/Navbar";
import Footer from "@/Templates/Footer";
export const metadata: Metadata = {
  title: "FreshCart - Your One-Stop Grocery Store",
  description:
    "Shop fresh vegetables, fruits, groceries, and daily essentials online with fast delivery.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="min-h-screen flex flex-col bg-gray-50 text-gray-800 antialiased font-sans"
      >
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Navbar />
              <main className="grow">{children}</main>
              <Footer />
              <Toaster position="top-right" richColors closeButton />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
