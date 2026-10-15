"use client";

import { useMutation } from "@apollo/client/react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Box,
  Button,
  Drawer,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { X } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { CREATE_USER, GET_USERS } from "@/shared/api/graphql/users";
import { ROLE_LABELS } from "@/shared/model/roles";
import { type CreateUserSchema, createUserSchema } from "./create-user-schema";

type CreateUserDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export const CreateUserDrawer = ({ open, onClose }: CreateUserDrawerProps) => {
  const [createUser, { loading, error, reset: resetMutation }] = useMutation(CREATE_USER);

  const form = useForm<CreateUserSchema>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      middleName: "",
      lastName: "",
      role: "MANAGER",
      phone: "",
    },
  });

  const handleClose = () => {
    form.reset();
    resetMutation();
    onClose();
  };

  const onSubmit = form.handleSubmit(async (values) => {
    const createUserInput = {
      ...values,
      middleName: values.middleName?.trim() || undefined,
      phone: values.phone?.trim() || undefined,
    };

    try {
      await createUser({
        variables: { createUserInput },
        refetchQueries: [{ query: GET_USERS }],
      });
      form.reset();
      resetMutation();
      onClose();
    } catch {
      // Ошибка в Alert
    }
  });

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      slotProps={{
        paper: {
          sx: {
            width: { xs: "100%", sm: 420 },
          },
        },
      }}
    >
      <Stack sx={{ height: "100%", p: 3, gap: 2 }}>
        <Stack
          direction="row"
          sx={{ alignItems: "center", justifyContent: "space-between", gap: 1 }}
        >
          <Typography variant="h4" component="h2">
            Новый пользователь
          </Typography>
          <IconButton aria-label="Закрыть" onClick={handleClose} size="small">
            <X size={18} strokeWidth={1.75} />
          </IconButton>
        </Stack>

        <Box
          component="form"
          onSubmit={onSubmit}
          sx={{ display: "flex", flexDirection: "column", flex: 1, gap: 2, minHeight: 0 }}
        >
          {error && <Alert severity="error">{error.message}</Alert>}
          <Stack sx={{ flex: 1, gap: 2 }}>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  type="email"
                  label="Email"
                  autoComplete="email"
                  size="small"
                  fullWidth
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message}
                />
              )}
            />
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
                  helperText={fieldState.error?.message}
                />
              )}
            />
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
            <Controller
              name="role"
              control={form.control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  select
                  label="Роль"
                  size="small"
                  fullWidth
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message}
                >
                  {Object.entries(ROLE_LABELS).map(([value, label]) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            <Controller
              name="phone"
              control={form.control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Телефон"
                  type="tel"
                  size="small"
                  fullWidth
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Stack>
          <Stack direction="row" sx={{ gap: 1, justifyContent: "flex-end", mt: "auto" }}>
            <Button type="button" variant="text" color="inherit" onClick={handleClose}>
              Отмена
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading || form.formState.isSubmitting}
            >
              Создать
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Drawer>
  );
};
