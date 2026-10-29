import { gql } from "@/generated";

export const MY_PROFILE = gql(`
  query MyProfile {
    myProfile {
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
