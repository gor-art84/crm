"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import {
  Alert,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { ProfileSection } from "@/app/(crm)/profile/profile-section";
import { OtherSessions } from "@/app/(crm)/profile/security/other-sessions";
import { describeDevice, describeSessionMeta } from "@/app/(crm)/profile/security/session-label";
import type { MySessionsQuery } from "@/generated/graphql";
import { MY_SESSIONS, REVOKE_SESSION } from "@/shared/api/graphql/sessions";
import { ConfirmDialog } from "@/shared/ui/confirm-dialog";

type Session = MySessionsQuery["mySessions"][number];

export const SessionList = () => {
  const {
    data,
    loading: listLoading,
    error: listError,
    refetch,
  } = useQuery(MY_SESSIONS, { fetchPolicy: "cache-and-network" });
  const [revokeSession, { loading }] = useMutation(REVOKE_SESSION, {
    refetchQueries: [{ query: MY_SESSIONS }],
  });
  const [pending, setPending] = useState<Session | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbarText, setSnackbarText] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const sessions = data?.mySessions ?? [];
  const hasOthers = sessions.some((s) => !s.isCurrent);

  const openConfirm = (session: Session) => {
    setPending(session);
    setError(null);
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    if (!pending) return;
    try {
      const { data } = await revokeSession({ variables: { id: pending.id } });
      if (!data) {
        setError("Не удалось завершить сеанс");
        return;
      }
      setConfirmOpen(false);
      setSnackbarText(data.revokeSession ? "Сеанс завершён" : "Сеанс уже завершён");
      setSnackbarOpen(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось завершить сеанс");
    }
  };

  const handleRetry = async () => {
    try {
      await refetch();
    } catch {
      // Ошибка запроса отображается через listError из useQuery.
    }
  };

  return (
    <Paper variant="outlined">
      <ProfileSection
        title="Активные сеансы"
        description="Устройства, на которых выполнен вход в аккаунт"
      >
        {listLoading && !data && <CircularProgress size={24} />}
        {listError && (
          <Alert
            severity="error"
            action={
              <Button size="small" color="inherit" onClick={handleRetry} disabled={listLoading}>
                Повторить
              </Button>
            }
          >
            Не удалось загрузить сеансы
          </Alert>
        )}
        <Stack divider={<Divider flexItem />}>
          {sessions.map((s) => (
            <Stack key={s.id} direction="row" sx={{ alignItems: "center", py: 1.5, gap: 2 }}>
              <Stack sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {describeDevice(s.browser, s.os)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {describeSessionMeta(s.deviceType, s.issuedAt)}
                </Typography>
              </Stack>
              {s.isCurrent ? (
                <Chip label="Это устройство" color="primary" size="small" variant="outlined" />
              ) : (
                <Button size="small" color="error" onClick={() => openConfirm(s)}>
                  Завершить
                </Button>
              )}
            </Stack>
          ))}
        </Stack>
        {data && <OtherSessions disabled={!hasOthers} />}
      </ProfileSection>
      <ConfirmDialog
        open={confirmOpen}
        title="Завершить сеанс"
        description={`Завершить сеанс на устройстве ${pending ? describeDevice(pending.browser, pending.os) : ""}?`}
        confirmLabel="Завершить"
        loading={loading}
        error={error}
        onConfirm={handleConfirm}
        onClose={() => setConfirmOpen(false)}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity="success">{snackbarText}</Alert>
      </Snackbar>
    </Paper>
  );
};
