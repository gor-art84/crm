import { BadRequestException, Injectable } from "@nestjs/common";
import { emptyToNull } from "../common/empty-to-null.js";
import { trimInn } from "../common/trim-inn.js";
import { DadataService } from "../dadata/dadata.service.js";
import { ClientType, PartyStatus, Prisma } from "../generated/prisma/client.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { CreateClientInput } from "./dto/create-client.input.js";

@Injectable()
export class ClientsService {
  constructor(
    private readonly dadataService: DadataService,
    private readonly prismaService: PrismaService,
  ) {}

  async createClient(createClientInput: CreateClientInput) {
    const fullName = createClientInput.fullName.trim();
    let shortName = emptyToNull(createClientInput.shortName) ?? null;
    const inn = trimInn(createClientInput.inn ?? "");
    let kpp = emptyToNull(createClientInput.kpp) ?? null;
    let ogrn = emptyToNull(createClientInput.ogrn) ?? null;
    const lastName = emptyToNull(createClientInput.lastName) ?? null;
    const firstName = emptyToNull(createClientInput.firstName) ?? null;
    const middleName = emptyToNull(createClientInput.middleName) ?? null;
    let okpo = emptyToNull(createClientInput.okpo) ?? null;
    let okved = emptyToNull(createClientInput.okved) ?? null;
    let legalAddress = emptyToNull(createClientInput.legalAddress) ?? null;
    const actualAddress = emptyToNull(createClientInput.actualAddress) ?? null;
    let phone = emptyToNull(createClientInput.phone) ?? null;
    let email = emptyToNull(createClientInput.email) ?? null;
    let directorName = emptyToNull(createClientInput.directorName) ?? null;
    let directorPosition = emptyToNull(createClientInput.directorPosition) ?? null;
    let website = emptyToNull(createClientInput.website) ?? null;
    let status = createClientInput.status ?? null;
    let employeeCount = createClientInput.employeeCount ?? null;

    if (!fullName) {
      throw new BadRequestException("Full name is required");
    }

    if (createClientInput.type === ClientType.LEGAL_ENTITY) {
      if (inn?.length !== 10) {
        throw new BadRequestException("Invalid INN");
      }
    }
    if (createClientInput.type === ClientType.INDIVIDUAL_ENTREPRENEUR) {
      if (inn?.length !== 12) {
        throw new BadRequestException("Invalid INN");
      }
    }

    if (createClientInput.type === ClientType.INDIVIDUAL) {
      if (!lastName || !firstName) {
        throw new BadRequestException("Last name and first name are required");
      }
      kpp = null;
      ogrn = null;
    }

    let dadataJson: Prisma.JsonValue | null = null;

    if (
      createClientInput.captureDadata &&
      createClientInput.type !== ClientType.INDIVIDUAL &&
      inn
    ) {
      const suggestion = await this.dadataService.snapshotParty(inn, kpp);
      dadataJson = suggestion;
      if (suggestion) {
        const preview = this.dadataService.previewSuggestion(suggestion);
        if (preview) {
          shortName = shortName ?? preview.shortName;
          ogrn = ogrn ?? preview.ogrn;
          okpo = okpo ?? preview.okpo;
          okved = okved ?? preview.okved;
          legalAddress = legalAddress ?? preview.legalAddress;
          phone = phone ?? preview.phone;
          email = email ?? preview.email;
          website = website ?? preview.website;
          directorName = directorName ?? preview.directorName;
          directorPosition = directorPosition ?? preview.directorPosition;
          status = status ?? preview.status;
          employeeCount = employeeCount ?? preview.employeeCount;
        }
      }
      if (!ogrn && createClientInput.type === ClientType.INDIVIDUAL_ENTREPRENEUR) {
        throw new BadRequestException("Invalid OGRN");
      }
      if (status === PartyStatus.LIQUIDATED) {
        throw new BadRequestException("Client is liquidated");
      }
      if (status === PartyStatus.BANKRUPT) {
        throw new BadRequestException("Client is bankrupt");
      }
    }

    return this.prismaService.client.create({
      data: {
        fullName,
        shortName,
        lastName,
        firstName,
        middleName,
        okpo,
        okved,
        legalAddress,
        actualAddress,
        phone,
        email,
        directorName,
        directorPosition,
        website,
        type: createClientInput.type,
        status,
        inn,
        kpp,
        ogrn,
        employeeCount,
        dadataJson: dadataJson ?? Prisma.DbNull,
      },
      select: {
        id: true,
        fullName: true,
        shortName: true,
        lastName: true,
        firstName: true,
        middleName: true,
        okpo: true,
        okved: true,
        legalAddress: true,
        actualAddress: true,
        phone: true,
        email: true,
        directorName: true,
        directorPosition: true,
        website: true,
        type: true,
        status: true,
        inn: true,
        kpp: true,
        ogrn: true,
        employeeCount: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findMany() {
    return this.prismaService.client.findMany({
      select: {
        id: true,
        fullName: true,
        shortName: true,
        lastName: true,
        firstName: true,
        middleName: true,
        okpo: true,
        okved: true,
        legalAddress: true,
        actualAddress: true,
        phone: true,
        email: true,
        directorName: true,
        directorPosition: true,
        website: true,
        type: true,
        status: true,
        inn: true,
        kpp: true,
        ogrn: true,
        employeeCount: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async lookup(inn: string) {
    const trimmedInn = trimInn(inn);
    if (!trimmedInn) {
      throw new BadRequestException("Invalid INN");
    }

    const clients = await this.prismaService.client.findMany({
      where: {
        inn: trimmedInn,
      },
      select: {
        id: true,
        fullName: true,
        shortName: true,
        lastName: true,
        firstName: true,
        middleName: true,
        okpo: true,
        okved: true,
        legalAddress: true,
        actualAddress: true,
        phone: true,
        email: true,
        directorName: true,
        directorPosition: true,
        website: true,
        type: true,
        status: true,
        inn: true,
        kpp: true,
        ogrn: true,
        employeeCount: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (clients.length > 0) {
      return {
        clients,
        parties: [],
      };
    }

    const parties = await this.dadataService.findPartyByInn(trimmedInn);
    return {
      clients: [],
      parties,
    };
  }
}
