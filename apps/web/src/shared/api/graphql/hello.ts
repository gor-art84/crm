import { gql } from "@/generated";

export const GET_HELLO = gql(`
    query Hello {
        hello
    }
`);
