import { Box, IconButton, Paper, Stack, Typography } from "@mui/material";
import { Camera } from "lucide-react";
import type { MyProfileQuery } from "@/generated/graphql";
import { formatFullName } from "@/shared/lib/person-name";
import { RoleChip } from "@/shared/ui/role-chip";
import { UserAvatar } from "@/shared/ui/user-avatar";

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <Stack sx={{ gap: 0.25 }}>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body2" sx={{ wordBreak: "break-all" }}>
      {value}
    </Typography>
  </Stack>
);

type ProfileSummaryProps = {
  profile: MyProfileQuery["myProfile"];
};

export const ProfileSummary = ({ profile }: ProfileSummaryProps) => {
  return (
    <Paper variant="outlined" sx={{ p: 3 }}>
      <Stack sx={{ gap: 2, alignItems: "center", textAlign: "center" }}>
        <Box sx={{ position: "relative" }}>
          <UserAvatar user={profile} size={112} />
          <IconButton
            aria-label="Изменить фото"
            size="small"
            sx={{
              position: "absolute",
              right: 2,
              bottom: 2,
              width: 34,
              height: 34,
              bgcolor: "grey.900",
              color: "common.white",
              "&:hover": {
                bgcolor: "grey.800",
              },
              border: "3px solid",
              borderColor: "background.paper",
            }}
          >
            <Camera size={16} strokeWidth={2} />
          </IconButton>
        </Box>
        <Stack sx={{ gap: 0.5 }}>
          <Typography variant="h6" component="h1">
            {formatFullName(profile)}
          </Typography>
          {profile.jobTitle && (
            <Typography variant="body2" color="text.secondary">
              {profile.jobTitle}
            </Typography>
          )}
        </Stack>
        <RoleChip role={profile.role} />
        <Stack
          sx={{
            alignSelf: "stretch",
            textAlign: "left",
            gap: 1.25,
            pt: 2,
            borderTop: 1,
            borderColor: "divider",
          }}
        >
          <InfoRow label="Email" value={profile.email} />
          {profile.jobTitle && <InfoRow label="Должность" value={profile.jobTitle} />}
          <Typography variant="caption" color="text.secondary">
            Email, роль и должность меняет администратор.
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );
};
