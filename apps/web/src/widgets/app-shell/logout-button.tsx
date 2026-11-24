"use client";

import { useApolloClient, useMutation } from "@apollo/client/react";
import { Alert, Button, IconButton, Portal, Snackbar, Tooltip } from "@mui/material";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LOGOUT } from "@/shared/api/graphql/logout";

type LogoutButtonProps = {
  appearance?: "icon" | "text";
};

export const LogoutButton = ({ appearance = "icon" }: LogoutButtonProps) => {
  const [logout, { loading: logoutLoading }] = useMutation(LOGOUT);
  const router = useRouter();
  const client = useApolloClient();
  const [logoutFailed, setLogoutFailed] = useState(false);

  const onLogout = async () => {
    setLogoutFailed(false);
    try {
      await logout();
      await client.clearStore();
      router.replace("/login");
    } catch {
      setLogoutFailed(true);
    }
  };

  return (
    <>
      {appearance === "text" ? (
        <Button
          type="button"
          variant="outlined"
          color="inherit"
          fullWidth
          startIcon={<LogOut size={18} strokeWidth={1.75} aria-hidden />}
          onClick={onLogout}
          disabled={logoutLoading}
          aria-busy={logoutLoading}
          sx={{
            minHeight: 44,
            color: "text.secondary",
          }}
        >
          {logoutLoading ? "Выходим…" : "Выйти из аккаунта"}
        </Button>
      ) : (
        <Tooltip title="Выйти">
          <span>
            <IconButton
              onClick={onLogout}
              disabled={logoutLoading}
              aria-label="Выйти"
              size="small"
              sx={{
                color: "text.secondary",
                minWidth: 44,
                minHeight: 44,
              }}
            >
              <LogOut size={18} strokeWidth={1.75} />
            </IconButton>
          </span>
        </Tooltip>
      )}

      <Portal>
        <Snackbar
          open={logoutFailed}
          autoHideDuration={5000}
          onClose={() => setLogoutFailed(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            severity="error"
            variant="outlined"
            onClose={() => setLogoutFailed(false)}
            sx={{
              width: "100%",
              bgcolor: "background.paper",
              borderRadius: 2,
            }}
          >
            Не удалось выйти. Попробуйте ещё раз.
          </Alert>
        </Snackbar>
      </Portal>
    </>
  );
};
