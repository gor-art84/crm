"use client";

import { useQuery } from "@apollo/client/react";
import {
  Box,
  Button,
  ButtonBase,
  IconButton,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { LogIn } from "lucide-react";
import Link from "next/link";
import { ME } from "@/shared/api/graphql/me";
import { ROLE_LABELS } from "@/shared/model/roles";
import { UserAvatar } from "@/shared/ui/user-avatar";
import { LogoutButton } from "@/widgets/app-shell/logout-button";

type SidebarUserProps = {
  collapsed: boolean;
};

export const SidebarUser = ({ collapsed }: SidebarUserProps) => {
  const { data, loading } = useQuery(ME);

  if (loading)
    return (
      <Stack
        direction="row"
        sx={{
          px: collapsed ? 0 : 1,
          justifyContent: collapsed ? "center" : "flex-start",
          py: 0.5,
          alignItems: "center",
          gap: 1.25,
        }}
      >
        <Skeleton variant="circular" width={32} height={32} />
        {!collapsed && (
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="70%" />
            <Skeleton variant="text" width="40%" />
          </Box>
        )}
      </Stack>
    );

  if (!data?.me) {
    if (collapsed) {
      return (
        <Tooltip title="Войти" placement="right">
          <IconButton component={Link} href="/login" aria-label="Войти">
            <LogIn size={20} />
          </IconButton>
        </Tooltip>
      );
    }
    return (
      <Button component={Link} href="/login" variant="outlined" fullWidth>
        Войти
      </Button>
    );
  }

  const { firstName, lastName, role } = data.me;

  return (
    <Stack
      direction={collapsed ? "column" : "row"}
      sx={{
        p: collapsed ? 0.5 : 0.75,
        px: collapsed ? 0 : 1,
        justifyContent: collapsed ? "center" : "flex-start",
        flexShrink: 0,
        alignItems: "center",
        gap: 0.75,
        borderRadius: "16px",
        bgcolor: "action.hover",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Tooltip title={collapsed ? "Профиль" : ""}>
        <ButtonBase
          component={Link}
          href="/profile"
          aria-label={collapsed ? "Профиль" : undefined}
          sx={{
            flex: collapsed ? "none" : 1,
            minWidth: 0,
            justifyContent: collapsed ? "center" : "flex-start",
            textAlign: "left",
            alignItems: "center",
            gap: collapsed ? 0 : 1.25,
            p: 0.5,
            borderRadius: "12px",
            "&:hover": {
              backgroundColor: "action.hover",
            },
            "&.Mui-focusVisible": {
              outline: "2px solid",
              outlineColor: "primary.main",
              outlineOffset: 2,
            },
          }}
        >
          <UserAvatar user={data.me} size={32} />
          {!collapsed && (
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 500 }} noWrap>
                {firstName} {lastName}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block" }} noWrap>
                {ROLE_LABELS[role]}
              </Typography>
            </Box>
          )}
        </ButtonBase>
      </Tooltip>
      <LogoutButton />
    </Stack>
  );
};
