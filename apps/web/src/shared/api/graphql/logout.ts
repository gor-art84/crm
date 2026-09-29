import { gql } from "@/generated";

export const LOGOUT = gql(`
  mutation Logout {
    logout
  }
`);
