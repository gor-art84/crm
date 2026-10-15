import { Box, Chip } from "@mui/material";

type UserStatusChipProps = {
  isActive: boolean;
};

export const UserStatusChip = ({ isActive }: UserStatusChipProps) => {
  return (
    <Chip
      label={isActive ? "Активен" : "Отключён"}
      variant="outlined"
      size="small"
      icon={
        <Box
          component="span"
          sx={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            backgroundColor: isActive ? "success.main" : "text.disabled",
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
