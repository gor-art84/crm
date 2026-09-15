import { gql } from "@/generated";

export const LOGIN = gql(`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
        id
        email
        role
    }
  }
`);
