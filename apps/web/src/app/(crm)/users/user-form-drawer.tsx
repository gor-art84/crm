"use client";

import { Drawer, IconButton, Stack, Typography } from "@mui/material";
import { X } from "lucide-react";
import { formatFullName } from "@/shared/lib/person-name";
import { UserForm } from "./user-form";
import type { UserRow } from "./user-row";

type UserFormDrawerProps = {
  user?: UserRow | null;
  open: boolean;
  onClose: () => void;
};

export const UserFormDrawer = ({ user, open, onClose }: UserFormDrawerProps) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: { xs: "100%", sm: 420 },
          },
        },
      }}
    >
      <Stack sx={{ height: "100%", p: 3, gap: 2 }}>
        <Stack
          direction="row"
          sx={{ alignItems: "center", justifyContent: "space-between", gap: 1 }}
        >
          <Typography variant="h4" component="h2">
            {user
              ? `Редактирование пользователя ${formatFullName({ firstName: user.firstName, middleName: user.middleName, lastName: user.lastName })}`
              : "Новый пользователь"}
          </Typography>
          <IconButton aria-label="Закрыть" onClick={onClose} size="small">
            <X size={18} strokeWidth={1.75} />
          </IconButton>
        </Stack>
        {open && <UserForm key={user?.id ?? "create"} user={user} onClose={onClose} />}
      </Stack>
    </Drawer>
  );
};
