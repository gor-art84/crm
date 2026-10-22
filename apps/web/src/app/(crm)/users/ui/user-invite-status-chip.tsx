import { Box, Chip } from "@mui/material";
import type { InviteStatus } from "@/generated/graphql";

type UserInviteStatusChipProps = {
  status: InviteStatus;
};

export const UserInviteStatusChip = ({ status }: UserInviteStatusChipProps) => {
  if (status === "ACCEPTED") return null;

  const label = status === "PENDING" ? "Приглашён" : "Истекло";
  const dotColor = status === "PENDING" ? "warning.main" : "error.main";

  return (
    <Chip
      label={label}
      variant="outlined"
      size="small"
      icon={
        <Box
          component="span"
          sx={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            backgroundColor: dotColor,
          }}
        />
      }
      sx={{
        borderColor: "divider",
        color: "text.secondary",
        fontWeight: 500,
        "& .MuiChip-icon": { marginLeft: "8px", marginRight: "-2px" },
      }}
    />
  );
};
