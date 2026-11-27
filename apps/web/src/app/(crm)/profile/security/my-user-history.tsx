"use client";

import { useQuery } from "@apollo/client/react";
import { Alert, CircularProgress, Paper, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import type { ReactNode } from "react";
import { ProfileSection } from "@/app/(crm)/profile/profile-section";
import { EVENT_LABELS } from "@/app/(crm)/users/details/user-history-section";
import { MY_USER_HISTORY } from "@/shared/api/graphql/profile";

export const MyUserHistory = () => {
  const { data, loading, error } = useQuery(MY_USER_HISTORY, { ssr: false });
  const events = data?.myUserHistory ?? [];
  let content: ReactNode;

  if (loading) {
    content = <CircularProgress size={24} aria-label="Загрузка истории доступа" />;
  } else if (error) {
    content = <Alert severity="error">Не удалось загрузить историю доступа</Alert>;
  } else if (events.length === 0) {
    content = <Typography color="text.secondary">Событий пока нет</Typography>;
  } else {
    content = (
      <Stack component="ul" sx={{ m: 0, p: 0, gap: 1, listStyle: "none" }}>
        {events.map((event) => (
          <Stack key={event.id} component="li" sx={{ gap: 0.25 }}>
            <Typography variant="body2">{EVENT_LABELS[event.type]}</Typography>
            <Typography variant="caption">
              {dayjs(event.createdAt).format("DD.MM.YYYY HH:mm")}
            </Typography>
          </Stack>
        ))}
      </Stack>
    );
  }

  return (
    <Paper variant="outlined">
      <ProfileSection title="История доступа">{content}</ProfileSection>
    </Paper>
  );
};
