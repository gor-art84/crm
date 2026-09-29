import { gql } from "@/generated";

export const ME = gql(`
  query Me {
    me {
      id
      email
      role
    }
  }
`);
