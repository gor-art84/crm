# Web (`apps/web`, Next.js 16 App Router, React 19)

Follow root `AGENTS.md`, including mentor mode: give small steps with file paths, reasoning, and verification; the user writes application code unless they explicitly request edits.

- Apollo Client via `@apollo/client-integration-nextjs` (`app/providers/ApolloWrapper.tsx`), `credentials: "include"` so the session cookie is sent. API URL is currently hardcoded to `http://localhost:4200/graphql`.
- GraphQL operations live in `src/shared/api/graphql/*.ts`, written with the generated `gql` from `@/generated` (typed documents via client-preset). Don't hand-edit `src/generated/`.
- `codegen.ts` and `graphql.config.yml` read `../api/schema.gql`. Run `pnpm --filter @apps/web codegen` from the root after changing operations; after API schema changes, first refresh the schema by starting/restarting the API. Codegen maps GraphQL `DateTime` to `string` with `strictScalars: true`; convert dates explicitly where the UI needs date objects.
- Route groups: `(auth)` (login, `invite/[token]`) and `(crm)` (wrapped in `widgets/app-shell`). `src/proxy.ts` checks cookie presence for matched routes and redirects to `/login?next=...`; it does not validate the session. Its hardcoded `sessionId` cookie name must match API `COOKIE_NAME`.
- Apollo's error link redirects on GraphQL `extensions.code === "UNAUTHENTICATED"`, except during Login or on the login page. Validate the post-login destination with `safeNext`. The API enforces session validity and authorization; web redirects are only a navigation aid.
- Feature-sliced-ish layout: `shared/{api,lib,model,ui}`, `widgets/`, page-local components colocated in `app/(crm)/<feature>/`.
- UI: MUI 9 (+ `@mui/x-date-pickers` with dayjs, RU locale helpers in `shared/lib`), forms with react-hook-form + zod (`*-schema.ts` next to the form). UI text is in Russian.
- Reuse existing theme tokens and shared components. Keep the established restrained petrol accent, light/dark themes, and density settings. Check responsive layouts when changing page structure.
- Profile interface settings synchronize through `UiSettingsSync`, `useApplyUiSettings`, and `shared/lib/ui-settings.ts`. Preserve the existing server/local reconciliation rather than introducing a separate source of truth.
- Use Apollo's typed query/mutation results and existing cache/refetch patterns. Handle loading, empty, and error states. For animated dialogs/snackbars, keep displayed content stable during exit transitions.

## Verification

- Typecheck from the root: `pnpm --filter @apps/web exec tsc --noEmit`. Use the root review flow on «проверь», including the API typecheck and Biome on changed supported files.
- For UI behavior changes, check the relevant user flow, failure states, light/dark themes, and responsive layout as applicable. Use available browser/Next DevTools tools and report any checks not performed.
- Keep generated files updated through codegen. Do not replace generated types with hand-written operation types to work around stale generation.
