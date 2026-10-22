import { InviteStatus } from "./invite-status.enum.js";

export const computeInviteStatus = (input: {
  passwordHash: string | null;
  latestOpenInvite: { expiresAt: Date } | null;
}): InviteStatus => {
  if (input.passwordHash !== null) {
    return InviteStatus.ACCEPTED;
  }
  if (input.latestOpenInvite && input.latestOpenInvite.expiresAt > new Date()) {
    return InviteStatus.PENDING;
  }
  return InviteStatus.EXPIRED;
};
