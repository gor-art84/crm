import { Box, Chip } from "@mui/material";
import type { Theme } from "@mui/material/styles";

export type StatusTone = "success" | "warning" | "error" | "neutral";

const getToneColors = (theme: Theme, tone: StatusTone) => {
  if (tone === "neutral") {
    return {
      background: theme.vars.palette.action.selected,
      text: theme.vars.palette.text.secondary,
      textDark: theme.vars.palette.text.secondary,
      dot: theme.vars.palette.text.disabled,
    };
  }
  const palette = theme.vars.palette[tone];
  return {
    background: `rgba(${palette.mainChannel} / 0.12)`,
    text: palette.dark,
    textDark: palette.light,
    dot: palette.main,
  };
};

type StatusChipProps = {
  label: string;
  tone: StatusTone;
};

export const StatusChip = ({ label, tone }: StatusChipProps) => (
  <Chip
    size="small"
    label={label}
    icon={
      <Box
        component="span"
        sx={(theme) => ({
          width: 6,
          height: 6,
          borderRadius: "50%",
          bgcolor: getToneColors(theme, tone).dot,
        })}
      />
    }
    sx={(theme) => {
      const colors = getToneColors(theme, tone);
      return {
        backgroundColor: colors.background,
        color: colors.text,
        ...theme.applyStyles("dark", { color: colors.textDark }),
        borderRadius: "999px",
        border: 0,
        fontWeight: 500,
        "& .MuiChip-icon": {
          marginLeft: "8px",
          marginRight: "-2px",
        },
        width: "fit-content",
      };
    }}
  />
);
