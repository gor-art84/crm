"use client";

import { useMutation } from "@apollo/client/react";
import { Alert, Button, Paper, Snackbar } from "@mui/material";
import { useState } from "react";
import { REVOKE_OTHER_SESSIONS } from "@/shared/api/graphql/profile";
import { ConfirmDialog } from "@/shared/ui/confirm-dialog";
import { ProfileSection } from "../profile-section";

export const OtherSessions = () => {
  const [revokeOtherSessions, { loading }] = useMutation(REVOKE_OTHER_SESSIONS);
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
    <Paper variant="outlined">
      <ProfileSection title="Другие устройства" description="Завершить все сеансы, кроме текущего">
        <Button onClick={openConfirm} variant="outlined">
          Выйти на всех других устройствах
        </Button>
      </ProfileSection>
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
    </Paper>
  );
};
