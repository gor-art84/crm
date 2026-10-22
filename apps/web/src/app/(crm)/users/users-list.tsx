"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import { Alert, Button, Paper, Skeleton, Stack, Typography } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { RESEND_INVITE } from "@/shared/api/graphql/invites";
import { ME } from "@/shared/api/graphql/me";
import { ACTIVATE_USER, DEACTIVATE_USER, GET_USERS } from "@/shared/api/graphql/users";
import { UserDetailsDrawer } from "./details/user-details-drawer";
import { UserFormDrawer } from "./form/user-form-drawer";
import {
  filterUsers,
  parseUsersFilters,
  type UsersFiltersType,
  usersFiltersToSearchParams,
} from "./list/filter-users";
import { UsersFilters } from "./list/users-filters";
import { UsersTable } from "./list/users-table";
import type { UserRow } from "./ui/user-row";

const SKELETON_ROWS = ["row-1", "row-2", "row-3", "row-4", "row-5"];

type DrawerState = { type: "closed" } | { type: "create" } | { type: "edit"; user: UserRow };

export const UsersList = () => {
  const { data, loading, error } = useQuery(GET_USERS);
  const { data: meData } = useQuery(ME);

  const [deactivateUser, { error: deactivateError }] = useMutation(DEACTIVATE_USER, {
    refetchQueries: [{ query: GET_USERS }],
  });

  const [activateUser, { error: activateError }] = useMutation(ACTIVATE_USER, {
    refetchQueries: [{ query: GET_USERS }],
  });

  const [resendInvite, { error: resendError }] = useMutation(RESEND_INVITE, {
    refetchQueries: [{ query: GET_USERS }],
  });

  const [pendingUserId, setPendingUserId] = useState<string | null>(null);
  const [drawer, setDrawer] = useState<DrawerState>({ type: "closed" });
  const [detailsUser, setDetailsUser] = useState<UserRow | null>(null);

  const pathName = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const filters = parseUsersFilters(searchParams);

  const setFilters = (next: UsersFiltersType) => {
    const params = usersFiltersToSearchParams(next);
    const query = params.toString();
    router.replace(query ? `${pathName}?${query}` : pathName, { scroll: false });
  };

  if (loading && !data)
    return (
      <Paper sx={{ p: 2 }}>
        <Stack sx={{ gap: 1.5 }}>
          {SKELETON_ROWS.map((row) => (
            <Skeleton key={row} variant="rounded" height={40} />
          ))}
        </Stack>
      </Paper>
    );

  if (error || !data) return <Alert severity="error">Не удалось загрузить пользователей</Alert>;

  const filteredUsers = filterUsers(data.users, filters);
  const hasActiveFilters = Boolean(filters.q.trim() || filters.role || filters.status);

  const handleDeactivate = async (userId: string) => {
    setPendingUserId(userId);
    try {
      await deactivateUser({ variables: { userId } });
    } catch {
      // Ошибка отображается через состояние мутации
    } finally {
      setPendingUserId(null);
    }
  };

  const handleActivate = async (userId: string) => {
    setPendingUserId(userId);
    try {
      await activateUser({ variables: { userId } });
    } catch {
      // Ошибка отображается через состояние мутации
    } finally {
      setPendingUserId(null);
    }
  };

  const handleResendInvite = async (userId: string) => {
    setPendingUserId(userId);
    try {
      await resendInvite({ variables: { userId } });
    } catch {
      // Ошибка отображается через состояние мутации
    } finally {
      setPendingUserId(null);
    }
  };

  const mutationError = deactivateError ?? activateError ?? resendError;

  return (
    <Stack sx={{ gap: 2 }}>
      <UsersFilters value={filters} onChange={setFilters} />
      <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
        <Typography variant="body2" color="text.secondary">
          {hasActiveFilters
            ? `Найдено: ${filteredUsers.length} из ${data.users.length}`
            : `Всего: ${data.users.length}`}
        </Typography>
        <Button variant="contained" size="small" onClick={() => setDrawer({ type: "create" })}>
          Добавить пользователя
        </Button>
      </Stack>
      {mutationError && <Alert severity="error">{mutationError.message}</Alert>}
      {data.users.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography color="text.secondary">Пока нет пользователей</Typography>
        </Paper>
      ) : data.users.length > 0 && filteredUsers.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography color="text.secondary">
            Нет пользователей, соответствующих фильтрам
          </Typography>
          <Button
            size="small"
            variant="text"
            color="inherit"
            onClick={() => setFilters({ q: "", role: "", status: "" })}
          >
            Сбросить фильтры
          </Button>
        </Paper>
      ) : (
        <UsersTable users={filteredUsers} onOpen={(user) => setDetailsUser(user)} />
      )}
      <UserFormDrawer
        user={drawer.type === "edit" ? drawer.user : null}
        open={drawer.type !== "closed"}
        onClose={() => setDrawer({ type: "closed" })}
      />
      <UserDetailsDrawer
        user={detailsUser}
        open={detailsUser !== null}
        currentUserId={meData?.me?.id}
        pending={pendingUserId !== null && pendingUserId === detailsUser?.id}
        onClose={() => setDetailsUser(null)}
        onEdit={(user) => {
          setDetailsUser(null);
          setDrawer({ type: "edit", user });
        }}
        onResendInvite={handleResendInvite}
        onActivate={handleActivate}
        onDeactivate={handleDeactivate}
      />
    </Stack>
  );
};
