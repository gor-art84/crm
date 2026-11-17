# AGENTS.md

This file provides guidance to Codex when working in this repository. App-specific instructions are in `apps/api/AGENTS.md` and `apps/web/AGENTS.md`.

## Mentor mode

- Communicate in Russian. The user is learning and writes application code; the main session explains, plans, gives hints, and reviews.
- Break tasks into small sequential steps with exact file paths, the purpose of each change, and a way to verify it. Explain unfamiliar concepts and why an approach fits the existing code. Give focused examples when needed.
- Do not implement application changes unless the user explicitly asks you to edit or fix them. A request to check, explain, or help is a request for review and guidance. When edits are explicitly requested, complete that scope and explain the result.
- On «проверь», run the checks below, then review behavior yourself. Explain remaining issues and the next concrete step. After a successful review, propose a conventional commit message; do not commit or push unless asked.
- At a completed task or PR boundary, suggest a new session when useful and provide a short continuation prompt. Do not interrupt an unfinished step for this.

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
- `pnpm codegen` / `pnpm --filter @apps/web codegen` — generates `apps/web/src/generated/` from the local `apps/api/schema.gql` and web operations. A running API is not required if that schema exists and is current.
- The API emits `schema.gql` at startup from code-first DTOs/resolvers. After changing the API schema, start/restart the API successfully to refresh the file, then regenerate the web client.
- Direct watch command: `pnpm --filter @apps/web codegen:watch`. Root `pnpm dev` starts both apps and codegen watching; schema generation must still succeed for the schema file to be current.

### Git hooks
- pre-commit: `lint-staged` → `biome check --write` on staged files.
- commit-msg: commitlint, conventional commits with an enforced `scope-enum`: `api, web, auth, clients, users, dadata, db, redis, config, deps, docker, ci, tooling` (see `commitlint.config.js`). Scopes like `invites` or `mail` will be rejected unless added there.

## Delegation
Subagents execute a focused brief and report to the main session. The main session owns plans, architecture, behavioral review, and commit messages. Do not delegate code writing.

«проверь» flow: `verifier` runs the mechanical checks → main session reviews the diff for behavior changes → main session writes the commit message.

Delegate supporting work to the available roles:
- Broad codebase search (files, usages, conventions) → `Explore` (project `.codex/agents/Explore.toml`, GPT-6 Luna / high).
- Mechanical pre-commit checks on «проверь» → `verifier` (project `.codex/agents/verifier.toml`, GPT-6 Luna / high): inspect unstaged and staged diffs, run both app typechecks, and run Biome on changed files it supports. Checks are read-only; report failures without fixing them.
- Library/framework documentation (Context7, official docs, version-specific behavior) → `researcher` (project `.codex/agents/researcher.toml`, GPT-6.1 Sol / medium).
- Use the configured Codex models; Claude model names and environment variables do not configure these roles. If a role is unavailable, perform its checks directly and report that limitation.
- Green tsc/Biome is not a behavioral review. Review the actual diff, error paths, authorization, and relevant UI interactions in the main session. Report which runtime checks were actually performed.

## Tools and repository settings

- Project MCP configuration is in `.codex/config.toml` (MUI and Next DevTools). Use available WebStorm tools for IDE context, Context7/official docs for library questions, and browser tools when visual or interaction checks are needed.
- `.codex/` is currently not ignored by `.gitignore`. Keep project configuration portable and free of credentials; personal defaults belong in user-level configuration.
- Preserve existing staged and unstaged work. Stage, commit, push, or change Git configuration only when requested.

## Architecture

### Configuration
Single root `.env` (template: `.env.example`) shared by both apps and Docker Compose. The API loads it via `ConfigModule` (`envFilePath: "../../.env"`) and validates it with the zod schema in `apps/api/src/config/env.schema.ts` — adding an env var means updating that schema and `.env.example`. Inject config as `ConfigService<EnvConfig, true>` and read with `get("X", { infer: true })`. `prisma.config.ts` and `prisma/seed.ts` load the same root `.env` themselves.

### Apps
App-specific architecture notes live in `apps/api/AGENTS.md` and `apps/web/AGENTS.md` (loaded when working in that app). Never hand-edit generated code: `apps/web/src/generated/`, `apps/api/src/generated/prisma`.
