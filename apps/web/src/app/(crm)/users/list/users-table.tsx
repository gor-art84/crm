import {
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
import { formatFullName } from "@/shared/lib/person-name";
import { RoleChip } from "@/shared/ui/role-chip";
import { StatusChip } from "@/shared/ui/status-chip";
import { UserAvatar } from "@/shared/ui/user-avatar";
import { getUserStatus } from "../model/get-user-status";
import type { UserRow } from "../ui/user-row";

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
                    <UserAvatar user={user} size={32} />
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="body2" noWrap sx={{ fontWeight: 500 }}>
                        {formatFullName(user)}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        noWrap
                        sx={{
                          display: "block",
                          'html[data-density="compact"] &': { display: "none" },
                        }}
                      >
                        {user.email}
                      </Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell>
                  <RoleChip role={user.role} />
                </TableCell>
                <TableCell>
                  <StatusChip {...getUserStatus(user)} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
