"use client";

import { CombinedGraphQLErrors } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Button, Grid, Paper, Snackbar, Stack, TextField } from "@mui/material";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { CHANGE_PASSWORD } from "@/shared/api/graphql/profile";
import { ProfileSection } from "../profile-section";
import { type SecuritySchema, securitySchema } from "./security-schema";

export const PasswordForm = () => {
  const [changePassword, { loading }] = useMutation(CHANGE_PASSWORD);
  const [saved, setSaved] = useState(false);
  const form = useForm<SecuritySchema>({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const { handleSubmit } = form;
  const onSubmit = handleSubmit(async (values) => {
    try {
      await changePassword({
        variables: {
          input: {
            currentPassword: values.currentPassword,
            newPassword: values.newPassword,
          },
        },
      });
      form.reset();
      setSaved(true);
    } catch (err) {
      if (CombinedGraphQLErrors.is(err)) {
        if (err.errors[0]?.message === "Неверный текущий пароль") {
          form.setError(
            "currentPassword",
            { message: err.errors[0]?.message },
            { shouldFocus: true },
          );
          return;
        }
      }
      form.setError("root", { message: "Не удалось изменить пароль" });
    }
  });

  return (
    <Stack component="form" sx={{ gap: 2 }} onSubmit={onSubmit} noValidate>
      <Paper variant="outlined">
        <ProfileSection
          title="Смена пароля"
          description="После смены вы останетесь в системе, остальные сеансы будут завершены"
        >
          <Grid container spacing={2.5} sx={{ maxWidth: 620 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="currentPassword"
                control={form.control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Текущий пароль"
                    type="password"
                    autoComplete="current-password"
                    size="small"
                    fullWidth
                    error={Boolean(fieldState.error)}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 0, md: 6 }} />
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="newPassword"
                control={form.control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Новый пароль"
                    type="password"
                    autoComplete="new-password"
                    size="small"
                    fullWidth
                    error={Boolean(fieldState.error)}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="confirmPassword"
                control={form.control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Подтвердите пароль"
                    type="password"
                    autoComplete="new-password"
                    size="small"
                    fullWidth
                    error={Boolean(fieldState.error)}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
          {form.formState.errors.root && (
            <Alert severity="error">{form.formState.errors.root.message}</Alert>
          )}

          <Stack direction="row">
            <Button type="submit" variant="contained" disabled={loading}>
              Изменить пароль
            </Button>
          </Stack>
        </ProfileSection>
      </Paper>

      <Snackbar
        open={saved}
        autoHideDuration={3000}
        onClose={() => setSaved(false)}
        message="Пароль изменён. Другие сеансы завершены"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      />
    </Stack>
  );
};
