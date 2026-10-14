import { createTheme } from "@mui/material/styles";

export const crmTheme = createTheme({
  cssVariables: true,
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: "#111318",
          contrastText: "#FFFFFF",
        },
        text: {
          primary: "#111318",
          secondary: "#5B616E",
          disabled: "#8A909C",
        },
        background: {
          default: "#F5F6F8",
          paper: "#FFFFFF",
        },
        divider: "#E3E6EB",
        success: {
          main: "#16A34A",
        },
        warning: {
          main: "#D97706",
        },
        error: {
          main: "#DC2626",
        },
        info: {
          main: "#2563EB",
        },
        grey: {
          50: "#F5F6F8",
          100: "#EEF0F3",
          200: "#E3E6EB",
          300: "#D0D4DB",
          400: "#A8AEB8",
          500: "#8A909C",
          600: "#5B616E",
          700: "#3D424C",
          800: "#24272E",
          900: "#111318",
        },
        action: {
          hover: "rgba(17, 19, 24, 0.04)",
          selected: "rgba(17, 19, 24, 0.07)",
        },
      },
    },
  },
  typography: {
    fontFamily: 'var(--font-geist-sans), system-ui, -apple-system, "Segoe UI", sans-serif',
    fontSize: 14,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 600,
    h1: {
      fontSize: "2rem",
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontSize: "1.5rem",
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: "-0.015em",
    },
    h3: {
      fontSize: "1.25rem",
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h4: {
      fontSize: "1rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: "0.875rem",
      lineHeight: 1.55,
    },
    body2: {
      fontSize: "0.8125rem",
      lineHeight: 1.5,
    },
    caption: {
      fontSize: "0.75rem",
    },
    button: {
      fontSize: "0.875rem",
      fontWeight: 500,
      textTransform: "none",
    },
  },
  shape: {
    borderRadius: 8,
  },
  focusVisible: true,
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: ({ theme }) => ({
          border: `1px solid ${theme.vars.palette.divider}`,
          borderRadius: 12,
          backgroundImage: "none",
        }),
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage:
            "radial-gradient(circle at 0% 0%, rgba(99, 115, 145, 0.12), transparent 45%), radial-gradient(circle at 100% 100%, rgba(170, 150, 125, 0.10), transparent 45%)",
          backgroundAttachment: "fixed",
          minHeight: "100vh",
        },
      },
    },
  },
});
