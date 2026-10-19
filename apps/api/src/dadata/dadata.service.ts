import { BadGatewayException, BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { emptyToNull } from "../common/empty-to-null.js";
import { trimInn } from "../common/trim-inn.js";
import { EnvConfig } from "../config/env.schema.js";
import { ClientType } from "../generated/prisma/enums.js";
import { RedisService } from "../redis/redis.service.js";
import {
  DadataFioCleanInterface,
  DadataFioSuggestion,
  FioCleanResult,
  FioSuggestion,
} from "./dadata-fio.js";
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

  private requestInit(body: unknown, withSecret?: boolean) {
    const apiKey = this.configService.get("DADATA_API_KEY", { infer: true });
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Token ${apiKey}`,
    };
    if (withSecret) {
      headers["X-Secret"] = this.configService.get("DADATA_SECRET_KEY", { infer: true });
    }
    return {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
    };
  }

  private async loadParty(inn: string): Promise<DadataParty> {
    const cachedData = await this.redisService.get(`dadata:party:${inn}`);
    if (!cachedData) {
      const suggestionsUrl = this.configService.get("DADATA_SUGGESTIONS_URL", { infer: true });
      const response = await fetch(suggestionsUrl, this.requestInit({ query: inn }, false));
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
        this.configService.get("DADATA_TTL_SECONDS", { infer: true }),
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

  async suggestFio(query: string, count = 7): Promise<FioSuggestion[]> {
    const trimmedQuery = query.trim();
    if (trimmedQuery.length < 2) return [];
    const cacheKey = `dadata:fio:suggest:${trimmedQuery.toLowerCase()}`;
    const cachedData = await this.redisService.get(cacheKey);
    if (cachedData) return JSON.parse(cachedData);

    const response = await fetch(
      this.configService.get("DADATA_SUGGESTIONS_FIO", { infer: true }),
      this.requestInit({ query: trimmedQuery, count }, false),
    );

    if (!response.ok) {
      throw new BadGatewayException("Failed to fetch FIO suggestions");
    }

    const data = (await response.json()) as DadataFioSuggestion;
    const suggestions: FioSuggestion[] = data.suggestions.map((s) => ({
      value: s.value,
      surname: s.data.surname,
      name: s.data.name ?? null,
      patronymic: s.data.patronymic,
    }));
    await this.redisService.set(
      cacheKey,
      JSON.stringify(suggestions),
      this.configService.get("DADATA_TTL_SECONDS", { infer: true }),
    );
    return suggestions;
  }

  async cleanFio(query: string): Promise<FioCleanResult> {
    const trimmed = query.trim();
    if (!trimmed) throw new BadRequestException("FIO query is empty");

    const cacheKey = `dadata:fio:clean:${trimmed.toLowerCase()}`;
    const cached = await this.redisService.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const response = await fetch(
      this.configService.get("DADATA_CLEAN_NAME", { infer: true }),
      this.requestInit([trimmed], true), // массив + secret
    );
    if (!response.ok) {
      throw new BadGatewayException("Failed to clean FIO");
    }

    const data = (await response.json()) as DadataFioCleanInterface[];
    const item = data[0];
    if (!item) throw new BadRequestException("FIO clean result is empty");

    const result: FioCleanResult = {
      result: item.result,
      surname: item.surname,
      name: item.name,
      patronymic: item.patronymic,
      gender: item.gender,
      qc: item.qc,
    };

    await this.redisService.set(
      cacheKey,
      JSON.stringify(result),
      this.configService.get("DADATA_TTL_SECONDS", { infer: true }),
    );
    return result;
  }
}
