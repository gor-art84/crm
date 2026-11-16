import { createHash } from "node:crypto";

export interface RedisSessionData {
  userId: string;
  issuedAt: string;
  userAgent?: string;
}

export function sessionKey(sessionId: string): string {
  return `sessionId:${sessionId}`;
}

export function userSessionsKey(userId: string): string {
  return `userSessions:${userId}`;
}

export function sessionCookieOptions(secure: boolean): {
  httpOnly: true;
  path: "/";
  sameSite: "lax";
  secure: boolean;
} {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure,
  };
}

export function publicSessionId(sessionId: string): string {
  return createHash("sha256").update(sessionId).digest("hex");
}

export function isSessionExpired(issuedAt: string, absoluteTimeoutSeconds: number): boolean {
  const issuedAtMs = Date.parse(issuedAt);
  return !Number.isFinite(issuedAtMs) || (Date.now() - issuedAtMs) / 1000 > absoluteTimeoutSeconds;
}
