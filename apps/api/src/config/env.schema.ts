import { z } from "zod";

const SESSION_TIMEOUT_MAX_SECONDS = 60 * 60 * 24 * 30;

export const envSchema = z
  .object({
    NODE_ENV: z.enum(["development", "production", "test"]),
    PORT: z.coerce.number().int().min(1024).max(65535).default(4200),
    CORS_ORIGIN: z.url(),
    SESSION_IDLE_TIMEOUT_SECONDS: z.coerce.number().int().min(1).max(SESSION_TIMEOUT_MAX_SECONDS),
    COOKIE_NAME: z.string().min(1).default("sessionId"),
    SESSION_ABSOLUTE_TIMEOUT_SECONDS: z.coerce
      .number()
      .int()
      .min(1)
      .max(SESSION_TIMEOUT_MAX_SECONDS),
    DATABASE_URL: z.url(),
    REDIS_URL: z.url(),
    // =============================== Dadata API =================================
    DADATA_API_KEY: z.string().min(1),
    DADATA_SECRET_KEY: z.string().min(1),
    DADATA_TTL_SECONDS: z.coerce.number().int().min(1),
    DADATA_SUGGESTIONS_URL: z.url(),
    DADATA_SUGGESTIONS_FIO: z.url(),
    DADATA_CLEAN_NAME: z.url(),
    S3_ENDPOINT: z.url(),
    S3_REGION: z.string().min(1),
    S3_BUCKET: z.string().min(1),
    S3_ACCESS_KEY_ID: z.string().min(1),
    S3_SECRET_ACCESS_KEY: z.string().min(1),
    S3_PUBLIC_BASE_URL: z.url(),
    WEB_ORIGIN: z.url(),
  })
  .refine((data) => data.SESSION_IDLE_TIMEOUT_SECONDS <= data.SESSION_ABSOLUTE_TIMEOUT_SECONDS, {
    message:
      "SESSION_IDLE_TIMEOUT_SECONDS must not exceed SESSION_ABSOLUTE_TIMEOUT_SECONDS: the idle window is refreshed on every request, so a larger value never takes effect.",
    path: ["SESSION_IDLE_TIMEOUT_SECONDS"],
  });

export type EnvConfig = z.infer<typeof envSchema>;
