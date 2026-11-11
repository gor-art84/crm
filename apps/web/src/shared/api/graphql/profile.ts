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

export const UPDATE_MY_UI_SETTINGS = gql(`
  mutation UpdateMyUiSettings($input: UpdateMyUiSettingsInput!) {
    updateMyUiSettings(input: $input) {
      id
      themeMode
      density
    }
  }
`);

export const CHANGE_PASSWORD = gql(`
  mutation ChangePassword($input: ChangePasswordInput!) {
    changePassword(input: $input)
  }
`);

export const DELETE_MY_AVATAR = gql(`
  mutation DeleteMyAvatar {
    deleteMyAvatar {
      id
      avatarUrl
    }
  }
`);
