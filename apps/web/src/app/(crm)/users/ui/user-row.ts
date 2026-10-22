import type { GetUsersQuery } from "@/generated/graphql";

export type UserRow = GetUsersQuery["users"][number];
