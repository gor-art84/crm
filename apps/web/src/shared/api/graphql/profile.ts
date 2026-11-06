import { gql } from "@/generated";

export const UPDATE_MY_PROFILE = gql(`
  mutation UpdateMyProfile($input: UpdateMyProfileInput!) {
    updateMyProfile(input: $input) {
      id
      email
      firstName
      middleName
      lastName
      role
      jobTitle
      avatarUrl
      phone
      telegram
      whatsapp
      maxAccount
      birthDate
    }
  }
`);

export const CHANGE_PASSWORD = gql(`
  mutation ChangePassword($input: ChangePasswordInput!) {
    changePassword(input: $input)
  }
`);
