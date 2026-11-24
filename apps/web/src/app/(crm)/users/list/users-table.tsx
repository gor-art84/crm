import {
  Box,
  ButtonBase,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { UserStatus } from "@/app/(crm)/users/ui/user-status";
import type { GetUsersQuery } from "@/generated/graphql";
import { formatFullName } from "@/shared/lib/person-name";
import { ROLE_LABELS } from "@/shared/model/roles";
import { UserAvatar } from "@/shared/ui/user-avatar";
import { getUserStatus } from "../model/get-user-status";
import type { UserRow } from "../ui/user-row";

type UsersTableProps = {
  users: GetUsersQuery["users"];
  onOpen: (user: UserRow) => void;
  selectedUserId?: string | null;
};

export const UsersTable = ({ users, onOpen, selectedUserId }: UsersTableProps) => {
  return (
    <TableContainer component={Paper}>
      <Table
        size="small"
        sx={(theme) => ({
          tableLayout: "fixed",
          minWidth: { xs: "0px", md: "640px" },
          "& .MuiTableCell-root": {
            borderBottomColor: `color-mix(in srgb, ${theme.vars.palette.divider} 60%, transparent)`,
          },
        })}
      >
        <TableHead
          sx={{
            "& .MuiTableCell-head": {
              bgcolor: "transparent",
              color: "text.secondary",
              fontSize: "0.75rem",
              fontWeight: 500,
              lineHeight: 1.5,
              height: 44,
              py: 1,
            },
            'html[data-density="compact"] & .MuiTableCell-head': {
              height: 40,
              py: 0.75,
            },
          }}
        >
          <TableRow>
            <TableCell>Пользователь</TableCell>
            <TableCell
              sx={{
                display: { xs: "none", md: "table-cell" },
                width: { md: "160px", lg: "22%" },
              }}
            >
              Роль
            </TableCell>
            <TableCell
              sx={{
                display: { xs: "none", md: "table-cell" },
                width: { md: "180px", lg: "24%" },
              }}
            >
              Статус
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => {
            const fullName = formatFullName(user).trim() || user.email.trim() || "Без имени";
            return (
              <TableRow
                selected={user.id === selectedUserId}
                hover
                key={user.id}
                onClick={() => onOpen(user)}
                sx={{
                  cursor: "pointer",
                  "& > td": {
                    height: 64,
                    py: 1,
                  },
                  'html[data-density="compact"] & > td': {
                    height: 56,
                    py: 0.75,
                  },
                }}
              >
                <TableCell>
                  <Stack direction="row" sx={{ gap: 1.5, alignItems: "center" }}>
                    <UserAvatar user={user} size={32} />
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Tooltip title={fullName} placement="top-start">
                        <ButtonBase
                          component="button"
                          type="button"
                          aria-label={`Открыть карточку пользователя ${fullName}`}
                          onClick={(event) => {
                            event.stopPropagation();
                            onOpen(user);
                          }}
                          sx={{
                            width: "100%",
                            minWidth: 0,
                            minHeight: 24,
                            justifyContent: "flex-start",
                            textAlign: "left",
                            borderRadius: "4px",
                            "&:hover": {
                              color: "primary.main",
                            },
                            "&.Mui-focusVisible": {
                              outline: "2px solid",
                              outlineColor: "primary.main",
                              outlineOffset: -2,
                            },
                          }}
                        >
                          <Typography
                            component="span"
                            variant="body2"
                            noWrap
                            sx={{
                              fontWeight: 500,
                              minWidth: 0,
                              maxWidth: "100%",
                            }}
                          >
                            {fullName}
                          </Typography>
                        </ButtonBase>
                      </Tooltip>
                      <Typography
                        variant="caption"
                        noWrap
                        title={user.email}
                        sx={{
                          display: "block",
                          color: "text.secondary",
                        }}
                      >
                        {user.email}
                      </Typography>
                      <Stack
                        direction="row"
                        sx={{
                          display: { xs: "flex", md: "none" },
                          flexWrap: "wrap",
                          alignItems: "center",
                          columnGap: 1.5,
                          rowGap: 0.5,
                          mt: 0.5,
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          {ROLE_LABELS[user.role]}
                        </Typography>
                        <UserStatus {...getUserStatus(user)} />
                      </Stack>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      fontWeight: 400,
                    }}
                  >
                    {ROLE_LABELS[user.role]}
                  </Typography>
                </TableCell>
                <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                  <UserStatus {...getUserStatus(user)} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
