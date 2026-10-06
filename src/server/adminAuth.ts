import "server-only";

import { createHash, createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE = "admin_session";
export const ADMIN_COOKIE_PATH = "/admin";
export const ADMIN_SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

// Bump to invalidate all sessions even before ADMIN_KEY rotates.
const TOKEN_VERSION = 1;

/** Undefined when the operator has not configured the admin area. */
export function adminKey(): string | undefined {
  const value = process.env.ADMIN_KEY;
  return value && value.length > 0 ? value : undefined;
}

export function isAdminConfigured(): boolean {
  return adminKey() !== undefined;
}

/**
 * The session HMAC key is derived from ADMIN_KEY rather than used directly,
 * so rotating ADMIN_KEY invalidates every session that was already issued.
 */
function sessionHmacKey(): Buffer {
  return createHmac("sha256", adminKey()!).update("admin-session-v1").digest();
}

function signPayload(payload: string): string {
  return createHmac("sha256", sessionHmacKey()).update(payload).digest("base64url");
}

export function createAdminSessionToken(now = Date.now()): string {
  const payload = Buffer.from(
    JSON.stringify({ v: TOKEN_VERSION, iat: now, exp: now + ADMIN_SESSION_TTL_MS }),
  ).toString("base64url");
  return `${payload}.${signPayload(payload)}`;
}

export function verifyAdminSessionToken(token: string | undefined, now = Date.now()): boolean {
  if (!token) return false;
  const separator = token.indexOf(".");
  if (separator <= 0) return false;
  const payload = token.slice(0, separator);
  const signature = token.slice(separator + 1);

  // Every valid signature has the same length, so the length check leaks
  // nothing; the compare itself must not branch on content.
  const given = Buffer.from(signature);
  const expected = Buffer.from(signPayload(payload));
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return false;

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString()) as {
      v?: number;
      exp?: number;
    };
    return data.v === TOKEN_VERSION && typeof data.exp === "number" && data.exp > now;
  } catch {
    return false;
  }
}

export async function hasAdminSession(): Promise<boolean> {
  const store = await cookies();
  return verifyAdminSessionToken(store.get(ADMIN_SESSION_COOKIE)?.value);
}

/**
 * Compare digests, not the secrets: SHA-256 output is always 32 bytes, so
 * timingSafeEqual never throws and the comparison time is independent of the
 * submitted length.
 */
export function isAdminKeyCorrect(submitted: string): boolean {
  const expected = adminKey();
  if (!expected) return false;
  const submittedDigest = createHash("sha256").update(submitted).digest();
  const expectedDigest = createHash("sha256").update(expected).digest();
  return timingSafeEqual(submittedDigest, expectedDigest);
}

export const adminCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  // Scoped to the admin area: the browser never sends this cookie to the
  // public site.
  path: ADMIN_COOKIE_PATH,
  maxAge: ADMIN_SESSION_TTL_MS / 1000,
};

/**
 * One-way client identifier for login rate limiting. ANALYTICS_IP_HASH_SALT is
 * reused when present; ADMIN_KEY is the fallback so limiting still works on an
 * install that never set the analytics salt (the admin area cannot run without
 * ADMIN_KEY).
 */
export function hashClientIp(requestHeaders: Headers): string {
  // Trust the entry appended by the nearest proxy (the rightmost one), not the
  // leftmost: proxies that append ($proxy_add_x_forwarded_for, the NGINX
  // default used by this deployment's gateway) pass a client-supplied leftmost
  // value through untouched, so keying on it would let a caller rotate the
  // per-IP lockout bucket on every request. Behind multiple hops all clients
  // then share the last hop's bucket, which fails closed.
  const forwarded = requestHeaders.get("x-forwarded-for");
  const address =
    forwarded?.split(",").at(-1)?.trim() || requestHeaders.get("x-real-ip") || "unknown";
  const secret = process.env.ANALYTICS_IP_HASH_SALT ?? adminKey() ?? "";
  return createHmac("sha256", secret).update(`admin-login:${address}`).digest("hex");
}
