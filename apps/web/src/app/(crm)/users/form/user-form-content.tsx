"use client";

import { IconButton, Stack, Typography } from "@mui/material";
import { X } from "lucide-react";
import type { UserRow } from "../ui/user-row";
import { UserForm } from "./user-form";

type UserFormContentProps = {
  user?: UserRow | null;
  onClose: () => void;
};

export const UserFormContent = ({ user, onClose }: UserFormContentProps) => {
  return (
    <Stack sx={{ height: "100%", p: 3, gap: 2 }} data-user-panel-content>
      <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", gap: 1 }}>
        <Typography variant="h4" component="h2">
          {user ? "Редактирование" : "Новый пользователь"}
        </Typography>
        <IconButton aria-label="Закрыть" onClick={onClose} size="small">
          <X size={18} strokeWidth={1.75} />
        </IconButton>
      </Stack>
      <UserForm key={user?.id ?? "create"} user={user} onClose={onClose} />
    </Stack>
  );
};
