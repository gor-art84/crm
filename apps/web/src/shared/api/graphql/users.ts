import { gql } from "@/generated";

export const GET_USERS = gql(`
  query GetUsers {
    users {
      id
      email
      firstName
      middleName
      lastName
      phone
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
      phone
      role
      isActive
    }
  }
`);

export const DEACTIVATE_USER = gql(`
  mutation DeactivateUser($userId: String!) {
    deactivateUser(userId: $userId) {
      id
      email
      firstName
      middleName
      lastName
      phone
      role
      isActive
    }
  }
`);

export const ACTIVATE_USER = gql(`
  mutation ActivateUser($userId: String!) {
    activateUser(userId: $userId) {
      id
      email
      firstName
      middleName
      lastName
      phone
      role
      isActive
    }
  }
`);

export const UPDATE_USER = gql(`
  mutation UpdateUser($userId: String!, $updateUserInput: UpdateUserInput!) {
    updateUser(userId: $userId, updateUserInput: $updateUserInput) {
      id
      email
      firstName
      middleName
      lastName
      phone
      role
      isActive
    }
  }
`);
