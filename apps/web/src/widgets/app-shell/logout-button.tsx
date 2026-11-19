"use client";

import { useApolloClient, useMutation } from "@apollo/client/react";
import { Alert, IconButton, Portal, Snackbar, Tooltip } from "@mui/material";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LOGOUT } from "@/shared/api/graphql/logout";

export const LogoutButton = () => {
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
      <Tooltip title="Выйти">
        <span>
          <IconButton
            onClick={onLogout}
            disabled={logoutLoading}
            aria-label="Выйти"
            size="small"
            sx={{
              color: "text.secondary",
              minWidth: { xs: 44, md: 28 },
              minHeight: { xs: 44, md: 28 },
            }}
          >
            <LogOut size={18} strokeWidth={1.75} />
          </IconButton>
        </span>
      </Tooltip>
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
