# API (`apps/api`, NestJS 12, ESM)

Follow root `AGENTS.md`, including mentor mode: explain changes by file and step; the user writes application code unless they explicitly request edits.

- ESM package: relative imports must use the `.js` extension (`./users.service.js`).
- GraphQL code-first (Apollo driver, `sortSchema: true`) — the schema is derived from DTO decorators and resolvers. `autoSchemaFile: join(process.cwd(), "schema.gql")` writes `apps/api/schema.gql` when started from the API package. Change DTOs/resolvers, not the emitted schema. GQL context is `{ req, res }`.
- Web codegen and IDE GraphQL configuration read this local schema. After an API schema change, successfully start/restart the API, then run `pnpm --filter @apps/web codegen` from the repository root.
- Global `ValidationPipe` with `whitelist` + `forbidNonWhitelisted`: every input field needs a class-validator decorator or the request is rejected.
- Prisma 7 with the `prisma-client` generator and `@prisma/adapter-pg`; schema is split across `prisma/*.prisma` (`schema.prisma` = generator/datasource, `user.prisma`, `client.prisma`). Import types/enums from `src/generated/prisma/*.js`, access DB via `PrismaService`.
- **Auth is cookie sessions in Redis, not JWT.** `AuthService.login` verifies argon2 hash and `SessionsService` creates a random session id stored at `sessionKey(id)` with idle TTL, plus a per-user set (`userSessionsKey`) used by `revokeAllSessions` (e.g. on deactivation). `SessionAuthGuard` reads the cookie named `COOKIE_NAME`, enforces `SESSION_ABSOLUTE_TIMEOUT_SECONDS` from `issuedAt`, refreshes idle TTL, and sets `request.session`.
- Session lists expose `sha256(sessionId)` as the public id; never expose the raw cookie/session token. `listSessions` removes stale entries and returns the current session first, then newest first. User-agent data is saved at login and parsed on listing. Revoking the current session through `revokeSession` raises `BAD_USER_INPUT`; an unknown public id returns `false`.
- **Authorization:** protect resolvers/controllers with `@UseGuards(SessionAuthGuard, PermissionsGuard)` + `@Permissions(Permission.X)`. Effective permissions = role defaults (`auth/role-permissions.ts`, roles `ADMINISTRATOR | MANAGER | METHODIST`) combined with per-user `UserPermission` rows, resolved by `PermissionsService`. Use `getRequest(context)` to get the request for both HTTP and GraphQL contexts.
- Users without `passwordHash` are pending invites: `invites` module issues `UserInvite` tokens (stored hashed), computes invite status, and accepts them by setting the password. Mail goes through the `MAIL` injection token (`mail/mail.ts` interface); currently bound to `ConsoleMailService` (logs instead of sending).
- File uploads use REST, not GraphQL: `POST /users/:id/avatar` and self-service `POST /me/avatar` (multipart `file`) → `images` (sharp presets) → `storage` (`ObjectStorage` abstraction, S3-compatible Yandex Object Storage). The DB stores `avatarKey`; public URLs are built from `S3_PUBLIC_BASE_URL`.
- `dadata` wraps DaData (FIO suggestions/cleaning, party lookup by INN) with Redis caching (`DADATA_TTL_SECONDS`).
- Biome: in `apps/api`, `useImportType` is disabled — keep value imports for classes used by Nest DI/decorators (don't convert them to `import type`).

## Verification

- Typecheck from the root: `pnpm --filter @apps/api exec tsc --noEmit`. Use the root review flow on «проверь», including the web typecheck and Biome on changed supported files.
- For API behavior changes, describe or perform focused GraphQL/REST checks, including authorization and failure cases. Existing manual request collections live in `crm-api/`. Do not claim runtime verification from a typecheck alone.
- Environment configuration belongs in the root `.env`, `src/config/env.schema.ts`, and `.env.example`, as described in root `AGENTS.md`. Do not print credentials in reports.
