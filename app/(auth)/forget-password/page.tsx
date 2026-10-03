import ForgotPasswordForm from "@/Templates/ForgotPasswordForm";
import RecoveryHero from "@/Templates/RecoveryHero";
import { Suspense } from "react";
export const metadata = {
  title: "Reset Password - FreshCart",
  description: "Reset your FreshCart password by email verification code.",
};
export default function ForgotPasswordPage() {
  return (
    <div className="recovery-page">
      <div className="recovery-layout">
        <RecoveryHero />
        <Suspense
          fallback={<div className="text-center py-12">Loading form...</div>}
        >
          <ForgotPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
