"use client";

import { useMutation } from "@apollo/client/react";
import { Alert, Button, Snackbar, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { REVOKE_OTHER_SESSIONS } from "@/shared/api/graphql/profile";
import { MY_SESSIONS } from "@/shared/api/graphql/sessions";
import { ConfirmDialog } from "@/shared/ui/confirm-dialog";

type OtherSessionsProps = {
  disabled: boolean;
};

export const OtherSessions = ({ disabled }: OtherSessionsProps) => {
  const [revokeOtherSessions, { loading }] = useMutation(REVOKE_OTHER_SESSIONS, {
    refetchQueries: [{ query: MY_SESSIONS }],
  });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const openConfirm = () => {
    setError(null);
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    try {
      const { data } = await revokeOtherSessions();
      if (!data) {
        setError("Не удалось завершить сеансы");
        return;
      }
      setResult(data.revokeOtherSessions);
      setSnackbarOpen(true);
      setConfirmOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось завершить сеансы");
    }
  };

  const message = result > 0 ? `Завершено сеансов: ${result}` : "Других активных сеансов нет";

  return (
    <>
      <Stack sx={{ gap: 0.5, alignItems: "flex-start" }}>
        <Button onClick={openConfirm} variant="outlined" disabled={disabled}>
          Выйти на всех других устройствах
        </Button>
        {disabled && (
          <Typography variant="caption" color="text.secondary">
            Других активных сеансов нет
          </Typography>
        )}
      </Stack>
      <ConfirmDialog
        open={confirmOpen}
        title="Выйти на других устройствах"
        description="Вы уверены, что хотите выйти на всех других устройствах?"
        confirmLabel="Выйти"
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
        <Alert severity="success">{message}</Alert>
      </Snackbar>
    </>
  );
};
