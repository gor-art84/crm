"use client";

import { useApolloClient, useMutation } from "@apollo/client/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Avatar, Box, Button, MenuItem, Stack, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { CREATE_USER, GET_USERS, UPDATE_USER } from "@/shared/api/graphql/users";
import { uploadUserAvatar } from "@/shared/api/upload-user-avatar";
import { toDateInputValue, toDayjs } from "@/shared/lib/date-ru";
import { formatFullName, getInitials } from "@/shared/lib/person-name";
import { formatRuPhoneMask } from "@/shared/lib/phone-ru";
import { ROLE_LABELS } from "@/shared/model/roles";
import type { UserRow } from "../ui/user-row";
import { useFioSuggest } from "./use-fio-suggest";
import { UserFioAutocomplete } from "./user-fio-autocomplete";
import { type CreateUserSchema, createUserSchema, editUserSchema } from "./user-schema";

type UserFormProps = {
  user?: UserRow | null;
  onClose: () => void;
};

export const UserForm = ({ user, onClose }: UserFormProps) => {
  const [createUser, { loading: loadingCreate, error: errorCreate }] = useMutation(CREATE_USER);
  const [updateUser, { loading: loadingUpdate, error: errorUpdate }] = useMutation(UPDATE_USER);
  const { fioOptions, fioInput, setFioInput, fioLoading, cleanFioLoading, runCleanFio } =
    useFioSuggest(
      user
        ? formatFullName({
            firstName: user.firstName,
            middleName: user.middleName,
            lastName: user.lastName,
          })
        : "",
    );

  const client = useApolloClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatarUrl ?? null);
  const [avatarErr, setAvatarErr] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState<boolean>(false);

  const isEdit = Boolean(user);

  const loading = loadingCreate || loadingUpdate;

  const form = useForm<CreateUserSchema>({
    resolver: zodResolver(isEdit ? editUserSchema : createUserSchema),
    defaultValues: {
      email: user?.email ?? "",
      firstName: user?.firstName ?? "",
      middleName: user?.middleName ?? "",
      lastName: user?.lastName ?? "",
      phone: user?.phone ? formatRuPhoneMask(user.phone) : "",
      role: user?.role ?? "MANAGER",
      birthDate: toDateInputValue(user?.birthDate),
      jobTitle: user?.jobTitle ?? "",
      telegram: user?.telegram ?? "",
      whatsapp: user?.whatsapp ?? "",
      maxAccount: user?.maxAccount ?? "",
    },
  });

  const applyFioParts = (parts: {
    surname?: string | null;
    name?: string | null;
    patronymic?: string | null;
    value?: string | null;
  }) => {
    form.setValue("lastName", parts.surname ?? "", { shouldValidate: true, shouldDirty: true });
    form.setValue("firstName", parts.name ?? "", { shouldValidate: true, shouldDirty: true });
    form.setValue("middleName", parts.patronymic ?? "", {
      shouldValidate: true,
      shouldDirty: true,
    });
    if (parts.value) setFioInput(parts.value);
  };

  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !user) return;

    const allowed = new Set(["image/png", "image/jpeg", "image/webp"]);
    if (!allowed.has(file.type)) {
      setAvatarErr("Недопустимый формат файла. Допустимые форматы: png, jpeg, webp.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setAvatarErr("Файл слишком большой. Максимальный размер: 10 MB.");
      return;
    }

    setAvatarErr(null);
    setAvatarUploading(true);
    try {
      const { avatarUrl } = await uploadUserAvatar(user.id, file);
      setAvatarPreview(avatarUrl);
      await client.refetchQueries({ include: [GET_USERS] });
    } catch (err) {
      setAvatarErr(err instanceof Error ? err.message : "Ошибка при загрузке аватара");
    } finally {
      setAvatarUploading(false);
    }
  };

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
              phone: values.phone || null,
              birthDate: values.birthDate || null,
              jobTitle: values.jobTitle.trim() || null,
              telegram: values.telegram?.trim() || null,
              whatsapp: values.whatsapp?.trim() || null,
              maxAccount: values.maxAccount.trim() || null,
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
              firstName: values.firstName,
              middleName: values.middleName?.trim() || undefined,
              lastName: values.lastName,
              role: values.role,
              phone: values.phone || undefined,
              birthDate: values.birthDate || undefined,
              jobTitle: values.jobTitle.trim() || undefined,
              telegram: values.telegram?.trim() || undefined,
              whatsapp: values.whatsapp?.trim() || undefined,
              maxAccount: values.maxAccount.trim() || undefined,
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
      {isEdit && user && (
        <Stack direction="row" sx={{ gap: 2, alignItems: "center" }}>
          <Avatar
            src={avatarPreview ?? undefined}
            sx={{ width: 64, height: 64, fontSize: 20, fontWeight: 600 }}
          >
            {getInitials(user.firstName, user.lastName)}
          </Avatar>
          <Stack sx={{ gap: 1 }}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              hidden
              onChange={onAvatarChange}
            />
            <Button
              type="button"
              variant="outlined"
              size="small"
              disabled={avatarUploading}
              onClick={() => fileInputRef.current?.click()}
            >
              {avatarUploading ? "Загрузка…" : "Загрузить фото"}
            </Button>
            {avatarErr && (
              <Alert severity="error" sx={{ py: 0 }}>
                {avatarErr}
              </Alert>
            )}
          </Stack>
        </Stack>
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
        <UserFioAutocomplete
          value={fioInput}
          onInputChange={setFioInput}
          options={fioOptions}
          loading={fioLoading}
          onSelect={(option) => {
            applyFioParts({
              surname: option.surname,
              name: option.name,
              patronymic: option.patronymic,
              value: option.value,
            });
          }}
        />

        <Button
          type="button"
          variant="outlined"
          size="small"
          disabled={cleanFioLoading || fioInput.trim().length < 2}
          onClick={async () => {
            const cleaned = await runCleanFio();
            if (!cleaned) return;
            applyFioParts({
              surname: cleaned.surname,
              name: cleaned.name,
              patronymic: cleaned.patronymic,
              value: cleaned.result,
            });
          }}
        >
          Проверить ФИО
        </Button>

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
        <Controller
          name="jobTitle"
          control={form.control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Должность"
              type="text"
              size="small"
              fullWidth
              error={Boolean(fieldState.error)}
              helperText={fieldState.error?.message ?? "Можно не указывать"}
              onBlur={field.onBlur}
            />
          )}
        />
        <Controller
          name="whatsapp"
          control={form.control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="WhatsApp"
              type="text"
              size="small"
              fullWidth
              error={Boolean(fieldState.error)}
              helperText={fieldState.error?.message ?? "Можно не указывать"}
              onBlur={field.onBlur}
            />
          )}
        />
        <Controller
          name="telegram"
          control={form.control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Telegram"
              type="text"
              size="small"
              fullWidth
              error={Boolean(fieldState.error)}
              helperText={fieldState.error?.message ?? "Можно не указывать"}
              onBlur={field.onBlur}
            />
          )}
        />
        <Controller
          name="maxAccount"
          control={form.control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Max"
              type="text"
              size="small"
              fullWidth
              error={Boolean(fieldState.error)}
              helperText={fieldState.error?.message ?? "Можно не указывать"}
              onBlur={field.onBlur}
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
