"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_SESSION_COOKIE,
  adminCookieOptions,
  createAdminSessionToken,
  hashClientIp,
  isAdminConfigured,
  isAdminKeyCorrect,
} from "src/server/adminAuth";
import {
  FAILED_ATTEMPT_DELAY_MS,
  lockStateFor,
  recordLoginAttempt,
} from "src/server/adminLoginAttempts";

// Failures navigate back to /admin with the outcome in the URL instead of
// returning action state. A state-returning action that does not mutate a
// cookie leaves Next.js in its action render phase, where reading `cookies()`
// trips a dev-only framework invariant ("Received an underlying cookies
// object that does not match either `cookies` or `mutableCookies`"); the
// redirect keeps every render on the normal request path, which is also what
// lets the form work without JavaScript.
export async function loginAction(formData: FormData): Promise<void> {
  if (!isAdminConfigured()) redirect("/admin?error=unconfigured");

  const ipHash = hashClientIp(await headers());

  // A locked request is refused before recording, so hammering the form cannot
  // keep extending the lock.
  const beforeLock = lockStateFor(ipHash);
  if (beforeLock.locked) redirect(`/admin?error=locked&retry=${beforeLock.retryAfterSeconds}`);

  // Bounded so a huge body cannot turn the digest into a CPU amplifier.
  const submitted = String(formData.get("key") ?? "").slice(0, 1024);
  const correct = submitted.length > 0 && isAdminKeyCorrect(submitted);

  recordLoginAttempt(ipHash, correct);

  if (!correct) {
    // Fixed cost per guess before the lockout even engages.
    await new Promise((resolve) => setTimeout(resolve, FAILED_ATTEMPT_DELAY_MS));
    const afterLock = lockStateFor(ipHash);
    if (afterLock.locked) redirect(`/admin?error=locked&retry=${afterLock.retryAfterSeconds}`);
    redirect("/admin?error=invalid");
  }

  // Setting a cookie in an action re-renders the current route in the same
  // roundtrip; the redirect then lands on the authenticated dashboard.
  (await cookies()).set(ADMIN_SESSION_COOKIE, createAdminSessionToken(), adminCookieOptions);
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  // Expire with the same path the cookie was set with; a bare delete() would
  // not match the /admin path scope.
  (await cookies()).set(ADMIN_SESSION_COOKIE, "", { ...adminCookieOptions, maxAge: 0 });
}
