"use client";

import { useMutation } from "@apollo/client/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Box, Button, MenuItem, Stack, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { CREATE_USER, GET_USERS, UPDATE_USER } from "@/shared/api/graphql/users";
import { ROLE_LABELS } from "@/shared/model/roles";
import type { UserRow } from "./user-row";
import { type CreateUserSchema, createUserSchema, editUserSchema } from "./user-schema";

type UserFormProps = {
  user?: UserRow | null;
  onClose: () => void;
};

export const UserForm = ({ user, onClose }: UserFormProps) => {
  const [createUser, { loading: loadingCreate, error: errorCreate }] = useMutation(CREATE_USER);
  const [updateUser, { loading: loadingUpdate, error: errorUpdate }] = useMutation(UPDATE_USER);
  const isEdit = Boolean(user);

  const loading = loadingCreate || loadingUpdate;

  const form = useForm<CreateUserSchema>({
    resolver: zodResolver(isEdit ? editUserSchema : createUserSchema),
    defaultValues: {
      email: user?.email ?? "",
      password: "",
      firstName: user?.firstName ?? "",
      middleName: user?.middleName ?? "",
      lastName: user?.lastName ?? "",
      phone: user?.phone ?? "",
      role: user?.role ?? "MANAGER",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    if (isEdit) {
      if (!user) return;

      try {
        await updateUser({
          variables: {
            userId: user.id,
            updateUserInput: {
              email: values.email,
              firstName: values.firstName,
              middleName: values.middleName?.trim() || null,
              lastName: values.lastName,
              role: values.role,
              phone: values.phone?.trim() || null,
            },
          },
          refetchQueries: [{ query: GET_USERS }],
        });
        onClose();
      } catch {
        // Ошибка в Alert
      }
    } else {
      try {
        await createUser({
          variables: {
            createUserInput: {
              email: values.email,
              password: values.password,
              firstName: values.firstName,
              middleName: values.middleName?.trim() || undefined,
              lastName: values.lastName,
              role: values.role,
              phone: values.phone?.trim() || undefined,
            },
          },
          refetchQueries: [{ query: GET_USERS }],
        });
        onClose();
      } catch {
        // Ошибка в Alert
      }
    }
  });

  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{ display: "flex", flexDirection: "column", flex: 1, gap: 2, minHeight: 0 }}
    >
      {(errorCreate ?? errorUpdate) && (
        <Alert severity="error">{errorCreate?.message ?? errorUpdate?.message}</Alert>
      )}
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
        {!isEdit && (
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
        )}

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
        <Button type="button" variant="text" color="inherit" onClick={onClose}>
          Отмена
        </Button>
        <Button type="submit" variant="contained" disabled={loading || form.formState.isSubmitting}>
          {isEdit ? "Сохранить" : "Создать"}
        </Button>
      </Stack>
    </Box>
  );
};
