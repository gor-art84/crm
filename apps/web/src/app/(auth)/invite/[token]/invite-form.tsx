"use client";
import { useMutation, useQuery } from "@apollo/client/react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { ACCEPT_INVITE, INVITE_PREVIEW } from "@/shared/api/graphql/invites";
import { type InviteSchema, inviteSchema } from "./invite-schema";

export const InviteForm = () => {
  const params = useParams<{ token: string }>();
  const token = typeof params?.token === "string" ? params.token : "";

  const { data, loading, error } = useQuery(INVITE_PREVIEW, {
    variables: { token },
    skip: !token,
  });

  const router = useRouter();
  const [acceptInvite, { loading: loadingAcceptInvite, error: errorAcceptInvite }] =
    useMutation(ACCEPT_INVITE);

  const form = useForm<InviteSchema>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await acceptInvite({ variables: { input: { token, password: values.password } } });
      router.replace("/login");
    } catch {
      //Текст ошибки уже в errorAcceptInvite}
    }
  });

  return (
    <Box sx={{ minHeight: "100dvh", display: "grid", placeItems: "center", px: 2, py: 6 }}>
      <Paper variant="glass" sx={{ width: "100%", maxWidth: 440, p: { xs: 3, sm: 4 } }}>
        {!token ? (
          <Alert severity="error">Ссылка приглашения некорректна</Alert>
        ) : loading ? (
          <Stack sx={{ alignItems: "center", gap: 2, py: 4 }}>
            <CircularProgress size={28} color="inherit" />
            <Typography variant="body2" color="text.secondary">
              Проверяем приглашение…
            </Typography>
          </Stack>
        ) : error || !data?.invitePreview ? (
          <Stack sx={{ gap: 2 }}>
            <Typography variant="h2">Ссылка недоступна</Typography>
            <Typography variant="body1" color="text.secondary">
              Ссылка приглашения недействительна или истекла. Обратитесь к администратору.
            </Typography>
            <Button
              component={Link}
              variant="outlined"
              href="/login"
              sx={{ alignSelf: "flex-start" }}
            >
              На страницу входа
            </Button>
          </Stack>
        ) : (
          <>
            <Stack sx={{ gap: 0.5, mb: 3 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 500 }}
              >
                CRM
              </Typography>
              <Typography variant="h2" sx={{ letterSpacing: "-0.03em" }}>
                Добро пожаловать, {data.invitePreview.firstName}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5, maxWidth: 360 }}>
                Задайте пароль для входа. Email уже назначен администратором.
              </Typography>
            </Stack>
            <Box
              sx={{
                mb: 3,
                px: 1.5,
                py: 1.25,
                borderRadius: 2,
                bgcolor: "background.default",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                Email
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {data.invitePreview.email}
              </Typography>
            </Box>
            <Box component="form" onSubmit={onSubmit} noValidate>
              <Stack sx={{ gap: 2 }}>
                {errorAcceptInvite && <Alert severity="error">{errorAcceptInvite.message}</Alert>}
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      type="password"
                      label="Пароль"
                      autoComplete="new-password"
                      size="small"
                      fullWidth
                      error={Boolean(fieldState.error)}
                      helperText={fieldState.error?.message ?? "Минимум 8 символов"}
                    />
                  )}
                />
                <Controller
                  name="confirmPassword"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      type="password"
                      label="Повторите пароль"
                      autoComplete="new-password"
                      size="small"
                      fullWidth
                      error={Boolean(fieldState.error)}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loadingAcceptInvite || form.formState.isSubmitting}
                  sx={{ mt: 1, py: 1.25 }}
                >
                  {loadingAcceptInvite || form.formState.isSubmitting
                    ? "Сохраняем..."
                    : "Продолжить"}
                </Button>

                <Typography variant="caption" color="text.secondary" sx={{ textAlign: "center" }}>
                  Уже активировали аккаунт?{" "}
                  <Box
                    component={Link}
                    href="/login"
                    sx={{
                      color: "text.primary",
                      fontWeight: 500,
                      textDecoration: "underline",
                    }}
                  >
                    Войти
                  </Box>
                </Typography>
              </Stack>
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
};
