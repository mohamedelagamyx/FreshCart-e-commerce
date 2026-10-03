import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth-utils";
export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete({ name: AUTH_COOKIE_NAME, path: "/" });
  cookieStore.set(AUTH_COOKIE_NAME, "", { maxAge: 0, path: "/" });
  return NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });
}
