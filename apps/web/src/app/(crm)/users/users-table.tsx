import {
  Avatar,
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { EditIcon } from "lucide-react";
import type { GetUsersQuery } from "@/generated/graphql";
import { formatFullName, getInitials } from "@/shared/lib/person-name";
import { ROLE_LABELS } from "@/shared/model/roles";
import type { UserRow } from "./user-row";
import { UserStatusChip } from "./user-status-chip";

type UsersTableProps = {
  users: GetUsersQuery["users"];
  currentUserId: string | undefined;
  pendingUserId: string | null;
  onActivate: (userId: string) => void;
  onDeactivate: (userId: string) => void;
  onEdit: (user: UserRow) => void;
};

export const UsersTable = ({
  users,
  currentUserId,
  pendingUserId,
  onActivate,
  onDeactivate,
  onEdit,
}: UsersTableProps) => {
  return (
    <TableContainer component={Paper}>
      <Table size="small" sx={{ tableLayout: "fixed", minWidth: "760px" }}>
        <TableHead>
          <TableRow>
            <TableCell>Пользователь</TableCell>
            <TableCell width={160}>Роль</TableCell>
            <TableCell width={170}>Телефон</TableCell>
            <TableCell width={130}>Статус</TableCell>
            <TableCell width={120} align="right">
              <Box
                component="span"
                sx={{
                  position: "absolute",
                  width: "1px",
                  height: "1px",
                  margin: "-1px",
                  padding: 0,
                  border: 0,
                  overflow: "hidden",
                  clip: "rect(0 0 0 0)",
                  whiteSpace: "nowrap",
                }}
              >
                Действия
              </Box>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => {
            const isCurrentUser = user.id === currentUserId;
            const isPendingUser = pendingUserId === user.id;
            return (
              <TableRow hover key={user.id}>
                <TableCell>
                  <Stack direction="row" sx={{ gap: 1.5, alignItems: "center" }}>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        fontSize: 13,
                        fontWeight: 600,
                        backgroundColor: "grey.200",
                        color: "text.primary",
                      }}
                    >
                      {getInitials(user.firstName, user.lastName)}
                    </Avatar>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="body2" noWrap sx={{ fontWeight: 500 }}>
                        {formatFullName(user)}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        noWrap
                        sx={{ display: "block" }}
                      >
                        {user.email}
                      </Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell>{ROLE_LABELS[user.role]}</TableCell>
                <TableCell sx={{ fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
                  {user.phone ? (
                    user.phone
                  ) : (
                    <Typography component="span" color="text.disabled">
                      —
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <UserStatusChip isActive={user.isActive} />
                </TableCell>
                <TableCell align="right">
                  <Stack
                    direction="row"
                    sx={{ gap: 0.5, alignItems: "center", justifyContent: "flex-end" }}
                  >
                    <IconButton
                      aria-label="Изменить пользователя"
                      size="small"
                      color="inherit"
                      onClick={() => onEdit(user)}
                    >
                      <EditIcon size={14} strokeWidth={1.5} />
                    </IconButton>
                    {isCurrentUser ? (
                      <Typography variant="caption" color="text.secondary">
                        Это вы
                      </Typography>
                    ) : user.isActive ? (
                      <Button
                        size="small"
                        variant="text"
                        color="inherit"
                        disabled={isPendingUser}
                        onClick={() => onDeactivate(user.id)}
                      >
                        Отключить
                      </Button>
                    ) : (
                      <Button
                        size="small"
                        variant="text"
                        color="inherit"
                        disabled={isPendingUser}
                        onClick={() => onActivate(user.id)}
                      >
                        Включить
                      </Button>
                    )}
                  </Stack>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
