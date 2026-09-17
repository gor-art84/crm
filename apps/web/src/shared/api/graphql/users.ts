import { gql } from "@/generated";

export const GET_USERS = gql(`
  query GetUsers {
    users {
      id
      email
      firstName
      middleName
      lastName
      role
      isActive
    }
  }
`);
