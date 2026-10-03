export const AUTH_COOKIE_NAME =
  process.env.AUTH_COOKIE_NAME || "freshcart_token";
export const AUTH_COOKIE_MAX_AGE =
  Number(process.env.AUTH_COOKIE_MAX_AGE) || 60 * 60 * 24 * 30;
export function sanitizeReturnUrl(returnUrl?: string | null): string {
  if (!returnUrl || typeof returnUrl !== "string") {
    return "/";
  }
  const trimmed = returnUrl.trim();
  if (
    !trimmed.startsWith("/") ||
    trimmed.startsWith("//") ||
    trimmed.startsWith("/\\")
  ) {
    return "/";
  }
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) {
    return "/";
  }
  if (trimmed.includes("\\")) {
    return "/";
  }
  return trimmed;
}
