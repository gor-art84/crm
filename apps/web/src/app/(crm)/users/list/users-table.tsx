import {
  Avatar,
  Box,
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
import type { GetUsersQuery } from "@/generated/graphql";
import { formatFullName, getInitials } from "@/shared/lib/person-name";
import { ROLE_LABELS } from "@/shared/model/roles";
import { UserInviteStatusChip } from "../ui/user-invite-status-chip";
import type { UserRow } from "../ui/user-row";
import { UserStatusChip } from "../ui/user-status-chip";

type UsersTableProps = {
  users: GetUsersQuery["users"];
  onOpen: (user: UserRow) => void;
};

export const UsersTable = ({ users, onOpen }: UsersTableProps) => {
  return (
    <TableContainer component={Paper}>
      <Table size="small" sx={{ tableLayout: "fixed", minWidth: "640px" }}>
        <TableHead>
          <TableRow>
            <TableCell>Пользователь</TableCell>
            <TableCell width={160}>Роль</TableCell>
            <TableCell width={180}>Статус</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => {
            return (
              <TableRow hover key={user.id} onClick={() => onOpen(user)} sx={{ cursor: "pointer" }}>
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
                      src={user.avatarUrl ?? undefined}
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
                <TableCell>
                  <Stack direction="row" sx={{ gap: 0.75, alignItems: "center", flexWrap: "wrap" }}>
                    <UserStatusChip isActive={user.isActive} />
                    <UserInviteStatusChip status={user.inviteStatus} />
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
