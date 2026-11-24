"use client";

import { useQuery } from "@apollo/client/react";
import { ButtonBase, IconButton, Skeleton, Stack, Tooltip } from "@mui/material";
import { LogIn } from "lucide-react";
import Link from "next/link";
import { ME } from "@/shared/api/graphql/me";
import { UserAvatar } from "@/shared/ui/user-avatar";
import { LogoutButton } from "@/widgets/app-shell/logout-button";

export const SidebarUser = () => {
  const { data, loading } = useQuery(ME);

  if (loading)
    return (
      <Stack
        direction="row"
        sx={{
          px: 0,
          justifyContent: "center",
          py: 0.5,
          alignItems: "center",
          gap: 1.25,
        }}
      >
        <Skeleton variant="circular" width={32} height={32} />
      </Stack>
    );

  if (!data?.me) {
    return (
      <Tooltip title="Войти" placement="right">
        <IconButton
          component={Link}
          href="/login"
          aria-label="Войти"
          sx={{ width: 44, height: 44, alignSelf: "center" }}
        >
          <LogIn size={20} />
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <Stack
      sx={{
        alignItems: "center",
        flexShrink: 0,
        gap: 0.75,
        py: 0.5,
      }}
    >
      <Tooltip title="Профиль" placement="right">
        <ButtonBase
          component={Link}
          href="/profile"
          aria-label="Профиль"
          sx={{
            width: 44,
            height: 44,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
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
        </ButtonBase>
      </Tooltip>
      <LogoutButton />
    </Stack>
  );
};
