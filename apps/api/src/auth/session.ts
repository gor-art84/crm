import { Role } from "../generated/prisma/enums.js";

export interface RedisSessionData {
  userId: string;
  userEmail: string;
  userRole: Role;
  issuedAt: string;
}

export function sessionKey(sessionId: string): string {
  return `sessionId:${sessionId}`;
}
