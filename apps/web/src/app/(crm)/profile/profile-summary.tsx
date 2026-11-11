"use client";

import { useApolloClient, useMutation } from "@apollo/client/react";
import { Box, Button, CircularProgress, IconButton, Paper, Stack, Typography } from "@mui/material";
import { Camera } from "lucide-react";
import { type ChangeEvent, useRef, useState } from "react";
import type { MeQuery } from "@/generated/graphql";
import { DELETE_MY_AVATAR } from "@/shared/api/graphql/profile";
import { uploadMyAvatar } from "@/shared/api/upload-user-avatar";
import { formatFullName } from "@/shared/lib/person-name";
import { ConfirmDialog } from "@/shared/ui/confirm-dialog";
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

const MAX_AVATAR_SIZE = 1024 * 1024 * 10;

type ProfileSummaryProps = {
  profile: MeQuery["me"];
};

export const ProfileSummary = ({ profile }: ProfileSummaryProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteMyAvatar, { loading: deleting }] = useMutation(DELETE_MY_AVATAR);

  const client = useApolloClient();

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > MAX_AVATAR_SIZE) {
      setError("Файл больше 10 МБ. Выберите фото поменьше");
      return;
    }
    setError(null);
    try {
      setUploading(true);
      const { avatarUrl } = await uploadMyAvatar(file);
      const cacheId = client.cache.identify({ __typename: "UserObject", id: profile.id });
      if (!cacheId) return;
      client.cache.modify({
        id: cacheId,
        fields: {
          avatarUrl: () => avatarUrl,
        },
      });
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Не удалось загрузить аватар");
    } finally {
      setUploading(false);
    }
  };

  const openConfirm = () => {
    setDeleteError(null);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteMyAvatar();
      setConfirmOpen(false);
    } catch (err) {
      if (err instanceof Error) setDeleteError(err.message);
      else setDeleteError("Не удалось удалить аватар");
    }
  };

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
              bgcolor: "text.primary",
              color: "background.paper",
              "&:hover": {
                bgcolor: "text.primary",
                opacity: 0.85,
              },
              "&.Mui-disabled": {
                bgcolor: "text.primary",
                color: "background.paper",
              },
              border: "3px solid",
              borderColor: "background.paper",
            }}
            disabled={uploading || deleting}
            aria-busy={uploading}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <Camera size={16} strokeWidth={2} />
            )}
          </IconButton>
          <input
            type="file"
            ref={inputRef}
            hidden
            accept="image/png,image/jpeg,image/webp"
            onChange={handleFileChange}
          />
        </Box>
        {profile.avatarUrl && (
          <Button size="small" color="inherit" onClick={openConfirm} disabled={uploading}>
            Удалить фото
          </Button>
        )}
        {error && (
          <Typography variant="caption" color="error">
            {error}
          </Typography>
        )}
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
      <ConfirmDialog
        open={confirmOpen}
        title="Удалить фото профиля?"
        description="Вместо фото будут показаны инициалы"
        confirmLabel="Удалить"
        loading={deleting}
        error={deleteError}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />
    </Paper>
  );
};
