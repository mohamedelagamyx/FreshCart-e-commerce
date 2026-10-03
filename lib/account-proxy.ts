import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import { AUTH_COOKIE_NAME, AUTH_COOKIE_MAX_AGE } from "./auth-utils";
import { profileSchema, changePasswordSchema } from "@/schemas/account.schema";
import type { DecodedToken } from "@/types/auth.types";
const headers = { "Cache-Control": "private, no-store" };
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://ecommerce.routemisr.com";
export async function updateAccount(
  request: Request,
  kind: "profile" | "password",
) {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token)
    return NextResponse.json(
      { success: false, message: "Please sign in to manage your account" },
      { status: 401, headers },
    );
  const body = await request.json().catch(() => null);
  const validation = (
    kind === "profile" ? profileSchema : changePasswordSchema
  ).safeParse(body);
  if (!validation.success)
    return NextResponse.json(
      {
        success: false,
        message:
          validation.error.issues[0]?.message || "Invalid account information",
        errors: validation.error.flatten().fieldErrors,
      },
      { status: 400, headers },
    );
  try {
    const response = await fetch(
      `${API_BASE}/api/v1/users/${kind === "profile" ? "updateMe/" : "changeMyPassword"}`,
      {
        method: "PUT",
        headers: { token, "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
        cache: "no-store",
      },
    );
    const data = await response.json();
    if (!response.ok)
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Unable to update your account",
        },
        { status: response.status, headers },
      );
    if (typeof data.token === "string")
      cookieStore.set(AUTH_COOKIE_NAME, data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: AUTH_COOKIE_MAX_AGE,
        path: "/",
      });
    const decoded = jwtDecode<DecodedToken>(
      typeof data.token === "string" ? data.token : token,
    );
    const profile =
      kind === "profile"
        ? (validation.data as {
            name: string;
            email: string;
            phone: string;
          })
        : null;
    return NextResponse.json(
      {
        success: true,
        message:
          kind === "profile"
            ? "Profile updated successfully"
            : "Password changed successfully",
        user: profile
          ? { id: decoded.id, role: decoded.role, ...profile }
          : undefined,
      },
      { headers },
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Unable to connect. Please try again." },
      { status: 502, headers },
    );
  }
}
