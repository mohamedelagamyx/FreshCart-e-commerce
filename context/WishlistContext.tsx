"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { WishlistProduct, WishlistContextType } from "@/types/wishlist.types";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined,
);
export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<WishlistProduct[]>([]);
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [mutatingIds, setMutatingIds] = useState<Set<string>>(new Set());
  const refreshWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlistItems([]);
      setWishlistIds(new Set());
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const res = await fetch("/api/wishlist", {
        headers: { "Cache-Control": "no-cache" },
      });
      if (res.status === 401) {
        setWishlistItems([]);
        setWishlistIds(new Set());
        return;
      }
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        const items: WishlistProduct[] = data.data;
        setWishlistItems(items);
        const ids = new Set<string>(items.map((item) => item._id || item.id));
        setWishlistIds(ids);
      } else {
        setWishlistItems([]);
        setWishlistIds(new Set());
      }
    } catch (err) {
      console.error("Wishlist refresh error:", err);
      setWishlistItems([]);
      setWishlistIds(new Set());
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);
  useEffect(() => {
    refreshWishlist();
  }, [refreshWishlist]);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleLogout = () => {
      setWishlistItems([]);
      setWishlistIds(new Set());
    };
    const handleAuthChange = (e: Event) => {
      const customEvent = e as CustomEvent<{
        action: string;
      }>;
      if (customEvent.detail?.action === "logout") {
        setWishlistItems([]);
        setWishlistIds(new Set());
      }
    };
    window.addEventListener("auth:logout", handleLogout);
    window.addEventListener("auth:change", handleAuthChange);
    return () => {
      window.removeEventListener("auth:logout", handleLogout);
      window.removeEventListener("auth:change", handleAuthChange);
    };
  }, []);
  const isInWishlist = useCallback(
    (productId: string) => {
      return wishlistIds.has(productId);
    },
    [wishlistIds],
  );
  const isMutating = useCallback(
    (productId: string) => {
      return mutatingIds.has(productId);
    },
    [mutatingIds],
  );
  const addToWishlist = useCallback(
    async (productId: string, product?: WishlistProduct): Promise<boolean> => {
      if (!isAuthenticated) {
        toast.error("Please sign in to save items to your wishlist");
        return false;
      }
      if (mutatingIds.has(productId)) return false;
      setMutatingIds((prev) => new Set(prev).add(productId));
      setWishlistIds((prev) => new Set(prev).add(productId));
      if (product) {
        setWishlistItems((prev) => {
          const exists = prev.some(
            (item) => (item._id || item.id) === productId,
          );
          if (exists) return prev;
          return [product, ...prev];
        });
      }
      try {
        const res = await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to add to wishlist");
        }
        if (Array.isArray(data.data)) {
          setWishlistIds(new Set(data.data));
        }
        toast.success("Added to your wishlist");
        return true;
      } catch (error: unknown) {
        console.error("Add to wishlist error:", error);
        setWishlistIds((prev) => {
          const next = new Set(prev);
          next.delete(productId);
          return next;
        });
        setWishlistItems((prev) =>
          prev.filter((item) => (item._id || item.id) !== productId),
        );
        const message =
          error instanceof Error
            ? error.message
            : "Could not save item to wishlist";
        toast.error(message);
        return false;
      } finally {
        setMutatingIds((prev) => {
          const next = new Set(prev);
          next.delete(productId);
          return next;
        });
      }
    },
    [isAuthenticated, mutatingIds],
  );
  const removeFromWishlist = useCallback(
    async (productId: string): Promise<boolean> => {
      if (!isAuthenticated) {
        toast.error("Please sign in to manage your wishlist");
        return false;
      }
      if (mutatingIds.has(productId)) return false;
      let removedItem: WishlistProduct | undefined;
      setWishlistItems((prev) => {
        removedItem = prev.find((item) => (item._id || item.id) === productId);
        return prev.filter((item) => (item._id || item.id) !== productId);
      });
      setMutatingIds((prev) => new Set(prev).add(productId));
      setWishlistIds((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
      try {
        const res = await fetch(`/api/wishlist/${productId}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to remove from wishlist");
        }
        if (Array.isArray(data.data)) {
          setWishlistIds(new Set(data.data));
        }
        toast.info("Removed from your wishlist");
        return true;
      } catch (error: unknown) {
        console.error("Remove from wishlist error:", error);
        setWishlistIds((prev) => new Set(prev).add(productId));
        if (removedItem) {
          setWishlistItems((prev) => {
            const exists = prev.some(
              (item) => (item._id || item.id) === productId,
            );
            if (exists) return prev;
            return [removedItem!, ...prev];
          });
        }
        const message =
          error instanceof Error
            ? error.message
            : "Could not remove item from wishlist";
        toast.error(message);
        return false;
      } finally {
        setMutatingIds((prev) => {
          const next = new Set(prev);
          next.delete(productId);
          return next;
        });
      }
    },
    [isAuthenticated, mutatingIds],
  );
  const toggleWishlist = useCallback(
    async (
      product:
        | WishlistProduct
        | {
            id?: string;
            _id?: string;
            title: string;
          },
    ) => {
      const id = product._id || product.id;
      if (!id) return;
      if (isInWishlist(id)) {
        await removeFromWishlist(id);
      } else {
        await addToWishlist(id, product as WishlistProduct);
      }
    },
    [isInWishlist, removeFromWishlist, addToWishlist],
  );
  const itemCount = useMemo(() => {
    return wishlistIds.size;
  }, [wishlistIds]);
  const value: WishlistContextType = {
    wishlistItems,
    wishlistIds,
    itemCount,
    isLoading,
    isMutating,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    refreshWishlist,
  };
  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}
export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
