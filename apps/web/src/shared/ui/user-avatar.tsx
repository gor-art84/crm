import { Avatar } from "@mui/material";
import { getInitials } from "@/shared/lib/person-name";

const AVATAR_TONES = [
  { light: { bg: "#E3EFF1", fg: "#184E5B" }, dark: { bg: "#12303A", fg: "#A6D8E3" } },
  { light: { bg: "#F4E8DC", fg: "#8A4B1C" }, dark: { bg: "#3A2B20", fg: "#E4B48D" } },
  { light: { bg: "#E2F0E7", fg: "#2C6A3E" }, dark: { bg: "#1F3428", fg: "#9FD2AE" } },
  { light: { bg: "#F0E6F3", fg: "#74407F" }, dark: { bg: "#33263A", fg: "#D6A9E0" } },
  { light: { bg: "#E6ECF9", fg: "#24439F" }, dark: { bg: "#1F2946", fg: "#B3C4F7" } },
  { light: { bg: "#F8E3EA", fg: "#9A2D5E" }, dark: { bg: "#3A1F2D", fg: "#F0A3C5" } },
] as const;

const getToneIndex = (key: string, count: number): number => {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % count;
};

type UserAvatarProps = {
  user: { id: string; firstName: string; lastName: string; avatarUrl?: string | null };
  size?: number;
};

export const UserAvatar = ({ user, size = 32 }: UserAvatarProps) => {
  const tone = AVATAR_TONES[getToneIndex(user.id, AVATAR_TONES.length)];
  return (
    <Avatar
      src={user.avatarUrl ?? undefined}
      sx={(theme) => ({
        width: size,
        height: size,
        fontSize: size * 0.4,
        fontWeight: 600,
        bgcolor: tone.light.bg,
        color: tone.light.fg,
        ...theme.applyStyles("dark", {
          bgcolor: tone.dark.bg,
          color: tone.dark.fg,
        }),
      })}
    >
      {getInitials(user.firstName, user.lastName)}
    </Avatar>
  );
};
