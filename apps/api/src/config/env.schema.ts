import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),
  PORT: z.coerce.number().int().min(1024).max(65535).default(4200),
  CORS_ORIGIN: z.url(),
  SESSION_TTL_SECONDS: z.coerce.number().int().min(1),
  COOKIE_NAME: z.string().min(1).default("sessionId"),
  COOKIE_MAX_AGE_SECONDS: z.coerce.number().int().min(1),
  DATABASE_URL: z.url(),
  REDIS_URL: z.url(),
  // =============================== Dadata API =================================
  DADATA_API_KEY: z.string().min(1),
  DADATA_TTL_SECONDS: z.coerce.number().int().min(1),
  DADATA_SUGGESTIONS_URL: z.url(),
});

export type EnvConfig = z.infer<typeof envSchema>;
