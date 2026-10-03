import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "@/types/auth.types";
import { AUTH_COOKIE_NAME } from "@/lib/auth-utils";
export const dynamic = "force-dynamic";
const NO_CACHE_HEADERS = {
  "Cache-Control": "private, no-store, no-cache, must-revalidate",
};
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json(
      { isAuthenticated: false, user: null },
      { status: 200, headers: NO_CACHE_HEADERS },
    );
  }
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    if (decoded.exp * 1000 < Date.now()) {
      cookieStore.delete({ name: AUTH_COOKIE_NAME, path: "/" });
      cookieStore.set(AUTH_COOKIE_NAME, "", { maxAge: 0, path: "/" });
      return NextResponse.json(
        { isAuthenticated: false, user: null, message: "Session expired" },
        { status: 200, headers: NO_CACHE_HEADERS },
      );
    }
    return NextResponse.json(
      {
        isAuthenticated: true,
        user: {
          id: decoded.id,
          name: decoded.name,
          role: decoded.role,
        },
      },
      { headers: NO_CACHE_HEADERS },
    );
  } catch {
    cookieStore.delete({ name: AUTH_COOKIE_NAME, path: "/" });
    cookieStore.set(AUTH_COOKIE_NAME, "", { maxAge: 0, path: "/" });
    return NextResponse.json(
      { isAuthenticated: false, user: null },
      { status: 200, headers: NO_CACHE_HEADERS },
    );
  }
}
