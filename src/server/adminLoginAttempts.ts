import "server-only";

import { randomUUID } from "crypto";
import { and, count, eq, gte, lt, sql } from "drizzle-orm";
import { adminLoginAttempts } from "src/db/schema";
import { getDb } from "src/server/sql";

/** Sliding window used to count recent failures. */
export const LOCK_WINDOW_MS = 15 * 60 * 1000;
/** Failed attempts from one client IP within the window before it is locked. */
export const IP_FAILURE_LIMIT = 5;
/**
 * Failed attempts from all clients within the window before every login is
 * locked. Deliberately high: a global lock is also a denial-of-service lever
 * against the operator, so it only guards against distributed guessing.
 */
export const GLOBAL_FAILURE_LIMIT = 50;
export const LOCK_DURATION_MS = 15 * 60 * 1000;
/** Fixed cost added to every failed attempt, slowing single-source guessing. */
export const FAILED_ATTEMPT_DELAY_MS = 750;
const RETENTION_MS = 30 * 24 * 60 * 60 * 1000;
const CLEANUP_INTERVAL_MS = 60 * 60 * 1000;

export interface LockState {
  locked: boolean;
  /** Relative seconds, so a client clock that is off cannot break the countdown. */
  retryAfterSeconds: number;
}

/**
 * MAX() bypasses the column mapper, so the raw value is epoch millis even
 * though the column is a timestamp_ms column; type it explicitly rather than
 * trusting the inferred Date.
 */
function failureStats(ipHash: string | undefined, now: number) {
  const rows = getDb()
    .select({
      failures: count(),
      lastFailureAt: sql<number | null>`MAX(${adminLoginAttempts.occurredAt})`,
    })
    .from(adminLoginAttempts)
    .where(
      and(
        eq(adminLoginAttempts.success, false),
        gte(adminLoginAttempts.occurredAt, new Date(now - LOCK_WINDOW_MS)),
        ...(ipHash ? [eq(adminLoginAttempts.ipHash, ipHash)] : []),
      ),
    )
    .all();
  return { failures: rows[0]?.failures ?? 0, lastFailureAt: rows[0]?.lastFailureAt ?? null };
}

export function lockStateFor(ipHash: string, now = Date.now()): LockState {
  const perIp = failureStats(ipHash, now);
  const global = failureStats(undefined, now);

  const ipTripped = perIp.failures >= IP_FAILURE_LIMIT;
  const globalTripped = global.failures >= GLOBAL_FAILURE_LIMIT;
  if (!ipTripped && !globalTripped) return { locked: false, retryAfterSeconds: 0 };

  // Only the counters that actually tripped contribute: a global lock must not
  // be shortened by an unrelated, older per-IP failure.
  const lastFailureAt = Math.max(
    ipTripped ? (perIp.lastFailureAt ?? 0) : 0,
    globalTripped ? (global.lastFailureAt ?? 0) : 0,
  );
  const retryAfterSeconds = Math.max(1, Math.ceil((lastFailureAt + LOCK_DURATION_MS - now) / 1000));
  return { locked: true, retryAfterSeconds };
}

export function recordLoginAttempt(ipHash: string, success: boolean): void {
  const db = getDb();
  db.transaction((tx) => {
    tx.insert(adminLoginAttempts).values({ id: randomUUID(), ipHash, success }).run();
    if (success) {
      // A verified key clears this IP's failures, so the operator logging in
      // does not inherit an attacker's count.
      tx.delete(adminLoginAttempts)
        .where(and(eq(adminLoginAttempts.ipHash, ipHash), eq(adminLoginAttempts.success, false)))
        .run();
    }
  });
  pruneOldAttempts();
}

let lastPrunedAt = 0;

// The ledger only grows; drop old rows at most once per process-hour instead
// of paying a delete on every attempt.
function pruneOldAttempts(now = Date.now()): void {
  if (now - lastPrunedAt < CLEANUP_INTERVAL_MS) return;
  lastPrunedAt = now;
  getDb()
    .delete(adminLoginAttempts)
    .where(lt(adminLoginAttempts.occurredAt, new Date(now - RETENTION_MS)))
    .run();
}
