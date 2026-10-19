export interface DadataFioSuggestion {
  suggestions: Array<{
    value: string;
    unrestricted_value: string;
    data: {
      surname: string | null;
      name: string | null;
      patronymic: string | null;
      gender: string | null;
    };
  }>;
}

export interface DadataFioCleanInterface {
  source: string;
  result: string;
  surname: string | null;
  name: string | null;
  patronymic: string | null;
  gender: string | null;
  qc: number;
}

export interface FioSuggestion {
  value: string;
  surname: string | null;
  name: string | null;
  patronymic: string | null;
}

export interface FioCleanResult {
  result: string;
  surname: string | null;
  name: string | null;
  patronymic: string | null;
  gender: string | null;
  qc: number;
}
