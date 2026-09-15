"use client";
import { useApolloClient, useMutation, useQuery } from "@apollo/client/react";
import Link from "next/link";
import { LOGOUT } from "@/shared/api/graphql/logout";
import { ME } from "@/shared/api/graphql/me";

export function SessionBar() {
  const [logout, { loading }] = useMutation(LOGOUT);
  const { data, loading: meLoading, error: meError } = useQuery(ME);
  const client = useApolloClient();

  const onLogout = async () => {
    try {
      await logout();
    } finally {
      client.cache.evict({ id: "ROOT_QUERY", fieldName: "me" });
      client.cache.gc();
    }
  };

  if (meLoading) {
    return <div>Loading...</div>;
  }

  if (meError || !data?.me) {
    return <Link href="/login">Login</Link>;
  }

  return (
    <div>
      <p>{data.me.email ?? `Logged in as ${data.me.email}`}</p>
      <button type="button" onClick={onLogout} disabled={loading}>
        Logout
      </button>
    </div>
  );
}
