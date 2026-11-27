import { useQuery } from "@apollo/client/react";
import { Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import type { ReactNode } from "react";
import type { UserHistoryEventType } from "@/generated/graphql";
import { GET_USER_HISTORY } from "@/shared/api/graphql/users";

export const EVENT_LABELS: Record<UserHistoryEventType, string> = {
  ACTIVATED: "Доступ включен",
  DEACTIVATED: "Доступ отключен",
  ARCHIVED: "Пользователь архивирован",
  RESTORED: "Пользователь восстановлен",
};

type UserHistorySectionProps = {
  userId: string;
};

export const UserHistorySection = ({ userId }: UserHistorySectionProps) => {
  const { data, loading, error } = useQuery(GET_USER_HISTORY, { variables: { userId } });
  const events = data?.userHistory ?? [];
  let content: ReactNode;

  if (loading) {
    content = <Typography variant="body2">Загрузка истории…</Typography>;
  } else if (error) {
    content = <Typography variant="body2">Не удалось загрузить историю</Typography>;
  } else if (events.length === 0) {
    content = <Typography variant="body2">Событий пока нет</Typography>;
  } else {
    content = (
      <Stack component="ul" sx={{ m: 0, p: 0, gap: 1, listStyle: "none" }}>
        {events.map((event) => (
          <Stack key={event.id} component="li" sx={{ gap: 0.25 }}>
            <Typography variant="body2">{EVENT_LABELS[event.type]}</Typography>
            <Typography variant="caption">
              {dayjs(event.createdAt).format("DD.MM.YYYY HH:mm")}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Автор: {event.actorName}
            </Typography>
          </Stack>
        ))}
      </Stack>
    );
  }

  return (
    <Stack component="section" sx={{ gap: 1 }}>
      <Typography component="h3" variant="body2" sx={{ fontWeight: 500 }}>
        История доступа
      </Typography>
      {content}
    </Stack>
  );
};
