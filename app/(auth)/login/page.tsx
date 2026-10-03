import LoginForm from "@/Templates/LoginForm";
import LoginHero from "@/Templates/LoginHero";
import { Suspense } from "react";
export const metadata = {
  title: "Sign In - FreshCart",
  description:
    "Sign in to your FreshCart account to manage your shopping cart and orders.",
};
export default function LoginPage() {
  return (
    <div className="container mx-auto px-4 py-8 lg:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
        <LoginHero />
        <Suspense
          fallback={<div className="text-center py-12">Loading form...</div>}
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
