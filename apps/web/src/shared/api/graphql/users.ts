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
      avatarUrl
      role
      birthDate
      jobTitle
      telegram
      whatsapp
      maxAccount
      isActive
        archivedAt
      inviteStatus
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
      avatarUrl
      role
      birthDate
      jobTitle
      telegram
      whatsapp
      maxAccount
      isActive
      inviteStatus
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
      avatarUrl
      role
      birthDate
      jobTitle
      telegram
      whatsapp
      maxAccount
      isActive
      inviteStatus
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
      avatarUrl
      role
      birthDate
      jobTitle
      telegram
      whatsapp
      maxAccount
      isActive
      inviteStatus
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
      avatarUrl
      role
      birthDate
      jobTitle
      telegram
      whatsapp
      maxAccount
      isActive
      inviteStatus
    }
  }
`);

export const GET_USER_HISTORY = gql(`
  query GetUserHistory($userId: String!) {
      userHistory(userId: $userId) {
          id
          type
          createdAt
          actorUserId
          actorName
      }
  }
`);

export const ARCHIVE_USER = gql(`
  mutation ArchiveUser($userId: String!) {
      archiveUser(userId: $userId) {
          id
          isActive
          archivedAt
          __typename
      }
  }
`);

export const RESTORE_USER = gql(`
  mutation RestoreUser($userId: String!) {
      restoreUser(userId: $userId) {
          id
          isActive
          archivedAt
          __typename
      }
  }
`);
