"use client";
import { useMutation } from "@apollo/client/react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Button,
  Divider,
  Grid,
  Paper,
  Slide,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
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
import { ProfileSection } from "./profile-section";

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
    <Stack component="form" sx={{ gap: 2 }} onSubmit={onSubmit} noValidate>
      <Paper variant="outlined">
        <ProfileSection title="Личные данные" description="Как к вам обращаться в CRM и в письмах">
          <Grid container spacing={2.5} sx={{ maxWidth: 620 }}>
            <Grid size={{ xs: 12, md: 6 }}>
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
            <Grid size={{ xs: 12, md: 6 }}>
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
            <Grid size={{ xs: 12, md: 6 }}>
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
            <Grid size={{ xs: 12, md: 6 }}>
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
                        helperText: fieldState.error?.message,
                        onBlur: field.onBlur,
                      },
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
        </ProfileSection>

        <Divider />

        <ProfileSection
          title="Контакты"
          description="Необязательно. Помогают коллегам связаться с вами быстрее"
        >
          <Grid container spacing={2.5} sx={{ maxWidth: 620 }}>
            <Grid size={{ xs: 12, md: 6 }}>
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
                    helperText={fieldState.error?.message}
                    onBlur={field.onBlur}
                    onChange={(e) => {
                      field.onChange(formatRuPhoneMask(e.target.value));
                    }}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
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
                    helperText={fieldState.error?.message}
                    onBlur={field.onBlur}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
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
                    helperText={fieldState.error?.message}
                    onBlur={field.onBlur}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
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
                    helperText={fieldState.error?.message}
                    onBlur={field.onBlur}
                  />
                )}
              />
            </Grid>
          </Grid>
        </ProfileSection>
      </Paper>

      {error && <Alert severity="error">Не удалось сохранить данные</Alert>}

      <Slide direction="up" in={form.formState.isDirty} mountOnEnter unmountOnExit>
        <Paper
          elevation={8}
          sx={{
            position: "sticky",
            bottom: 16,
            zIndex: "appBar",
            alignSelf: "center",
            display: "flex",
            gap: 2,
            alignItems: "center",
            py: 1.25,
            pl: 2.5,
            pr: 1.25,
            borderRadius: 2.5,
            bgcolor: "text.primary",
            color: "background.paper",
          }}
        >
          <Typography variant="body2">Есть несохранённые изменения</Typography>
          <Button
            type="button"
            variant="text"
            color="inherit"
            onClick={() => form.reset()}
            disabled={loading}
          >
            Отменить
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            Сохранить
          </Button>
        </Paper>
      </Slide>
      <Snackbar
        open={saved}
        autoHideDuration={3000}
        onClose={() => setSaved(false)}
        message="Профиль сохранён"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      />
    </Stack>
  );
};
