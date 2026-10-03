"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconLoader2, IconUserPlus } from "@tabler/icons-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { SignupFormValues, signupSchema } from "@/schemas/auth.schema";
import { useAuth } from "@/context/AuthContext";
import { sanitizeReturnUrl } from "@/lib/auth-utils";
export default function SignupForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const returnUrl = sanitizeReturnUrl(searchParams.get("returnUrl"));
  const { signup } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      phone: "",
    },
  });
  const passwordValue = watch("password") || "";
  const getPasswordStrength = (pass: string) => {
    if (!pass)
      return { score: 0, label: "None", color: "bg-gray-200", width: "w-0" };
    if (pass.length < 6)
      return { score: 1, label: "Weak", color: "bg-red-500", width: "w-1/4" };
    if (pass.length < 8)
      return {
        score: 2,
        label: "Fair",
        color: "bg-orange-500",
        width: "w-2/4",
      };
    if (/[0-9]/.test(pass) && /[a-zA-Z]/.test(pass)) {
      return {
        score: 3,
        label: "Strong",
        color: "bg-primary-500",
        width: "w-full",
      };
    }
    return { score: 2, label: "Fair", color: "bg-orange-500", width: "w-2/4" };
  };
  const strength = getPasswordStrength(passwordValue);
  const onSubmit = async (values: SignupFormValues) => {
    setServerError(null);
    const result = await signup(values, returnUrl);
    if (!result.success && result.message) {
      setServerError(result.message);
    }
  };
  return (
    <div className="bg-white rounded-2xl shadow-xl px-6 py-10 lg:p-12">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Create Your Account
        </h2>
        <p className="text-gray-600 text-sm">
          Start your fresh journey with us today
        </p>
      </div>

      {serverError && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-semibold text-gray-700">
            Full Name*
          </label>
          <input
            type="text"
            id="name"
            {...register("name")}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all text-gray-800 ${
              errors.name
                ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                : "border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            }`}
            placeholder="John Doe"
          />
          {errors.name && (
            <p className="text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="email"
            className="text-sm font-semibold text-gray-700"
          >
            Email Address*
          </label>
          <input
            type="email"
            id="email"
            {...register("email")}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all text-gray-800 ${
              errors.email
                ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                : "border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            }`}
            placeholder="john@example.com"
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="password"
            className="text-sm font-semibold text-gray-700"
          >
            Password*
          </label>
          <input
            type="password"
            id="password"
            {...register("password")}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all text-gray-800 ${
              errors.password
                ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                : "border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            }`}
            placeholder="Create a strong password"
            autoComplete="new-password"
          />
          {passwordValue && (
            <div className="mt-1 flex items-center gap-2">
              <div className="grow h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${strength.color} ${strength.width}`}
                ></div>
              </div>
              <span className="text-xs font-medium text-gray-500">
                {strength.label}
              </span>
            </div>
          )}
          {errors.password && (
            <p className="text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="rePassword"
            className="text-sm font-semibold text-gray-700"
          >
            Confirm Password*
          </label>
          <input
            type="password"
            id="rePassword"
            {...register("rePassword")}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all text-gray-800 ${
              errors.rePassword
                ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                : "border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            }`}
            placeholder="Confirm your password"
            autoComplete="new-password"
          />
          {errors.rePassword && (
            <p className="text-xs text-red-500">{errors.rePassword.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="phone"
            className="text-sm font-semibold text-gray-700"
          >
            Phone Number*
          </label>
          <input
            type="tel"
            id="phone"
            {...register("phone")}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all text-gray-800 ${
              errors.phone
                ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                : "border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            }`}
            placeholder="01012345678"
          />
          {errors.phone && (
            <p className="text-xs text-red-500">{errors.phone.message}</p>
          )}
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary-600 text-white py-3.5 px-4 rounded-xl hover:bg-primary-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <IconLoader2 className="animate-spin h-5 w-5" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <IconUserPlus stroke={2} className="h-5 w-5" />
                <span>Create My Account</span>
              </>
            )}
          </button>
        </div>
      </form>

      <p className="border-t pt-6 border-gray-100 mt-8 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-primary-600 hover:text-primary-700 font-semibold ms-1"
        >
          Sign In
        </Link>
      </p>
    </div>
  );
}
