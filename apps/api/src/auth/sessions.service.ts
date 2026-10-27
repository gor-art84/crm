import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EnvConfig } from "../config/env.schema.js";
import { RedisService } from "../redis/redis.service.js";
import { RedisSessionData, sessionKey, userSessionsKey } from "./session.js";

@Injectable()
export class SessionsService {
  private readonly logger = new Logger(SessionsService.name);
  constructor(
    private readonly redisService: RedisService,
    private readonly configService: ConfigService<EnvConfig, true>,
  ) {}

  private get sessionIdleTimeoutSeconds(): number {
    return this.configService.get("SESSION_IDLE_TIMEOUT_SECONDS", {
      infer: true,
    });
  }

  private get sessionAbsoluteTimeoutSeconds(): number {
    return this.configService.get("SESSION_ABSOLUTE_TIMEOUT_SECONDS", {
      infer: true,
    });
  }

  async createSession(userId: string): Promise<string> {
    const sessionId = crypto.randomUUID();
    const sessionData: RedisSessionData = {
      userId,
      issuedAt: new Date().toISOString(),
    };
    await this.redisService.set(
      sessionKey(sessionId),
      JSON.stringify(sessionData),
      this.sessionIdleTimeoutSeconds,
    );
    await this.redisService.sAdd(userSessionsKey(userId), sessionId);
    await this.redisService.expire(userSessionsKey(userId), this.sessionAbsoluteTimeoutSeconds);
    return sessionId;
  }

  async readSession(sessionId: string): Promise<RedisSessionData | null> {
    const sessionData = await this.redisService.get(sessionKey(sessionId));
    if (!sessionData) {
      return null;
    }
    try {
      return JSON.parse(sessionData);
    } catch (error) {
      this.logger.error(`Error parsing session data: ${error}`);
      return null;
    }
  }

  async deleteSession(sessionId: string): Promise<void> {
    const sessionData = await this.readSession(sessionId);
    await this.redisService.del(sessionKey(sessionId));
    if (sessionData) {
      try {
        await this.redisService.sRem(userSessionsKey(sessionData.userId), sessionId);
      } catch (error) {
        this.logger.error(`Error removing session from user sessions set: ${error}`);
      }
    }
  }

  async touchSession(sessionId: string): Promise<void> {
    await this.redisService.expire(sessionKey(sessionId), this.sessionIdleTimeoutSeconds);
  }

  async revokeAllSessions(userId: string): Promise<void> {
    const sessionIds = await this.redisService.sMembers(userSessionsKey(userId));
    if (sessionIds.length === 0) {
      return;
    }

    const sessionKeys = sessionIds.map((sessionId) => sessionKey(sessionId));

    await this.redisService.del(sessionKeys);
    await this.redisService.del(userSessionsKey(userId));
  }

  async revokeOtherSessions(userId: string, currentSessionId: string) {
    const userSessions = await this.redisService.sMembers(userSessionsKey(userId));
    const sessionsToRevoke = userSessions.filter((session) => session !== currentSessionId);
    if (sessionsToRevoke.length > 0) {
      await this.redisService.del(sessionsToRevoke.map((sessionId) => sessionKey(sessionId)));
      await this.redisService.sRem(userSessionsKey(userId), sessionsToRevoke);
    }
  }
}
