import { gql } from "@/generated";

export const FIO_SUGGESTIONS = gql(`
  query FioSuggestions($query: String!, $count: Int) {
    fioSuggestions(query: $query, count: $count) {
      value
      name
      surname
      patronymic
    }
  }
  `);

export const CLEAN_FIO = gql(`
  query CleanFio($query: String!) {
    cleanFio(query: $query) {
      result
      surname
      name
      patronymic
      gender
      qc
    }
  }
`);
