import { ClientType, PartyStatus } from "../generated/prisma/enums.js";

export type PartyPreview = {
  fullName: string;
  shortName: string | null;
  type: ClientType;
  inn: string;
  kpp: string | null;
  ogrn: string | null;
  okpo: string | null;
  okved: string | null;
  legalAddress: string | null;
  phone: string | null;
  email: string | null;
  directorName: string | null;
  directorPosition: string | null;
  website: string | null;
  status: PartyStatus | null;
  employeeCount: number | null;
};
