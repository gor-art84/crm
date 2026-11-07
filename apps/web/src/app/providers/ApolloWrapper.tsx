"use client";

import { ApolloLink, CombinedGraphQLErrors, HttpLink } from "@apollo/client";
import { ErrorLink } from "@apollo/client/link/error";
import {
  ApolloClient,
  ApolloNextAppProvider,
  InMemoryCache,
} from "@apollo/client-integration-nextjs";

function makeClient() {
  const httpLink = new HttpLink({
    // Use an absolute URL for SSR
    uri: "http://localhost:4200/graphql",
    credentials: "include",
    fetchOptions: {
      // Optional: Next.js-specific fetch options
      // Note: This doesn't work with `export const dynamic = "force-static"`
    },
  });

  const errorLink = new ErrorLink(({ error, operation }) => {
    if (!CombinedGraphQLErrors.is(error)) return;

    const unauthenticated = error.errors.some((e) => e.extensions?.code === "UNAUTHENTICATED");
    if (!unauthenticated) return;

    if (
      typeof window === "undefined" ||
      operation.operationName === "Login" ||
      window.location.pathname === "/login"
    )
      return;

    const next = window.location.pathname + window.location.search;
    window.location.assign(`/login?next=${encodeURIComponent(next)}`);
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([errorLink, httpLink]),
  });
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return <ApolloNextAppProvider makeClient={makeClient}>{children}</ApolloNextAppProvider>;
}
