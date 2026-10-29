"use client";
import { useMutation } from "@apollo/client/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Button, Grid, Paper, Snackbar, Stack, TextField, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import type { MyProfileQuery } from "@/generated/graphql";
import { ME } from "@/shared/api/graphql/me";
import { UPDATE_MY_PROFILE } from "@/shared/api/graphql/profile";
import { toDateInputValue, toDayjs } from "@/shared/lib/date-ru";
import { formatRuPhoneMask } from "@/shared/lib/phone-ru";
import { type ProfileSchema, profileSchema } from "./profile-schema";

type ProfileFormProps = {
  profile: MyProfileQuery["myProfile"];
};

export const ProfileForm = ({ profile }: ProfileFormProps) => {
  const [updateMyProfile, { loading, error }] = useMutation(UPDATE_MY_PROFILE, {
    refetchQueries: [ME],
  });
  const [saved, setSaved] = useState(false);

  const form = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: profile.firstName,
      middleName: profile.middleName ?? "",
      lastName: profile.lastName,
      phone: profile.phone ? formatRuPhoneMask(profile.phone) : "",
      birthDate: toDateInputValue(profile.birthDate),
      telegram: profile.telegram ?? "",
      whatsapp: profile.whatsapp ?? "",
      maxAccount: profile.maxAccount ?? "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await updateMyProfile({
        variables: {
          input: {
            firstName: values.firstName,
            middleName: values.middleName.trim() || null,
            lastName: values.lastName,
            phone: values.phone || null,
            birthDate: values.birthDate || null,
            telegram: values.telegram.trim() || null,
            whatsapp: values.whatsapp.trim() || null,
            maxAccount: values.maxAccount.trim() || null,
          },
        },
      });
      form.reset(form.getValues());
      setSaved(true);
    } catch {
      // Ошибка в Alert
    }
  });
  return (
    <Paper variant="outlined" component="form" onSubmit={onSubmit} noValidate sx={{ p: 3 }}>
      <Grid container spacing={2}>
        <Grid size={12}>
          <Typography variant="subtitle2" color="text.secondary">
            Личные данные
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Controller
            name="lastName"
            control={form.control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Фамилия"
                size="small"
                fullWidth
                error={Boolean(fieldState.error)}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Controller
            name="firstName"
            control={form.control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Имя"
                size="small"
                fullWidth
                error={Boolean(fieldState.error)}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Controller
            name="middleName"
            control={form.control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Отчество"
                size="small"
                fullWidth
                error={Boolean(fieldState.error)}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Controller
            name="birthDate"
            control={form.control}
            render={({ field, fieldState }) => (
              <DatePicker
                label="Дата рождения"
                disableFuture
                format="DD.MM.YYYY"
                value={toDayjs(field.value)}
                minDate={dayjs("1900-01-01")}
                onChange={(value) => {
                  field.onChange(value?.isValid() ? value.format("YYYY-MM-DD") : "");
                }}
                slotProps={{
                  textField: {
                    size: "small",
                    fullWidth: true,
                    error: Boolean(fieldState.error),
                    helperText: fieldState.error?.message ?? "Можно не указывать",
                    onBlur: field.onBlur,
                  },
                }}
              />
            )}
          />
        </Grid>

        <Grid size={12}>
          <Typography variant="subtitle2" color="text.secondary">
            Контакты
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Controller
            name="phone"
            control={form.control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Телефон"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="+7 (900) 123-45-67"
                size="small"
                fullWidth
                error={Boolean(fieldState.error)}
                helperText={fieldState.error?.message ?? "Можно не указывать"}
                onBlur={field.onBlur}
                onChange={(e) => {
                  field.onChange(formatRuPhoneMask(e.target.value));
                }}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Controller
            name="whatsapp"
            control={form.control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="WhatsApp"
                type="text"
                size="small"
                placeholder="+7 (900) 123-45-67"
                fullWidth
                error={Boolean(fieldState.error)}
                helperText={fieldState.error?.message ?? "Можно не указывать"}
                onBlur={field.onBlur}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Controller
            name="telegram"
            control={form.control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Telegram"
                type="text"
                size="small"
                placeholder="@username"
                fullWidth
                error={Boolean(fieldState.error)}
                helperText={fieldState.error?.message ?? "Можно не указывать"}
                onBlur={field.onBlur}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Controller
            name="maxAccount"
            control={form.control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="MAX"
                type="text"
                size="small"
                placeholder="@username"
                fullWidth
                error={Boolean(fieldState.error)}
                helperText={fieldState.error?.message ?? "Можно не указывать"}
                onBlur={field.onBlur}
              />
            )}
          />
        </Grid>
      </Grid>
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Не удалось сохранить данные
        </Alert>
      )}
      <Stack direction="row" sx={{ gap: 1, justifyContent: "flex-end", mt: 3 }}>
        <Button
          type="button"
          variant="text"
          color="inherit"
          onClick={() => form.reset()}
          disabled={loading || !form.formState.isDirty}
        >
          Отменить
        </Button>
        <Button type="submit" variant="contained" disabled={loading || !form.formState.isDirty}>
          Сохранить
        </Button>
      </Stack>
      <Snackbar
        open={saved}
        autoHideDuration={3000}
        onClose={() => setSaved(false)}
        message="Профиль сохранён"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      />
    </Paper>
  );
};
