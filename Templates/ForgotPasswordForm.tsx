"use client";
import {
  IconArrowLeft,
  IconCheck,
  IconEye,
  IconEyeOff,
  IconKey,
  IconLockFilled,
  IconMail,
} from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import {
  forgotPasswordSchema,
  verifyResetCodeSchema,
  resetPasswordSchema,
} from "@/schemas/auth.schema";
type RecoveryStep = "request" | "verify" | "reset";
export default function ForgotPasswordForm() {
  const router = useRouter();
  const { checkAuth } = useAuth();
  const [step, setStep] = useState<RecoveryStep>("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);
  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setFieldErrors({});
    setInfoMessage(null);
    const validation = forgotPasswordSchema.safeParse({ email });
    if (!validation.success) {
      const errors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        if (issue.path[0]) errors[issue.path[0] as string] = issue.message;
      });
      setFieldErrors(errors);
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/forgot-passwords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        setApiError(
          data.message || "Failed to send reset code. Please check your email.",
        );
      } else {
        toast.success(data.message || "Reset code sent to your email!");
        setInfoMessage(data.message || "Reset code sent to your email");
        setStep("verify");
        setCountdown(60);
      }
    } catch {
      setApiError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };
  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setFieldErrors({});
    setInfoMessage(null);
    const validation = verifyResetCodeSchema.safeParse({ resetCode: code });
    if (!validation.success) {
      const errors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        if (issue.path[0]) errors[issue.path[0] as string] = issue.message;
      });
      setFieldErrors(errors);
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/verify-reset-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetCode: code }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        setApiError(data.message || "Reset code is invalid or has expired.");
      } else {
        toast.success("Code verified successfully!");
        setStep("reset");
      }
    } catch {
      setApiError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };
  const handleResendCode = async () => {
    if (countdown > 0 || isLoading) return;
    setApiError(null);
    setInfoMessage(null);
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/forgot-passwords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        setApiError(
          data.message || "Failed to resend reset code. Please try again.",
        );
      } else {
        toast.success("A fresh reset code was sent to your email!");
        setInfoMessage("A fresh reset code was sent to your email.");
        setCountdown(60);
      }
    } catch {
      setApiError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setFieldErrors({});
    const validation = resetPasswordSchema.safeParse({
      email,
      newPassword,
      confirmPassword,
    });
    if (!validation.success) {
      const errors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        if (issue.path[0]) errors[issue.path[0] as string] = issue.message;
      });
      setFieldErrors(errors);
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        setApiError(
          data.message || "Failed to reset password. Please try again.",
        );
      } else {
        await checkAuth();
        toast.success("Password reset successfully! Welcome back.");
        router.push("/");
        router.refresh();
      }
    } catch {
      setApiError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="recovery-card">
      <div className="recovery-brand">
        Fresh<span>Cart</span>
      </div>
      <h1>
        {step === "request"
          ? "Forgot Password?"
          : step === "verify"
            ? "Check Your Email"
            : "Create New Password"}
      </h1>
      <p className="recovery-subtitle">
        {step === "request"
          ? "No worries, we'll send you a reset code"
          : step === "verify"
            ? `Enter the 6-digit code sent to ${email}`
            : "Your new password must be different from previous passwords"}
      </p>
      <div
        className="recovery-progress"
        aria-label={`Password recovery step ${step === "request" ? 1 : step === "verify" ? 2 : 3} of 3`}
      >
        {["request", "verify", "reset"]
          .map((item, index) => {
            const position = step === "request" ? 0 : step === "verify" ? 1 : 2;
            const Icon =
              index === 0 ? IconMail : index === 1 ? IconKey : IconLockFilled;
            return (
              <span
                key={item}
                className={
                  position === index
                    ? "current"
                    : position > index
                      ? "done"
                      : ""
                }
              >
                {position > index ? (
                  <IconCheck size={20} />
                ) : (
                  <Icon size={18} />
                )}
              </span>
            );
          })
          .reduce<React.ReactNode[]>((result, item, index) => {
            if (index)
              result.push(
                <i
                  key={`line-${index}`}
                  className={
                    step === "reset" || (step === "verify" && index === 1)
                      ? "done"
                      : ""
                  }
                />,
              );
            result.push(item);
            return result;
          }, [])}
      </div>
      {apiError && (
        <div id="recovery-error-banner" role="alert" className="store-error">
          {apiError}
        </div>
      )}
      {infoMessage && (
        <div
          id="recovery-info-banner"
          role="status"
          className="store-muted mb-5"
        >
          {infoMessage}
        </div>
      )}
      {step === "request" && (
        <form onSubmit={handleRequestSubmit} noValidate>
          <div className="store-field">
            <label htmlFor="reset-email">Email Address</label>
            <input
              id="reset-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="Enter your email address"
              disabled={isLoading}
              aria-invalid={!!fieldErrors.email}
            />
            {fieldErrors.email && <small>{fieldErrors.email}</small>}
          </div>
          <button
            id="send-reset-code-btn"
            className="store-button wide"
            disabled={isLoading}
          >
            {isLoading ? "Sending Code..." : "Send Reset Code"}
          </button>
          <Link href="/login" className="recovery-back text-primary-600">
            <IconArrowLeft size={16} className="mr-2" />
            Back to Sign In
          </Link>
          <p className="recovery-remember">
            Remember your password?{" "}
            <Link href="/login" className="text-primary-600">
              Sign In
            </Link>
          </p>
        </form>
      )}
      {step === "verify" && (
        <form onSubmit={handleVerifySubmit} noValidate>
          <div className="store-field">
            <label htmlFor="verify-code">Verification Code</label>
            <input
              id="verify-code"
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ""))}
              autoComplete="one-time-code"
              placeholder="• • • • • •"
              className="text-center tracking-[.5em]"
              disabled={isLoading}
              aria-invalid={!!fieldErrors.resetCode}
            />
            {fieldErrors.resetCode && <small>{fieldErrors.resetCode}</small>}
          </div>
          <p className="text-center store-muted mb-6">
            Didn't receive the code?{" "}
            <button
              id="resend-code-btn"
              type="button"
              className="text-primary-600"
              onClick={handleResendCode}
              disabled={countdown > 0 || isLoading}
            >
              {countdown > 0 ? `Resend in ${countdown}s` : "Resend Code"}
            </button>
          </p>
          <button
            id="verify-code-btn"
            className="store-button wide"
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Verify Code"}
          </button>
          <button
            type="button"
            className="recovery-back w-full"
            onClick={() => {
              setStep("request");
              setApiError(null);
              setInfoMessage(null);
              setCode("");
            }}
          >
            <IconArrowLeft size={16} className="mr-2" />
            Change email address
          </button>
        </form>
      )}
      {step === "reset" && (
        <form onSubmit={handleResetSubmit} noValidate>
          {[
            {
              id: "newPassword",
              label: "New Password",
              value: newPassword,
              set: setNewPassword,
              show: showPassword,
              toggle: () => setShowPassword(!showPassword),
              placeholder: "Enter new password",
            },
            {
              id: "confirmPassword",
              label: "Confirm Password",
              value: confirmPassword,
              set: setConfirmPassword,
              show: showConfirmPassword,
              toggle: () => setShowConfirmPassword(!showConfirmPassword),
              placeholder: "Confirm new password",
            },
          ].map((field) => (
            <div className="store-field" key={field.id}>
              <label htmlFor={field.id}>{field.label}</label>
              <div className="password-input">
                <input
                  id={field.id}
                  type={field.show ? "text" : "password"}
                  value={field.value}
                  onChange={(e) => field.set(e.target.value)}
                  autoComplete="new-password"
                  placeholder={field.placeholder}
                  disabled={isLoading}
                  aria-invalid={!!fieldErrors[field.id]}
                />
                <button
                  type="button"
                  onClick={field.toggle}
                  aria-label={field.show ? "Hide password" : "Show password"}
                >
                  {field.show ? (
                    <IconEyeOff size={18} />
                  ) : (
                    <IconEye size={18} />
                  )}
                </button>
              </div>
              {fieldErrors[field.id] && <small>{fieldErrors[field.id]}</small>}
            </div>
          ))}
          <button
            id="update-password-btn"
            className="store-button wide"
            disabled={isLoading}
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      )}
    </div>
  );
}
