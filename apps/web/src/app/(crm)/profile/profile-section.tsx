import { Box, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

type ProfileSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export const ProfileSection = ({ title, description, children }: ProfileSectionProps) => {
  return (
    <Box component="section" sx={{ px: 3.5, py: 3 }}>
      <Stack sx={{ gap: 2.5 }}>
        <Stack sx={{ gap: 0.5 }}>
          <Typography variant="subtitle1" component="h2" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          {description && (
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          )}
        </Stack>
        {children}
      </Stack>
    </Box>
  );
};
