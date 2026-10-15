"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import { Alert, Paper, Skeleton, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { ME } from "@/shared/api/graphql/me";
import { ACTIVATE_USER, DEACTIVATE_USER, GET_USERS } from "@/shared/api/graphql/users";
import { CreateUserForm } from "./create-user-form";
import { UsersTable } from "./users-table";

const SKELETON_ROWS = ["row-1", "row-2", "row-3", "row-4", "row-5"];

export const UsersList = () => {
  const { data, loading, error } = useQuery(GET_USERS);
  const { data: meData } = useQuery(ME);

  const [deactivateUser, { error: deactivateError }] = useMutation(DEACTIVATE_USER, {
    refetchQueries: [{ query: GET_USERS }],
  });

  const [activateUser, { error: activateError }] = useMutation(ACTIVATE_USER, {
    refetchQueries: [{ query: GET_USERS }],
  });

  const [pendingUserId, setPendingUserId] = useState<string | null>(null);

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

  const mutationError = deactivateError ?? activateError;

  return (
    <Stack sx={{ gap: 2 }}>
      <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
        <Typography variant="body2" color="text.secondary">
          Всего: {data.users.length}
        </Typography>
      </Stack>
      {mutationError && <Alert severity="error">{mutationError.message}</Alert>}
      {data.users.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography color="text.secondary">Пока нет пользователей</Typography>
        </Paper>
      ) : (
        <UsersTable
          users={data.users}
          onDeactivate={handleDeactivate}
          onActivate={handleActivate}
          currentUserId={meData?.me?.id}
          pendingUserId={pendingUserId}
        />
      )}
      <CreateUserForm />
    </Stack>
  );
};
