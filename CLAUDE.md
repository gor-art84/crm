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

## Delegation
Mentor mode: the main session (Opus) is the mentor — it writes plans and hints, the user writes the code. Subagents never decide: they execute a brief from the main session and report back; the main session reviews their output before anything reaches the user. Do not delegate code writing.

«проверь» flow: `verifier` runs the mechanical checks → main session reviews the diff for behavior changes → main session writes the commit message.

Delegate mechanical work to cheaper subagents:
- Broad codebase search (finding files, usages, conventions) → `Explore` (Haiku, user-level `~/.claude/agents/Explore.md`).
- Mechanical pre-commit checks (git diff, `tsc` for both apps, Biome) on «проверь» → `verifier` (Haiku, `.claude/agents/verifier.md`, local — `.claude/` is gitignored).
- Library/framework docs lookups (Context7, official docs, version-specific behavior) → `researcher` (Sonnet, user-level `~/.claude/agents/researcher.md`).
- Any other subagent without its own `model:` runs on Sonnet (`CLAUDE_CODE_SUBAGENT_MODEL` in `~/.claude/settings.json`).
- Stay in the main session: diff review for behavior changes, plans, architecture, commit messages. Green tsc/Biome is not a review — behavior regressions pass both.

## Architecture

### Configuration
Single root `.env` (template: `.env.example`) shared by both apps and Docker Compose. The API loads it via `ConfigModule` (`envFilePath: "../../.env"`) and validates it with the zod schema in `apps/api/src/config/env.schema.ts` — adding an env var means updating that schema and `.env.example`. Inject config as `ConfigService<EnvConfig, true>` and read with `get("X", { infer: true })`. `prisma.config.ts` and `prisma/seed.ts` load the same root `.env` themselves.

### Apps
App-specific architecture notes live in `apps/api/CLAUDE.md` and `apps/web/CLAUDE.md` (loaded when working in that app). Never hand-edit generated code: `apps/web/src/generated/`, `apps/api/src/generated/prisma`.
