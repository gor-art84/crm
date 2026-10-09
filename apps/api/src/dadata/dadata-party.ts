import { PartyStatus } from "../generated/prisma/enums.js";

export type DadataParty = {
  suggestions: {
    data: {
      kpp: string | null;
      management: {
        name: string | null;
        post: string | null;
      } | null;
      type: "LEGAL" | "INDIVIDUAL";
      state: {
        status: PartyStatus;
      } | null;
      name: {
        full_with_opf: string | null;
        short_with_opf: string | null;
      };
      inn: string | null;
      ogrn: string | null;
      okpo: string | null;
      okato: string | null;
      oktmo: string | null;
      okved: string | null;
      address: {
        value: string | null;
      } | null;
      emails: { value: string }[] | null;
      sites: { value: string }[] | null;
      phones: { value: string }[] | null;
      employee_count: number | null;
    };
  }[];
};
