import { gql } from "@/generated";

export const ME = gql(`
  query Me {
    me {
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
