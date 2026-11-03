# Web (`apps/web`, Next.js 16 App Router, React 19)

- Apollo Client via `@apollo/client-integration-nextjs` (`app/providers/ApolloWrapper.tsx`), `credentials: "include"` so the session cookie is sent. API URL is currently hardcoded to `http://localhost:4200/graphql`.
- GraphQL operations live in `src/shared/api/graphql/*.ts`, written with the generated `gql` from `@/generated` (typed documents via client-preset). Don't hand-edit `src/generated/`.
- Route groups: `(auth)` (login, `invite/[token]`) and `(crm)` (wrapped in `widgets/app-shell`). No Next middleware/route protection exists on the web side; access control is enforced by the API.
- Feature-sliced-ish layout: `shared/{api,lib,model,ui}`, `widgets/`, page-local components colocated in `app/(crm)/<feature>/`.
- UI: MUI 9 (+ `@mui/x-date-pickers` with dayjs, RU locale helpers in `shared/lib`), forms with react-hook-form + zod (`*-schema.ts` next to the form). UI text is in Russian.
