import { Chip } from "@mui/material";
import type { Role } from "@/generated/graphql";
import { ROLE_LABELS } from "@/shared/model/roles";

type RoleChipProps = {
  role: Role;
};

export const RoleChip = ({ role }: RoleChipProps) => (
  <Chip
    size="small"
    variant="outlined"
    label={ROLE_LABELS[role]}
    sx={{
      borderRadius: "999px",
      borderColor: "divider",
      fontWeight: 500,
      width: "fit-content",
      color: "text.secondary",
    }}
  />
);
