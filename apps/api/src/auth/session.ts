export interface RedisSessionData {
  userId: string;
  issuedAt: string;
}

export function sessionKey(sessionId: string): string {
  return `sessionId:${sessionId}`;
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
