"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  IconBrandFacebook,
  IconBrandGoogleFilled,
  IconEye,
  IconEyeOff,
  IconLoader2,
  IconLockFilled,
  IconMail,
  IconStarFilled,
  IconUsers,
} from "@tabler/icons-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { LoginFormValues, loginSchema } from "@/schemas/auth.schema";
import { useAuth } from "@/context/AuthContext";
import { sanitizeReturnUrl } from "@/lib/auth-utils";
export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const returnUrl = sanitizeReturnUrl(searchParams.get("returnUrl"));
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    const result = await login(values, returnUrl);
    if (!result.success && result.message) {
      setServerError(result.message);
    }
  };
  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <span className="text-3xl font-bold text-primary-600">
              Fresh<span className="text-gray-800">Cart</span>
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome Back!
          </h1>
          <p className="text-gray-600 text-sm">
            Sign in to continue your fresh shopping experience
          </p>
        </div>

        <div className="space-y-3 mb-6">
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 py-3 px-4 border-2 border-gray-200 rounded-xl hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 cursor-pointer"
          >
            <IconBrandGoogleFilled className="text-red-500 text-lg" />
            <span className="font-medium text-gray-700 text-sm">
              Continue with Google
            </span>
          </button>
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 py-3 px-4 border-2 border-gray-200 rounded-xl hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 cursor-pointer"
          >
            <IconBrandFacebook stroke={2} className="text-blue-600 text-lg" />
            <span className="font-medium text-gray-700 text-sm">
              Continue with Facebook
            </span>
          </button>
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-4 bg-white text-gray-400 font-semibold tracking-wider">
              OR CONTINUE WITH EMAIL
            </span>
          </div>
        </div>

        {serverError && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                {...register("email")}
                className={`w-full px-4 py-3 pl-12 border-2 rounded-xl focus:outline-none transition-all text-gray-800 ${
                  errors.email
                    ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                    : "border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                }`}
                placeholder="Enter your email"
              />
              <IconMail
                stroke={2}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700"
              >
                Password
              </label>
              <Link
                href="/forget-password"
                className="text-sm text-primary-600 hover:text-primary-700 cursor-pointer font-medium"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                {...register("password")}
                className={`w-full px-4 py-3 pl-12 pr-12 border-2 rounded-xl focus:outline-none transition-all text-gray-800 ${
                  errors.password
                    ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                    : "border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                }`}
                placeholder="Enter your password"
              />
              <IconLockFilled className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showPassword ? (
                  <IconEyeOff stroke={2} />
                ) : (
                  <IconEye stroke={2} />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 text-primary-600 accent-primary-600 border-2 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="ml-3 text-sm text-gray-700">
                Keep me signed in
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary-600 text-white py-3 px-4 rounded-xl hover:bg-primary-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <IconLoader2 className="animate-spin h-5 w-5" />
                <span>Signing In...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        <div className="text-center mt-8 pt-6 border-t border-gray-100">
          <p className="text-gray-600 text-sm">
            New to FreshCart?
            <Link
              href="/signup"
              className="text-primary-600 hover:text-primary-700 ms-2 font-semibold cursor-pointer"
            >
              Create an account
            </Link>
          </p>
        </div>

        <div className="flex items-center justify-center space-x-6 mt-6 text-xs text-gray-400">
          <div className="flex items-center">
            <IconLockFilled className="mr-1 text-gray-400 h-3.5 w-3.5" />
            SSL Secured
          </div>
          <div className="flex items-center">
            <IconUsers stroke={2} className="mr-1 text-gray-400 h-3.5 w-3.5" />
            50K+ Users
          </div>
          <div className="flex items-center">
            <IconStarFilled className="mr-1 text-yellow-400 h-3.5 w-3.5" />
            4.9 Rating
          </div>
        </div>
      </div>
    </div>
  );
}
