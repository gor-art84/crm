import { Paper, Skeleton, Stack } from "@mui/material";
import { Suspense } from "react";
import { UsersList } from "./users-list";

const SKELETON_ROWS = ["row-1", "row-2", "row-3", "row-4", "row-5"];

export default function UsersPage() {
  return (
    <Suspense
      fallback={
        <Paper sx={{ p: 2 }}>
          <Stack sx={{ gap: 1.5 }}>
            {SKELETON_ROWS.map((row) => (
              <Skeleton key={row} height={40} variant="rounded" />
            ))}
          </Stack>
        </Paper>
      }
    >
      <UsersList />
    </Suspense>
  );
}
