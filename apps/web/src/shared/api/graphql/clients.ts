import { gql } from "@/generated";

export const GET_CLIENTS = gql(`
  query GetClients {
    clients {
        id
        type
        fullName
        shortName
        inn
    }
  }
`);
