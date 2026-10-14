import { gql } from "@/generated";

export const ME = gql(`
  query Me {
    me {
      id
      firstName
      lastName
      email
      role
    }
  }
`);
