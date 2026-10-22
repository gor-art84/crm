"use client";

import { Button, InputAdornment, MenuItem, Stack, TextField } from "@mui/material";
import { Search } from "lucide-react";
import { ROLE_LABELS } from "@/shared/model/roles";
import type { UsersFiltersType } from "./filter-users";

type UsersFiltersProps = {
  value: UsersFiltersType;
  onChange: (next: UsersFiltersType) => void;
};

export const UsersFilters = ({ value, onChange }: UsersFiltersProps) => {
  const hasActiveFilters = Boolean(value.q.trim() || value.role || value.status);
  return (
    <Stack direction="row" sx={{ gap: 1.5, flexWrap: "wrap", alignItems: "center" }}>
      <TextField
        size="small"
        placeholder="Поиск по имени или email"
        sx={{ width: 240 }}
        value={value.q}
        onChange={(event) => {
          onChange({ ...value, q: event.target.value });
        }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Search size={16} strokeWidth={1.75} />
              </InputAdornment>
            ),
          },
        }}
      />
      <TextField
        select
        size="small"
        label="Роль"
        value={value.role}
        onChange={(event) =>
          onChange({ ...value, role: event.target.value as UsersFiltersType["role"] })
        }
        sx={{ minWidth: 180 }}
      >
        <MenuItem value="">Все роли</MenuItem>
        {Object.entries(ROLE_LABELS).map(([role, label]) => (
          <MenuItem key={role} value={role}>
            {label}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        size="small"
        label="Статус"
        value={value.status}
        onChange={(event) =>
          onChange({
            ...value,
            status: event.target.value as UsersFiltersType["status"],
          })
        }
        sx={{ minWidth: 160 }}
      >
        <MenuItem value="">Все</MenuItem>
        <MenuItem value="active">Активен</MenuItem>
        <MenuItem value="inactive">Отключён</MenuItem>
      </TextField>
      {hasActiveFilters && (
        <Button
          size="small"
          variant="text"
          color="inherit"
          onClick={() => onChange({ q: "", role: "", status: "" })}
        >
          Сбросить
        </Button>
      )}
    </Stack>
  );
};
