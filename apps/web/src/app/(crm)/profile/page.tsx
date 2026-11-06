"use client";
import { useQuery } from "@apollo/client/react";
import { Alert, Box, Skeleton } from "@mui/material";
import { ME } from "@/shared/api/graphql/me";
import { ProfileForm } from "./profile-form";
import { ProfileSummary } from "./profile-summary";

const gridSx = {
  display: "grid",
  gridTemplateColumns: {
    xs: "1fr",
    lg: "300px minmax(0, 1fr)",
  },
  gap: 3,
  alignItems: "start",
} as const;

export default function ProfilePage() {
  const { data, loading, error } = useQuery(ME);

  if (loading)
    return (
      <Box sx={gridSx}>
        <Skeleton variant="rounded" height={420} />
        <Skeleton variant="rounded" height={520} />
      </Box>
    );
  if (error) return <Alert severity="error">Не удалось загрузить профиль</Alert>;
  if (!data?.me) return null;
  const { me } = data;

  return (
    <Box sx={gridSx}>
      <ProfileSummary profile={me} />
      <ProfileForm profile={me} />
    </Box>
  );
}
