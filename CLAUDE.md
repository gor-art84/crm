# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

pnpm 12.9.1 + Turborepo, Node `>=26.8.1 <27`. Workspace packages are `@apps/api` and `@apps/web` (use these names with `--filter`).

- Local infra (Postgres + Redis): `docker compose up -d` (ports/credentials come from root `.env`)
- Dev (API on :4200 + Next.js): `pnpm dev`; single app: `pnpm --filter @apps/api dev` / `pnpm --filter @apps/web dev`
- Build: `pnpm build`
- Lint/format (Biome, whole repo): `pnpm check` / `pnpm check:fix`
- Typecheck: `pnpm --filter @apps/api exec tsc --noEmit`, `pnpm --filter @apps/web exec tsc --noEmit`
- There is **no test runner configured** yet (no jest/vitest, no `*.spec.ts`).

### Prisma (run inside `@apps/api`)
- Generate client: `pnpm --filter @apps/api prisma:generate` (output: `apps/api/src/generated/prisma`; excluded from Biome)
- New migration: `pnpm --filter @apps/api prisma:migrate dev --name <name>` (the script is bare `prisma migrate`, so a subcommand is required)
- Format / validate / studio: `pnpm prisma:format`, `pnpm --filter @apps/api prisma:validate`, `pnpm prisma:studio`
- Seed admin user (needs `ADMIN_EMAIL`, `ADMIN_PASSWORD`): `pnpm prisma:seed`

### GraphQL codegen (web)
- `pnpm codegen` (or `pnpm codegen:watch`) — runs `graphql-codegen` in `@apps/web` against the **running** API at `http://localhost:4200/graphql/`. Start the API first after changing resolvers/DTOs, then regenerate `apps/web/src/generated/`.

### Git hooks
- pre-commit: `lint-staged` → `biome check --write` on staged files.
- commit-msg: commitlint, conventional commits with an enforced `scope-enum`: `api, web, auth, clients, users, dadata, db, redis, config, deps, docker, ci, tooling` (see `commitlint.config.js`). Scopes like `invites` or `mail` will be rejected unless added there.

## Architecture

### Configuration
Single root `.env` (template: `.env.example`) shared by both apps and Docker Compose. The API loads it via `ConfigModule` (`envFilePath: "../../.env"`) and validates it with the zod schema in `apps/api/src/config/env.schema.ts` — adding an env var means updating that schema and `.env.example`. Inject config as `ConfigService<EnvConfig, true>` and read with `get("X", { infer: true })`. `prisma.config.ts` and `prisma/seed.ts` load the same root `.env` themselves.

### API (`apps/api`, NestJS 12, ESM)
- ESM package: relative imports must use the `.js` extension (`./users.service.js`).
- GraphQL code-first (Apollo driver, `autoSchemaFile: true`, `sortSchema: true`) — the schema is derived from `@ObjectType`/`@InputType` DTOs in each module's `dto/`; there is no `.graphql` schema file. GQL context is `{ req, res }`.
- Global `ValidationPipe` with `whitelist` + `forbidNonWhitelisted`: every input field needs a class-validator decorator or the request is rejected.
- Prisma 7 with the `prisma-client` generator and `@prisma/adapter-pg`; schema is split across `prisma/*.prisma` (`schema.prisma` = generator/datasource, `user.prisma`, `client.prisma`). Import types/enums from `src/generated/prisma/*.js`, access DB via `PrismaService`.
- **Auth is cookie sessions in Redis, not JWT.** `AuthService.login` verifies argon2 hash and `SessionsService` creates a random session id stored at `sessionKey(id)` with idle TTL, plus a per-user set (`userSessionsKey`) used by `revokeAllSessions` (e.g. on deactivation). `SessionAuthGuard` reads the cookie named `COOKIE_NAME`, enforces `SESSION_ABSOLUTE_TIMEOUT_SECONDS` from `issuedAt`, refreshes idle TTL, and sets `request.session`.
- **Authorization:** protect resolvers/controllers with `@UseGuards(SessionAuthGuard, PermissionsGuard)` + `@Permissions(Permission.X)`. Effective permissions = role defaults (`auth/role-permissions.ts`, roles `ADMINISTRATOR | MANAGER | METHODIST`) combined with per-user `UserPermission` rows, resolved by `PermissionsService`. Use `getRequest(context)` to get the request for both HTTP and GraphQL contexts.
- Users without `passwordHash` are pending invites: `invites` module issues `UserInvite` tokens (stored hashed), computes invite status, and accepts them by setting the password. Mail goes through the `MAIL` injection token (`mail/mail.ts` interface); currently bound to `ConsoleMailService` (logs instead of sending).
- File uploads use REST, not GraphQL: `POST /users/:id/avatar` (multipart `file`) → `images` (sharp presets) → `storage` (`ObjectStorage` abstraction, S3-compatible Yandex Object Storage). The DB stores `avatarKey`; public URLs are built from `S3_PUBLIC_BASE_URL`.
- `dadata` wraps DaData (FIO suggestions/cleaning, party lookup by INN) with Redis caching (`DADATA_TTL_SECONDS`).

### Web (`apps/web`, Next.js 16 App Router, React 19)
- Apollo Client via `@apollo/client-integration-nextjs` (`app/providers/ApolloWrapper.tsx`), `credentials: "include"` so the session cookie is sent. API URL is currently hardcoded to `http://localhost:4200/graphql`.
- GraphQL operations live in `src/shared/api/graphql/*.ts`, written with the generated `gql` from `@/generated` (typed documents via client-preset). Don't hand-edit `src/generated/`.
- Route groups: `(auth)` (login, `invite/[token]`) and `(crm)` (wrapped in `widgets/app-shell`). No Next middleware/route protection exists on the web side; access control is enforced by the API.
- Feature-sliced-ish layout: `shared/{api,lib,model,ui}`, `widgets/`, page-local components colocated in `app/(crm)/<feature>/`.
- UI: MUI 9 (+ `@mui/x-date-pickers` with dayjs, RU locale helpers in `shared/lib`), forms with react-hook-form + zod (`*-schema.ts` next to the form). UI text is in Russian.

### Code style
Biome: 2-space indent, double quotes, line width 100, organize imports on. In `apps/api`, `useImportType` is disabled — keep value imports for classes used by Nest DI/decorators (don't convert them to `import type`).
