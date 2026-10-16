"use client";

import { useApolloClient, useMutation, useQuery } from "@apollo/client/react";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LOGOUT } from "@/shared/api/graphql/logout";
import { ME } from "@/shared/api/graphql/me";
import { getInitials } from "@/shared/lib/person-name";
import { ROLE_LABELS } from "@/shared/model/roles";

export const SidebarUser = () => {
  const { data, loading } = useQuery(ME);
  const [logout, { loading: logoutLoading }] = useMutation(LOGOUT);
  const client = useApolloClient();
  const router = useRouter();

  const onLogout = async () => {
    try {
      await logout();
    } finally {
      await client.clearStore();
      router.replace("/login");
    }
  };

  if (loading)
    return (
      <Stack direction="row" sx={{ px: 1, py: 0.5, alignItems: "center", gap: 1.25 }}>
        <Skeleton variant="circular" width={32} height={32} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="70%" />
          <Skeleton variant="text" width="40%" />
        </Box>
      </Stack>
    );

  if (!data?.me)
    return (
      <Button component={Link} href="/login" variant="outlined" fullWidth>
        Войти
      </Button>
    );

  const { firstName, lastName, role } = data.me;

  return (
    <Stack direction="row" sx={{ px: 1, py: 0.5, alignItems: "center", gap: 1.25 }}>
      <Avatar
        sx={{
          width: 32,
          height: 32,
          fontSize: 13,
          fontWeight: 600,
          bgcolor: "grey.200",
          color: "text.primary",
        }}
      >
        {getInitials(firstName, lastName)}
      </Avatar>
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: 500 }} noWrap>
          {firstName} {lastName}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: "block" }} noWrap>
          {ROLE_LABELS[role]}
        </Typography>
      </Box>
      <Tooltip title="Выйти">
        <span>
          <IconButton
            onClick={onLogout}
            disabled={logoutLoading}
            aria-label="Выйти"
            size="small"
            sx={{ color: "text.secondary" }}
          >
            <LogOut size={18} strokeWidth={1.75} />
          </IconButton>
        </span>
      </Tooltip>
    </Stack>
  );
};
