import { BadGatewayException, BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { emptyToNull } from "../common/empty-to-null.js";
import { trimInn } from "../common/trim-inn.js";
import { EnvConfig } from "../config/env.schema.js";
import { ClientType } from "../generated/prisma/enums.js";
import { RedisService } from "../redis/redis.service.js";
import { DadataParty } from "./dadata-party.js";
import { PartyPreview } from "./party-preview.js";

@Injectable()
export class DadataService {
  constructor(
    private readonly configService: ConfigService<EnvConfig, true>,
    private readonly redisService: RedisService,
  ) {}

  private getPartyPreview(data: DadataParty): PartyPreview[] {
    return data.suggestions.flatMap((suggestion) => {
      const fullName = suggestion.data.name.full_with_opf?.trim() ?? null;
      const inn = suggestion.data.inn?.trim() ?? null;
      if (!fullName || !inn) {
        return [];
      }
      return [
        {
          fullName: fullName,
          shortName: suggestion.data.name.short_with_opf ?? null,
          type:
            suggestion.data.type === "LEGAL"
              ? ClientType.LEGAL_ENTITY
              : ClientType.INDIVIDUAL_ENTREPRENEUR,
          inn: inn,
          kpp: suggestion.data.kpp,
          ogrn: suggestion.data.ogrn,
          okpo: suggestion.data.okpo,
          okved: suggestion.data.okved,
          legalAddress: suggestion.data.address?.value ?? null,
          phone: suggestion.data.phones?.[0]?.value ?? null,
          email: suggestion.data.emails?.[0]?.value ?? null,
          directorName: suggestion.data.management?.name ?? null,
          directorPosition: suggestion.data.management?.post ?? null,
          website: suggestion.data.sites?.[0]?.value ?? null,
          status: suggestion.data.state?.status ?? null,
          employeeCount: suggestion.data.employee_count ?? null,
        },
      ];
    });
  }

  previewSuggestion(suggestion: DadataParty["suggestions"][number]): PartyPreview | null {
    return this.getPartyPreview({ suggestions: [suggestion] })[0] ?? null;
  }

  private requestInit(body: unknown) {
    const apiKey = this.configService.get("DADATA_API_KEY");
    return {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${apiKey}`,
      },
      body: JSON.stringify(body),
    };
  }

  private async loadParty(inn: string): Promise<DadataParty> {
    const cachedData = await this.redisService.get(`dadata:party:${inn}`);
    if (!cachedData) {
      const suggestionsUrl = this.configService.get("DADATA_SUGGESTIONS_URL");
      const response = await fetch(suggestionsUrl, this.requestInit({ query: inn }));
      if (!response.ok) {
        throw new BadGatewayException("Failed to fetch party");
      }
      const data = await response.json();
      if (data.suggestions.length === 0) {
        throw new BadRequestException("Party not found");
      }
      await this.redisService.set(
        `dadata:party:${inn}`,
        JSON.stringify(data),
        this.configService.get("DADATA_TTL_SECONDS"),
      );
      return data;
    }
    return JSON.parse(cachedData);
  }

  async findPartyByInn(inn: string): Promise<PartyPreview[]> {
    const trimmedInn = trimInn(inn);
    if (!trimmedInn) {
      throw new BadRequestException("Invalid INN");
    }

    const data = await this.loadParty(trimmedInn);
    return this.getPartyPreview(data);
  }

  async snapshotParty(
    inn: string,
    kpp?: string | null,
  ): Promise<DadataParty["suggestions"][number] | null> {
    const trimmedInn = trimInn(inn);
    if (!trimmedInn) {
      throw new BadRequestException("Invalid INN");
    }
    try {
      const data = await this.loadParty(trimmedInn);
      return (
        data.suggestions.find((suggestion) => {
          const suggestionInn = suggestion.data.inn?.replace(/\D/g, "");
          const suggestionKpp = emptyToNull(suggestion.data.kpp) ?? null;
          return suggestionInn === trimmedInn && suggestionKpp === (emptyToNull(kpp) ?? null);
        }) ?? null
      );
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof BadGatewayException) {
        return null;
      }
      throw error;
    }
  }
}
