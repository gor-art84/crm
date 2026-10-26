"use client";

import { Box, Button, Drawer, IconButton, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import { X } from "lucide-react";
import { formatFullName } from "@/shared/lib/person-name";
import { formatRuPhoneMask } from "@/shared/lib/phone-ru";
import { ROLE_LABELS } from "@/shared/model/roles";
import { StatusChip } from "@/shared/ui/status-chip";
import { UserAvatar } from "@/shared/ui/user-avatar";
import { getUserStatus } from "../model/get-user-status";
import type { UserRow } from "../ui/user-row";

type UserDetailsDrawerProps = {
  user: UserRow | null;
  open: boolean;
  currentUserId: string | undefined;
  pending: boolean;
  onClose: () => void;
  onEdit: (user: UserRow) => void;
  onResendInvite: (userId: string) => void;
  onActivate: (userId: string) => void;
  onDeactivate: (userId: string) => void;
};

export const UserDetailsDrawer = ({
  user,
  open,
  currentUserId,
  pending,
  onClose,
  onEdit,
  onResendInvite,
  onActivate,
  onDeactivate,
}: UserDetailsDrawerProps) => {
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
      {user && (
        <Stack sx={{ height: "100%", p: 3, gap: 2 }}>
          <Stack
            direction="row"
            sx={{ alignItems: "center", justifyContent: "space-between", gap: 1 }}
          >
            <Typography variant="h4" component="h2">
              Пользователь
            </Typography>
            <IconButton aria-label="Закрыть" onClick={onClose} size="small">
              <X size={18} strokeWidth={1.75} />
            </IconButton>
          </Stack>

          <Stack direction="row" sx={{ gap: 1.5, alignItems: "center" }}>
            <UserAvatar user={user} size={56} />
            <Stack sx={{ gap: 0.5, minWidth: 0 }}>
              <Typography variant="body1" sx={{ fontWeight: 500 }} noWrap>
                {formatFullName(user)}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {user.email}
              </Typography>
              <StatusChip {...getUserStatus(user)} />
            </Stack>
          </Stack>

          <Stack sx={{ gap: 1.5 }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Работа
            </Typography>
            <Field label="Роль" value={ROLE_LABELS[user.role]} />
            <Field label="Должность" value={user.jobTitle} />
          </Stack>

          <Stack sx={{ gap: 1.5 }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Контакты
            </Typography>
            <Field label="Телефон" value={user.phone ? formatRuPhoneMask(user.phone) : null} />
            <Field label="Telegram" value={user.telegram} />
            <Field label="WhatsApp" value={user.whatsapp} />
            <Field label="MAX" value={user.maxAccount} />
          </Stack>

          <Stack sx={{ gap: 1.5 }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Профиль
            </Typography>
            <Field
              label="Дата рождения"
              value={
                user.birthDate ? dayjs(user.birthDate as string | Date).format("D MMMM YYYY") : null
              }
            />
          </Stack>

          <Stack sx={{ gap: 1, mt: "auto" }}>
            <Button variant="contained" fullWidth onClick={() => onEdit(user)}>
              Изменить
            </Button>

            {(user.inviteStatus === "PENDING" || user.inviteStatus === "EXPIRED") && (
              <Button
                variant="outlined"
                fullWidth
                disabled={pending}
                onClick={() => onResendInvite(user.id)}
              >
                Отправить снова
              </Button>
            )}

            {user.id === currentUserId ? (
              <Typography variant="caption" color="text.secondary" sx={{ textAlign: "center" }}>
                Это вы
              </Typography>
            ) : user.isActive ? (
              <Button
                variant="outlined"
                color="inherit"
                fullWidth
                disabled={pending}
                onClick={() => onDeactivate(user.id)}
              >
                Отключить
              </Button>
            ) : (
              <Button
                variant="outlined"
                color="inherit"
                fullWidth
                disabled={pending}
                onClick={() => onActivate(user.id)}
              >
                Включить
              </Button>
            )}
          </Stack>
        </Stack>
      )}
    </Drawer>
  );
};

const Field = ({ label, value }: { label: string; value: string | null | undefined }) => {
  const empty = value == null || value.trim() === "";

  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
        {label}
      </Typography>
      <Typography variant="body2" color={empty ? "text.disabled" : "text.primary"}>
        {empty ? "—" : value}
      </Typography>
    </Box>
  );
};
