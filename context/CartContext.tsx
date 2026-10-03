"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { Cart, CartContextType } from "@/types/cart.types";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useRouter, usePathname } from "next/navigation";
const CartContext = createContext<CartContextType | undefined>(undefined);
function emptyCart(): Cart {
  return {
    cartId: null,
    products: [],
    totalCartPrice: 0,
    numOfCartItems: 0,
  };
}
export function CartProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [mutatingProductId, setMutatingProductId] = useState<string | null>(
    null,
  );
  const router = useRouter();
  const pathname = usePathname();
  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(null);
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const res = await fetch("/api/cart", {
        headers: { "Cache-Control": "no-cache" },
      });
      if (res.status === 401) {
        setCart(null);
        return;
      }
      const data = await res.json();
      if (data.success && data.data) {
        setCart(data.data);
      } else {
        setCart(emptyCart());
      }
    } catch (err) {
      console.error("Cart refresh error:", err);
      setCart(emptyCart());
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleLogout = () => {
      setCart(null);
    };
    const handleAuthChange = (e: Event) => {
      const customEvent = e as CustomEvent<{
        action: string;
      }>;
      if (customEvent.detail?.action === "logout") {
        setCart(null);
      } else {
        refreshCart();
      }
    };
    window.addEventListener("freshcart:logout", handleLogout);
    window.addEventListener("freshcart:auth-change", handleAuthChange);
    return () => {
      window.removeEventListener("freshcart:logout", handleLogout);
      window.removeEventListener("freshcart:auth-change", handleAuthChange);
    };
  }, [refreshCart]);
  const addToCart = async (
    productId: string,
    quantity: number = 1,
  ): Promise<{
    success: boolean;
    message?: string;
  }> => {
    if (!isAuthenticated) {
      toast.info("Please sign in to add items to your cart");
      const returnUrl = encodeURIComponent(pathname || "/cart");
      router.push(`/login?returnUrl=${returnUrl}`);
      return { success: false, message: "Please sign in to continue" };
    }
    try {
      setMutatingProductId(productId);
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setCart(data.data);
        toast.success(data.message || "Added to cart successfully");
        return { success: true };
      } else {
        toast.error(data.message || "Failed to add to cart");
        return { success: false, message: data.message };
      }
    } catch {
      toast.error("Network error while adding to cart. Please try again.");
      return { success: false, message: "Network error" };
    } finally {
      setMutatingProductId(null);
    }
  };
  const updateQuantity = async (
    productId: string,
    count: number,
  ): Promise<{
    success: boolean;
    message?: string;
  }> => {
    if (!cart) return { success: false };
    const previousCart = cart;
    const updatedProducts = cart.products.map((item) => {
      const itemProdId =
        typeof item.product === "object" ? item.product._id : item.product;
      if (itemProdId === productId) {
        return { ...item, count };
      }
      return item;
    });
    const newTotalPrice = updatedProducts.reduce(
      (sum, item) => sum + item.price * item.count,
      0,
    );
    setCart({
      ...cart,
      products: updatedProducts,
      totalCartPrice: newTotalPrice,
    });
    try {
      setMutatingProductId(productId);
      const res = await fetch(`/api/cart/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ count }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setCart(data.data);
        return { success: true };
      } else {
        setCart(previousCart);
        toast.error(data.message || "Failed to update quantity");
        return { success: false, message: data.message };
      }
    } catch {
      setCart(previousCart);
      toast.error("Network error. Quantity restored.");
      return { success: false, message: "Network error" };
    } finally {
      setMutatingProductId(null);
    }
  };
  const removeItem = async (
    productId: string,
  ): Promise<{
    success: boolean;
    message?: string;
  }> => {
    if (!cart) return { success: false };
    const previousCart = cart;
    const updatedProducts = cart.products.filter((item) => {
      const itemProdId =
        typeof item.product === "object" ? item.product._id : item.product;
      return itemProdId !== productId;
    });
    const newTotalPrice = updatedProducts.reduce(
      (sum, item) => sum + item.price * item.count,
      0,
    );
    setCart({
      ...cart,
      products: updatedProducts,
      totalCartPrice: newTotalPrice,
      numOfCartItems: updatedProducts.length,
    });
    try {
      setMutatingProductId(productId);
      const res = await fetch(`/api/cart/${productId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success && data.data) {
        setCart(data.data);
        toast.success("Item removed from your cart");
        return { success: true };
      } else {
        setCart(previousCart);
        toast.error(data.message || "Failed to remove item");
        return { success: false, message: data.message };
      }
    } catch {
      setCart(previousCart);
      toast.error("Network error. Could not remove item.");
      return { success: false, message: "Network error" };
    } finally {
      setMutatingProductId(null);
    }
  };
  const clearCart = async (): Promise<{
    success: boolean;
    message?: string;
  }> => {
    if (!cart) return { success: false };
    const previousCart = cart;
    setCart(emptyCart());
    try {
      const res = await fetch("/api/cart", {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setCart(emptyCart());
        toast.success("Your cart has been cleared");
        return { success: true };
      } else {
        setCart(previousCart);
        toast.error(data.message || "Failed to clear cart");
        return { success: false, message: data.message };
      }
    } catch {
      setCart(previousCart);
      toast.error("Network error. Cart restored.");
      return { success: false, message: "Network error" };
    }
  };
  const clearLocalCart = () => {
    setCart(emptyCart());
  };
  return (
    <CartContext.Provider
      value={{
        cart,
        cartId: cart?.cartId || null,
        itemCount: cart?.numOfCartItems || 0,
        totalPrice: cart?.totalCartPrice || 0,
        isLoading,
        mutatingProductId,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        clearLocalCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
