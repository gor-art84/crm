import { FormControlLabel, Radio, RadioGroup, Stack, Typography } from "@mui/material";
import type { LucideIcon } from "lucide-react";
import type { ChangeEvent } from "react";

type Option<T extends string> = {
  value: T;
  label: string;
  description?: string;
  Icon: LucideIcon;
};

type OptionCardsProps<T extends string> = {
  options: readonly Option<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
};

export const OptionCards = <T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: OptionCardsProps<T>) => {
  const handleChange = (_e: ChangeEvent<HTMLInputElement>, raw: string) => {
    const option = options.find((opt) => opt.value === raw);
    if (option) onChange(option.value);
  };
  return (
    <RadioGroup
      onChange={handleChange}
      aria-label={ariaLabel}
      value={value}
      sx={{ flexDirection: { xs: "column", sm: "row" }, gap: 1.5 }}
    >
      {options.map(({ value: optionValue, label, description, Icon }) => (
        <FormControlLabel
          key={optionValue}
          value={optionValue}
          control={<Radio />}
          disableTypography
          label={
            <Stack component="span" direction="row" sx={{ gap: 1.5, alignItems: "flex-start" }}>
              <Icon size={20} strokeWidth={1.75} />
              <Stack component="span">
                <Typography component="span" variant="body2">
                  {label}
                </Typography>
                {description && (
                  <Typography variant="caption" color="text.secondary">
                    {description}
                  </Typography>
                )}
              </Stack>
            </Stack>
          }
          sx={{
            m: 0,
            flex: 1,
            alignItems: "flex-start",
            p: 1.5,
            border: 1,
            borderRadius: 2,
            borderColor: optionValue === value ? "primary.main" : "divider",
            "&:has(input:focus-visible)": {
              outline: "2px solid",
              outlineColor: "primary.main",
              outlineOffset: 2,
            },
            "&:hover:not(:has(input:checked))": {
              borderColor: "text.secondary",
            },
            transition: (theme) =>
              theme.transitions.create("border-color", {
                duration: theme.transitions.duration.shortest,
              }),
          }}
        />
      ))}
    </RadioGroup>
  );
};
