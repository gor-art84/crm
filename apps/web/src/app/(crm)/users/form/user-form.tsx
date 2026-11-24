"use client";

import { useApolloClient, useMutation } from "@apollo/client/react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { Camera } from "lucide-react";
import { type ChangeEvent, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { CREATE_USER, GET_USERS, UPDATE_USER } from "@/shared/api/graphql/users";
import { uploadUserAvatar } from "@/shared/api/upload-user-avatar";
import { toDateInputValue, toDayjs } from "@/shared/lib/date-ru";
import { formatFullName } from "@/shared/lib/person-name";
import { formatRuPhoneMask } from "@/shared/lib/phone-ru";
import { ROLE_LABELS } from "@/shared/model/roles";
import { UserAvatar } from "@/shared/ui/user-avatar";
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

  const onAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
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
      <Stack sx={{ flex: 1, minHeight: 0, overflowY: "auto", overscrollBehaviorY: "none" }}>
        {(errorCreate ?? errorUpdate) && (
          <Alert severity="error">{errorCreate?.message ?? errorUpdate?.message}</Alert>
        )}
        {isEdit && user && (
          <Stack direction="row" sx={{ gap: 1.5, alignItems: "center", mb: 2 }}>
            <Box sx={{ position: "relative" }}>
              <UserAvatar user={{ ...user, avatarUrl: avatarPreview }} size={56} />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                hidden
                onChange={onAvatarChange}
              />
              <IconButton
                type="button"
                aria-label={avatarUploading ? "Загрузка фото" : "Загрузить фото"}
                aria-busy={avatarUploading}
                disabled={avatarUploading}
                onClick={() => fileInputRef.current?.click()}
                sx={{
                  position: "absolute",
                  right: -2,
                  bottom: -2,
                  width: 36,
                  height: 36,
                  border: "2px solid",
                  borderColor: "background.paper",
                  bgcolor: "background.paper",
                  color: "primary.main",
                  "&:hover": { bgcolor: "action.hover" },
                }}
              >
                {avatarUploading ? <CircularProgress size={16} /> : <Camera size={17} />}
              </IconButton>
            </Box>
            <Stack sx={{ gap: 0.25, minWidth: 0 }}>
              <Typography variant="body1" sx={{ fontWeight: 600, overflowWrap: "anywhere" }}>
                {formatFullName(user).trim() || "Без имени"}
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ overflowWrap: "anywhere" }}>
                {user.email}
              </Typography>
              {avatarErr && (
                <Alert severity="error" sx={{ py: 0 }}>
                  {avatarErr}
                </Alert>
              )}
            </Stack>
          </Stack>
        )}

        <Stack sx={{ flex: 1, gap: 2 }}>
          <Stack component="section" aria-labelledby="user-form-main" sx={{ gap: 1.5 }}>
            <Typography
              id="user-form-main"
              component="h3"
              variant="subtitle1"
              sx={{ fontWeight: 600 }}
            >
              Основное
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: 1.5 }}>
              <Box sx={{ flex: "1 1 240px", minWidth: 0 }}>
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
              </Box>

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
                sx={{ flexShrink: 0, minWidth: 128, whiteSpace: "nowrap" }}
              >
                Проверить ФИО
              </Button>
            </Box>
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

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 160px), 1fr))",
                gap: 1.5,
                alignItems: "start",
              }}
            >
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
            </Box>

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
          </Stack>

          <Stack component="section" aria-labelledby="user-form-contacts" sx={{ gap: 1.5 }}>
            <Typography
              id="user-form-contacts"
              component="h3"
              variant="subtitle1"
              sx={{ fontWeight: 600 }}
            >
              Контакты
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Телефон и мессенджеры необязательны
            </Typography>

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

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 180px), 1fr))",
                gap: 1.5,
                alignItems: "start",
              }}
            >
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
                    helperText={fieldState.error?.message}
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
                    helperText={fieldState.error?.message}
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
                    helperText={fieldState.error?.message}
                    onBlur={field.onBlur}
                  />
                )}
              />
            </Box>
          </Stack>
          <Stack component="section" aria-labelledby="user-form-access" sx={{ gap: 1.5 }}>
            <Typography
              id="user-form-access"
              component="h3"
              variant="subtitle1"
              sx={{ fontWeight: 600 }}
            >
              Доступ
            </Typography>
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
          </Stack>
        </Stack>
      </Stack>
      <Stack
        direction="row"
        sx={{
          alignItems: "center",
          flexWrap: "wrap",
          flexShrink: 0,
          gap: 1,
          borderTop: "1px solid",
          borderColor: "divider",
          pt: 1.5,
        }}
      >
        {isEdit && form.formState.isDirty && (
          <Typography variant="caption" color="text.secondary">
            Есть несохранённые изменения
          </Typography>
        )}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, minmax(0, 1fr))",
              sm: "auto auto",
            },
            width: { xs: "100%", sm: "auto" },
            gap: 1,
            ml: "auto",
            "& > .MuiButton-root": {
              minHeight: { xs: 44, sm: 40 },
            },
          }}
        >
          <Button
            type="button"
            variant="text"
            color="inherit"
            onClick={onClose}
            sx={{
              bgcolor: "action.hover",
              "&:hover": { bgcolor: "action.selected" },
            }}
          >
            Отмена
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || form.formState.isSubmitting}
          >
            {isEdit ? "Сохранить" : "Создать"}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};
