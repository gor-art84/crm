"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import {
  Alert,
  Box,
  Button,
  Drawer,
  Paper,
  Skeleton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import type { Theme } from "@mui/material/styles";
import { usePathname, useSearchParams } from "next/navigation";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { UserDetailsContent } from "@/app/(crm)/users/details/user-details-content";
import { UserFormContent } from "@/app/(crm)/users/form/user-form-content";
import { RESEND_INVITE } from "@/shared/api/graphql/invites";
import { ME } from "@/shared/api/graphql/me";
import { ACTIVATE_USER, DEACTIVATE_USER, GET_USERS } from "@/shared/api/graphql/users";
import {
  filterUsers,
  parseUsersFilters,
  type UsersFiltersType,
  usersFiltersToSearchParams,
} from "./list/filter-users";
import { UsersFilters } from "./list/users-filters";
import { UsersTable } from "./list/users-table";

const SKELETON_ROWS = ["row-1", "row-2", "row-3", "row-4", "row-5"];
const URL_UPDATE_DELAY_MS = 300;

type PanelState =
  | { type: "closed" }
  | { type: "create" }
  | { type: "view"; userId: string }
  | { type: "edit"; userId: string };

const panelSurface = (theme: Theme) => ({
  backgroundColor: theme.vars.palette.background.paper,
  backgroundImage: `radial-gradient(
    ellipse at top right,
    color-mix(in srgb, ${theme.vars.palette.primary.main} 10%, transparent),
    transparent 65%
  )`,
  borderColor: `color-mix(
    in srgb,
    ${theme.vars.palette.primary.main} 22%,
    ${theme.vars.palette.divider}
  )`,
});

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
  const [panel, setPanel] = useState<PanelState>({ type: "closed" });
  const closePanel = () => setPanel({ type: "closed" });
  const theme = useTheme();
  const isWideScreen = useMediaQuery(theme.breakpoints.up("lg"));

  const pathName = usePathname();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.toString();

  const [filters, setLocalFilters] = useState<UsersFiltersType>(() =>
    parseUsersFilters(searchParams),
  );

  const urlTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastWrittenQueryRef = useRef<string | null>(null);

  useEffect(() => {
    const actualQuery = new URLSearchParams(window.location.search).toString();

    if (urlQuery !== actualQuery) return;

    if (lastWrittenQueryRef.current === urlQuery) {
      lastWrittenQueryRef.current = null;
      return;
    }

    if (urlTimerRef.current !== null) {
      clearTimeout(urlTimerRef.current);
      urlTimerRef.current = null;
    }

    lastWrittenQueryRef.current = null;

    setLocalFilters(parseUsersFilters(new URLSearchParams(urlQuery)));
  }, [urlQuery]);

  useEffect(() => {
    const handlePopState = () => {
      if (urlTimerRef.current !== null) {
        clearTimeout(urlTimerRef.current);
        urlTimerRef.current = null;
      }

      lastWrittenQueryRef.current = null;

      setLocalFilters(parseUsersFilters(new URLSearchParams(window.location.search)));
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);

      if (urlTimerRef.current !== null) {
        clearTimeout(urlTimerRef.current);
        urlTimerRef.current = null;
      }
    };
  }, []);

  const setFilters = (next: UsersFiltersType) => {
    setLocalFilters(next);
    if (urlTimerRef.current !== null) {
      clearTimeout(urlTimerRef.current);
    }
    const params = usersFiltersToSearchParams(next);
    const query = params.toString();
    const sourceQuery = new URLSearchParams(window.location.search).toString();
    urlTimerRef.current = setTimeout(() => {
      urlTimerRef.current = null;

      const currentQuery = new URLSearchParams(window.location.search).toString();

      if (window.location.pathname !== pathName || currentQuery !== sourceQuery) {
        return;
      }

      if (currentQuery === query) return;

      lastWrittenQueryRef.current = query;

      window.history.replaceState(null, "", query ? `${pathName}?${query}` : pathName);
    }, URL_UPDATE_DELAY_MS);
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

  const selectedUserId = "userId" in panel ? panel.userId : null;
  const selectedUser = data.users.find((user) => user.id === selectedUserId);

  let panelContent: ReactNode = null;

  if (panel.type === "view" && selectedUser) {
    panelContent = (
      <UserDetailsContent
        user={selectedUser}
        currentUserId={meData?.me?.id}
        pending={pendingUserId === selectedUser.id}
        onClose={closePanel}
        onEdit={(user) => setPanel({ type: "edit", userId: user.id })}
        onResendInvite={handleResendInvite}
        onActivate={handleActivate}
        onDeactivate={handleDeactivate}
      />
    );
  } else if (panel.type === "edit" && selectedUser) {
    panelContent = <UserFormContent user={selectedUser} onClose={closePanel} />;
  } else if (panel.type === "create") {
    panelContent = <UserFormContent onClose={closePanel} />;
  }

  const isPanelOpen = panelContent !== null;
  const showInlinePanel = isWideScreen && isPanelOpen;

  return (
    <>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: showInlinePanel
            ? "minmax(0, 1fr) minmax(360px, 40%)"
            : "minmax(0, 1fr)",
          alignItems: "start",
          gap: 2,
          mt: -2,
        }}
      >
        <Stack sx={{ gap: 2, minWidth: 0 }}>
          <Box
            component="section"
            aria-label="Поиск и управление пользователями"
            sx={{
              position: "sticky",
              top: 56,
              zIndex: 1,
              bgcolor: "background.paper",
              display: "flex",
              flexDirection: "column",
              gap: 2,
              pt: 4,
              pb: 2,
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
              <Typography variant="body2" color="text.secondary">
                {hasActiveFilters
                  ? `Найдено: ${filteredUsers.length} из ${data.users.length}`
                  : `Всего: ${data.users.length}`}
              </Typography>
              <Button
                variant="contained"
                size="small"
                onClick={() => setPanel({ type: "create" })}
                sx={{ flexShrink: 0 }}
              >
                Добавить пользователя
              </Button>
            </Stack>
            <UsersFilters value={filters} onChange={setFilters} />
          </Box>
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
            <UsersTable
              selectedUserId={selectedUserId}
              users={filteredUsers}
              onOpen={(user) => setPanel({ type: "view", userId: user.id })}
            />
          )}
        </Stack>
        {showInlinePanel && (
          <Paper
            variant="outlined"
            sx={(theme) => ({
              ...panelSurface(theme),
              minWidth: 0,
              position: "sticky",
              top: 72,
              height: "calc(100dvh - 124px)",
              overflowY: panel.type === "view" ? "auto" : "hidden",
              "@media (prefers-reduced-motion: no-preference)": {
                "& > [data-user-panel-content]": {
                  animation: "user-panel-fade-in 160ms ease-out",
                },
                "@keyframes user-panel-fade-in": {
                  from: { opacity: 0.82 },
                  to: { opacity: 1 },
                },
              },
            })}
          >
            {panelContent}
          </Paper>
        )}
      </Box>
      <Drawer
        anchor="right"
        open={!isWideScreen && isPanelOpen}
        onClose={closePanel}
        slotProps={{
          paper: {
            sx: (theme) => ({
              ...panelSurface(theme),
              width: { xs: "100%", sm: 420 },
            }),
          },
        }}
      >
        {!isWideScreen && panelContent}
      </Drawer>
    </>
  );
};
