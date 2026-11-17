import { gql } from "@/generated";

export const MY_SESSIONS = gql(`
  query MySessions {
      mySessions {
      id
      isCurrent
      issuedAt
      browser
      os
      deviceType
      }
  }
`);

export const REVOKE_SESSION = gql(`
  mutation RevokeSession($id: ID!) {
      revokeSession(id: $id)
  }
`);
