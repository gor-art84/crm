"use client";

import { Autocomplete, TextField } from "@mui/material";
import type { FioSuggestionsQuery } from "@/generated/graphql";

type FioOption = FioSuggestionsQuery["fioSuggestions"][number] & { key: string };

type UserFioAutocompleteProps = {
  value: string;
  onInputChange: (value: string) => void;
  options: FioOption[];
  loading: boolean;
  onSelect: (option: FioOption) => void;
};

export const UserFioAutocomplete = ({
  value,
  onInputChange,
  options,
  loading,
  onSelect,
}: UserFioAutocompleteProps) => {
  return (
    <Autocomplete
      freeSolo
      options={options}
      filterOptions={(opts) => opts}
      getOptionKey={(option) => (typeof option === "string" ? option : option.key)}
      getOptionLabel={(option) => (typeof option === "string" ? option : option.value)}
      loading={loading}
      inputValue={value}
      onInputChange={(_, next) => onInputChange(next)}
      onChange={(_, next) => {
        if (!next || typeof next === "string") return;
        onSelect(next);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="ФИО"
          size="small"
          fullWidth
          placeholder="Иванов Иван Иванович"
          helperText="Начните вводить — подсказки DaData"
        />
      )}
    />
  );
};
