"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { User } from "@/types/auth.types";
import { LoginFormValues, SignupFormValues } from "@/schemas/auth.schema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { sanitizeReturnUrl } from "@/lib/auth-utils";
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    data: LoginFormValues,
    returnUrl?: string,
  ) => Promise<{
    success: boolean;
    message?: string;
  }>;
  signup: (
    data: SignupFormValues,
    returnUrl?: string,
  ) => Promise<{
    success: boolean;
    message?: string;
  }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateUser: (user: User) => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
function cacheUserDisplay(user: User) {
  try {
    sessionStorage.setItem(
      "freshcart_user",
      JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      }),
    );
  } catch {}
}
function withCachedDisplay(user: User): User {
  try {
    const cached = JSON.parse(
      sessionStorage.getItem("freshcart_user") || "null",
    );
    if (!user.id || cached?.id !== user.id) return user;
    return {
      ...user,
      name: typeof cached.name === "string" ? cached.name : user.name,
      email: typeof cached.email === "string" ? cached.email : user.email,
      phone: typeof cached.phone === "string" ? cached.phone : user.phone,
    };
  } catch {
    return user;
  }
}
function clearPrivateCaches() {
  if (typeof window === "undefined") return;
  try {
    const keysToRemove = [
      "freshcart_cart",
      "freshcart_wishlist",
      "freshcart_user",
    ];
    keysToRemove.forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
    window.dispatchEvent(new Event("freshcart:logout"));
    window.dispatchEvent(
      new CustomEvent("freshcart:auth-change", {
        detail: { action: "logout" },
      }),
    );
  } catch (err) {
    console.error("Failed to clear private caches:", err);
  }
}
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", {
        headers: { "Cache-Control": "no-cache" },
      });
      const data = await res.json();
      if (data.isAuthenticated && data.user) {
        setUser(withCachedDisplay(data.user));
      } else {
        if (data.message === "Session expired") {
          clearPrivateCaches();
        }
        setUser(null);
      }
    } catch (err) {
      console.error("Check auth error:", err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  useEffect(() => {
    if (typeof window === "undefined" || !("BroadcastChannel" in window)) {
      return;
    }
    const channel = new BroadcastChannel("freshcart_auth");
    channel.onmessage = (event) => {
      if (event.data?.type === "LOGOUT") {
        clearPrivateCaches();
        setUser(null);
        toast.info("Session ended in another tab");
      } else if (event.data?.type === "LOGIN") {
        checkAuth();
      }
    };
    return () => {
      channel.close();
    };
  }, [checkAuth]);
  const login = async (values: LoginFormValues, returnUrl: string = "/") => {
    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (data.success && data.user) {
        cacheUserDisplay(data.user);
        setUser(data.user);
        toast.success(data.message || "Signed in successfully");
        if (typeof window !== "undefined" && "BroadcastChannel" in window) {
          const channel = new BroadcastChannel("freshcart_auth");
          channel.postMessage({ type: "LOGIN" });
          channel.close();
        }
        const safeUrl = sanitizeReturnUrl(returnUrl);
        router.push(safeUrl);
        router.refresh();
        return { success: true };
      } else {
        toast.error(data.message || "Sign in failed");
        return { success: false, message: data.message };
      }
    } catch {
      toast.error("An unexpected error occurred. Please try again.");
      return { success: false, message: "Network error" };
    }
  };
  const signup = async (values: SignupFormValues, returnUrl: string = "/") => {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (data.success && data.user) {
        cacheUserDisplay(data.user);
        setUser(data.user);
        toast.success(data.message || "Account created successfully");
        if (typeof window !== "undefined" && "BroadcastChannel" in window) {
          const channel = new BroadcastChannel("freshcart_auth");
          channel.postMessage({ type: "LOGIN" });
          channel.close();
        }
        const safeUrl = sanitizeReturnUrl(returnUrl);
        router.push(safeUrl);
        router.refresh();
        return { success: true };
      } else {
        toast.error(data.message || "Sign up failed");
        return { success: false, message: data.message };
      }
    } catch {
      toast.error("An unexpected error occurred. Please try again.");
      return { success: false, message: "Network error" };
    }
  };
  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      clearPrivateCaches();
      setUser(null);
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        const channel = new BroadcastChannel("freshcart_auth");
        channel.postMessage({ type: "LOGOUT" });
        channel.close();
      }
      toast.success("Signed out successfully");
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
      clearPrivateCaches();
      setUser(null);
      toast.error("Signed out locally");
      router.push("/login");
    }
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        checkAuth,
        updateUser: (updatedUser) => {
          cacheUserDisplay(updatedUser);
          setUser(updatedUser);
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
