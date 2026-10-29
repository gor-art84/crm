"use client";
import { useQuery } from "@apollo/client/react";
import { Alert, Box, Paper, Skeleton, Stack, Typography } from "@mui/material";
import { MY_PROFILE } from "@/shared/api/graphql/profile";
import { formatFullName } from "@/shared/lib/person-name";
import { RoleChip } from "@/shared/ui/role-chip";
import { UserAvatar } from "@/shared/ui/user-avatar";

export default function ProfilePage() {
  const { data, loading, error } = useQuery(MY_PROFILE);

  if (loading) return <Skeleton variant="rounded" height={120} />;
  if (error) return <Alert severity="error">Не удалось загрузить профиль</Alert>;
  if (!data?.myProfile) return null;
  const { myProfile } = data;

  return (
    <Paper variant="outlined" sx={{ p: 3 }}>
      <Stack direction="row" sx={{ gap: 2, alignItems: "center" }}>
        <UserAvatar user={myProfile} size={64} />
        <Box>
          <Typography variant="h5">{formatFullName(myProfile)}</Typography>
          <Typography color="text.secondary">{myProfile.email}</Typography>
          <Stack direction="row" sx={{ gap: 1, alignItems: "center" }}>
            <RoleChip role={myProfile.role} />
            {myProfile.jobTitle && (
              <Typography color="text.secondary" variant="body2">
                {myProfile.jobTitle}
              </Typography>
            )}
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
}
