import type { InviteStatus } from "@/generated/graphql";
import type { StatusTone } from "@/shared/ui/status-chip";

export const getUserStatus = (user: {
  isActive: boolean;
  inviteStatus: InviteStatus;
}): { label: string; tone: StatusTone } => {
  if (!user.isActive) {
    return { label: "Отключён", tone: "neutral" };
  }

  switch (user.inviteStatus) {
    case "ACCEPTED":
      return { label: "Активен", tone: "success" };
    case "EXPIRED":
      return { label: "Приглашение истекло", tone: "error" };
    case "PENDING":
      return { label: "Ждёт приглашения", tone: "warning" };
    default: {
      const _exhaustiveCheck: never = user.inviteStatus;
      throw new Error(`Неизвестный статус: ${_exhaustiveCheck}`);
    }
  }
};
