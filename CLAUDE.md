# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Package Management
- Install dependencies: `pnpm install`
- Update dependencies: `pnpm update`
- Run dev server: `pnpm dev` (starts both API and web apps)
- Build for production: `pnpm build`

### API Specific Commands
- Start API in dev mode: `pnpm --filter @crm/api dev`
- Run API tests: `pnpm --filter @crm/api test`
- Run API tests in watch mode: `pnpm --filter @crm/api test:watch`
- Format API code: `pnpm --filter @crm/api check:fix`
- Lint API code: `pnpm --filter @crm/api check`
- Generate Prisma client: `pnpm prisma:format` followed by `pnpm codegen`
- Run Prisma migrations: `pnpm prisma:migrate`
- Seed database: `pnpm prisma:seed`
- Open Prisma Studio: `pnpm prisma:studio`

### Web Specific Commands
- Start web app in dev mode: `pnpm --filter @crm/web dev`
- Run web app tests: `pnpm --filter @crm/web test`
- Build web app: `pnpm --filter @crm/web build`
- Format web code: `pnpm --filter @crm/web check:fix`
- Lint web code: `pnpm --filter @crm/web check`

### Code Quality
- Check entire codebase: `pnpm check`
- Fix linting issues: `pnpm check:fix`
- Run all tests: `pnpm test` (if defined in root)

## Architecture Overview

### Monorepo Structure
This is a Turborepo monorepo with two main applications:
- **API** (`/apps/api`): NestJS backend with GraphQL API
- **Web** (`/apps/web`): Next.js frontend application

### API Architecture (NestJS)
- **Entry point**: `src/main.ts`
- **Root module**: `src/app.module.ts`
- **Key modules**:
  - `auth`: Authentication and session management (JWT, Redis-backed sessions)
  - `users`: User management, profiles, and deactivation logic
  - `prisma`: Database access layer
  - `redis`: Redis service for session storage and caching
  - `common`: Shared utilities, guards, DTOs
  - `dadata`: Integration with DaData API for address validation

### Web Architecture (Next.js)
- **Entry point**: `src/app` (using App Router)
- **Key features**:
  - GraphQL API client (likely using Apollo or Urql)
  - Authentication context and route protection
  - Responsive UI components
  - Code generation for GraphQL types (`codegen.ts`)

### Shared Infrastructure
- **Prisma ORM**: Database schema in `/apps/api/prisma/schema.prisma`
- **TypeScript**: Both apps use strict TypeScript configuration
- **Biome**: Code formatting and linting configured via `biome.json`
- **Husky**: Git hooks for pre-commit checks
- **Turbo**: Monorepo task orchestration via `turbo.json`

### Data Flow
1. Web app makes GraphQL requests to API
2. API validates authentication via JWT tokens and Redis session storage
3. Business logic processed in NestJS services
4. Data persisted via Prisma to PostgreSQL
5. API returns GraphQL responses to web app

## Important Files and Conventions

### Environment Variables
- `.env.example`: Template for required environment variables
- Actual `.env` file should be created based on the template
- Key variables likely include database URLs, JWT secrets, Redis configuration

### Testing
- Tests are colocated with implementation files (e.g., `*.spec.ts`)
- Run single test file: `pnpm --filter @crm/api test src/users/users.service.spec.ts`
- Run specific test: Use Jest's test name pattern flag with the test command

### Code Style
- Follow Biome defaults configured in `biome.json`
- Prefer functional components and hooks in React
- Use NestJS decorators consistently for controllers, services, modules
- Keep DTOs separate from entities for API contracts

## Common Tasks

### Adding a New Feature
1. Generate Prisma migration if schema changes: `pnpm prisma:migrate --name "feature-name"`
2. Update API services and controllers
3. Update GraphQL schema if needed
4. Update web app components and queries/mutations
5. Add/update tests for new functionality
6. Run `pnpm check:fix` before committing

### Debugging
- Check API logs: Look for NestJS request logging in console
- Check web app dev tools for network requests and responses
- Verify environment variables are loaded correctly
- Check Prisma Studio for database state during debugging

### Deployment Preparation
1. Ensure all migrations are applied: `pnpm prisma:migrate`
2. Generate Prisma client: `pnpm codegen`
3. Build both apps: `pnpm build`
4. Test production build locally if possible