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

export const CREATE_USER = gql(`
  mutation CreateUser($createUserInput: CreateUserInput!) {
    createUser(createUserInput: $createUserInput) {
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
