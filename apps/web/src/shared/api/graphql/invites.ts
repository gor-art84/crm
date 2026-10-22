import { gql } from "@/generated";

export const INVITE_PREVIEW = gql(`
  query InvitePreview($token: String!) {
    invitePreview(token: $token) {
      email
      firstName
    }
  }
`);

export const ACCEPT_INVITE = gql(`
  mutation AcceptInvite($input: AcceptInviteInput!) {
    acceptInvite(input: $input)
  }
`);

export const RESEND_INVITE = gql(`
  mutation ResendInvite($userId: String!) {
    resendInvite(userId: $userId)
  }
`);
