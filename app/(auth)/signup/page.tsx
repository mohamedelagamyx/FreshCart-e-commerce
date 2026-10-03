import SignupForm from "@/Templates/SignupForm";
import SignupHero from "@/Templates/SignupHero";
import { Suspense } from "react";
export const metadata = {
  title: "Create Account - FreshCart",
  description:
    "Join FreshCart to start your fresh grocery shopping journey with fast delivery.",
};
export default function SignupPage() {
  return (
    <div className="container mx-auto px-4 py-8 lg:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
        <SignupHero />
        <Suspense
          fallback={<div className="text-center py-12">Loading form...</div>}
        >
          <SignupForm />
        </Suspense>
      </div>
    </div>
  );
}
