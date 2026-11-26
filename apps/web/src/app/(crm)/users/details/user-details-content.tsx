import { Box, Button, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import dayjs from "dayjs";
import { Archive, ArchiveRestore, X } from "lucide-react";
import { UserHistorySection } from "@/app/(crm)/users/details/user-history-section";
import { formatFullName } from "@/shared/lib/person-name";
import { formatRuPhoneMask } from "@/shared/lib/phone-ru";
import { ROLE_LABELS } from "@/shared/model/roles";
import { StatusChip } from "@/shared/ui/status-chip";
import { UserAvatar } from "@/shared/ui/user-avatar";
import { getUserStatus } from "../model/get-user-status";
import type { UserRow } from "../ui/user-row";

type UserDetailsContentProps = {
  user: UserRow;
  currentUserId: string | undefined;
  pending: boolean;
  onClose: () => void;
  onEdit: (user: UserRow) => void;
  onResendInvite: (userId: string) => void;
  onActivate: (userId: string) => void;
  onDeactivate: (userId: string) => void;
  onArchive: (user: UserRow) => void;
  onRestore: (user: UserRow) => void;
};

export const UserDetailsContent = ({
  user,
  currentUserId,
  pending,
  onClose,
  onEdit,
  onResendInvite,
  onActivate,
  onDeactivate,
  onArchive,
  onRestore,
}: UserDetailsContentProps) => {
  const isCurrentUser = user.id === currentUserId;
  const canChangeAccess = !isCurrentUser && user.archivedAt === null;
  const canArchive = Boolean(currentUserId) && canChangeAccess;
  const canRestore = Boolean(currentUserId) && !isCurrentUser && user.archivedAt !== null;
  return (
    <Stack sx={{ height: "100%", p: 3, gap: 2 }} data-user-panel-content>
      <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", gap: 1 }}>
        <Typography variant="h4" component="h2">
          Пользователь
        </Typography>
        <Stack direction="row" sx={{ alignItems: "center", gap: 0.5, flexShrink: 0 }}>
          {canRestore && (
            <Tooltip title="Восстановить из архива">
              <span style={{ display: "inline-flex" }}>
                <IconButton
                  aria-label="Восстановить из архива"
                  disabled={pending}
                  onClick={() => onRestore(user)}
                  sx={{
                    color: "text.secondary",
                    width: { xs: 44, sm: 36 },
                    height: { xs: 44, sm: 36 },
                  }}
                >
                  <ArchiveRestore size={18} strokeWidth={1.75} />
                </IconButton>
              </span>
            </Tooltip>
          )}
          {canArchive && (
            <Tooltip title="В архив">
              <span style={{ display: "inline-flex" }}>
                <IconButton
                  aria-label="В архив"
                  disabled={pending}
                  onClick={() => onArchive(user)}
                  sx={{
                    color: "text.secondary",
                    width: { xs: 44, sm: 36 },
                    height: { xs: 44, sm: 36 },
                  }}
                >
                  <Archive size={18} strokeWidth={1.75} />
                </IconButton>
              </span>
            </Tooltip>
          )}

          <IconButton aria-label="Закрыть" onClick={onClose} size="small">
            <X size={18} strokeWidth={1.75} />
          </IconButton>
        </Stack>
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
          {(user.inviteStatus === "PENDING" || user.inviteStatus === "EXPIRED") && (
            <Button
              variant="text"
              disabled={pending}
              onClick={() => onResendInvite(user.id)}
              sx={{ alignSelf: "flex-start" }}
            >
              Отправить снова
            </Button>
          )}
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
          value={user.birthDate && dayjs(user.birthDate).format("D MMMM YYYY")}
        />
      </Stack>
      <UserHistorySection userId={user.id} />

      <Stack sx={{ gap: 1, mt: "auto", borderTop: "1px solid", borderColor: "divider", pt: 1.5 }}>
        {isCurrentUser && (
          <Typography variant="caption" color="text.secondary" sx={{ textAlign: "center" }}>
            Это вы
          </Typography>
        )}

        <Stack
          direction={{ xs: "column", lg: "row" }}
          sx={{
            gap: 1,
            alignItems: { xs: "stretch", lg: "center" },
            flexWrap: { lg: "wrap" },
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: canChangeAccess ? "repeat(2, minmax(0, 1fr))" : "minmax(0, 1fr)",
                sm: canChangeAccess ? "auto auto" : "auto",
              },
              width: { xs: "100%", sm: "auto" },
              gap: 1,
              ml: "auto",
              "& > .MuiButton-root": {
                minHeight: { xs: 44, sm: 40 },
              },
            }}
          >
            {!isCurrentUser && canChangeAccess && (
              <Button
                variant="text"
                color="inherit"
                fullWidth
                disabled={pending}
                onClick={() => (user.isActive ? onDeactivate(user.id) : onActivate(user.id))}
                sx={{
                  bgcolor: "action.hover",
                  "&:hover": { bgcolor: "action.selected" },
                }}
              >
                {user.isActive ? "Отключить" : "Включить"}
              </Button>
            )}
            <Button variant="contained" fullWidth onClick={() => onEdit(user)}>
              Изменить
            </Button>
          </Box>
        </Stack>
      </Stack>
    </Stack>
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
