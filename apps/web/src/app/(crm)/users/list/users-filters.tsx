"use client";

import { Box, Button, InputAdornment, MenuItem, TextField } from "@mui/material";
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
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "repeat(2, minmax(0, 1fr))",
          md: hasActiveFilters
            ? "minmax(220px, 1fr) 180px 160px auto"
            : "minmax(220px, 1fr) 180px 160px",
        },
        gap: 1.5,
        alignItems: "center",
      }}
    >
      <TextField
        size="small"
        placeholder="Имя или email"
        sx={{ minWidth: 0, width: "100%", gridColumn: { xs: "1 / -1", md: "auto" } }}
        label="Поиск"
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
        sx={{ minWidth: 0, width: "100%" }}
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
        sx={{ minWidth: 0, width: "100%" }}
      >
        <MenuItem value="">Все</MenuItem>
        <MenuItem value="active">Активен</MenuItem>
        <MenuItem value="inactive">Отключён</MenuItem>
        <MenuItem value="archived">Архив</MenuItem>
      </TextField>
      {hasActiveFilters && (
        <Button
          size="small"
          variant="text"
          color="inherit"
          onClick={() => onChange({ q: "", role: "", status: "" })}
          sx={{
            gridColumn: { xs: "1 / -1", md: "auto" },
            justifySelf: "start",
          }}
        >
          Сбросить
        </Button>
      )}
    </Box>
  );
};
