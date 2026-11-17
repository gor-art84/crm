import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GraphQLError } from "graphql";
import { EnvConfig } from "../config/env.schema.js";
import { RedisService } from "../redis/redis.service.js";
import { SessionObject } from "./dto/session.object.js";
import {
  isSessionExpired,
  publicSessionId,
  RedisSessionData,
  sessionKey,
  userSessionsKey,
} from "./session.js";
import { describeUserAgent } from "./user-agent.js";

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

  async createSession(userId: string, userAgent?: string): Promise<string> {
    const sessionId = crypto.randomUUID();
    const sessionData: RedisSessionData = {
      userId,
      issuedAt: new Date().toISOString(),
      userAgent: userAgent?.slice(0, 255),
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

  async revokeSession(
    userId: string,
    currentSessionId: string,
    publicId: string,
  ): Promise<boolean> {
    if (publicId === publicSessionId(currentSessionId)) {
      throw new GraphQLError("Текущий сеанс нельзя завершить — используйте выход", {
        extensions: {
          code: "BAD_USER_INPUT",
        },
      });
    }
    const sessionIds = await this.redisService.sMembers(userSessionsKey(userId));
    const target = sessionIds.find((id) => publicSessionId(id) === publicId);
    if (!target) {
      return false;
    }
    await this.redisService.del(sessionKey(target));
    await this.redisService.sRem(userSessionsKey(userId), target);
    return true;
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

  async revokeOtherSessions(userId: string, currentSessionId: string): Promise<number> {
    const userSessions = await this.redisService.sMembers(userSessionsKey(userId));
    const sessionsToRevoke = userSessions.filter((session) => session !== currentSessionId);
    if (sessionsToRevoke.length === 0) {
      return 0;
    }
    const sessionKeys = sessionsToRevoke.map((sessionId) => sessionKey(sessionId));
    const revokedCount = await this.redisService.del(sessionKeys);
    await this.redisService.sRem(userSessionsKey(userId), sessionsToRevoke);
    return revokedCount;
  }

  async listSessions(userId: string, currentSessionId: string): Promise<SessionObject[]> {
    const sessionIds = await this.redisService.sMembers(userSessionsKey(userId));
    if (sessionIds.length === 0) return [];

    const raw = await this.redisService.mGet(sessionIds.map(sessionKey));
    const alive: SessionObject[] = [];
    const dead: string[] = [];

    sessionIds.forEach((id, i) => {
      const value = raw[i];
      if (value === null) {
        dead.push(id);
        return;
      }
      try {
        const sessionData = JSON.parse(value) as RedisSessionData;
        if (
          sessionData.userId !== userId ||
          isSessionExpired(sessionData.issuedAt, this.sessionAbsoluteTimeoutSeconds)
        ) {
          dead.push(id);
          return;
        }

        alive.push({
          id: publicSessionId(id),
          isCurrent: id === currentSessionId,
          issuedAt: new Date(sessionData.issuedAt),
          ...describeUserAgent(sessionData.userAgent),
        });
      } catch {
        dead.push(id);
      }
    });
    if (dead.length > 0) {
      await this.redisService.del(dead.map(sessionKey));
      await this.redisService.sRem(userSessionsKey(userId), dead);
    }
    alive.sort((a, b) => {
      if (a.isCurrent !== b.isCurrent) {
        return a.isCurrent ? -1 : 1;
      }
      return b.issuedAt.getTime() - a.issuedAt.getTime();
    });
    return alive;
  }
}
