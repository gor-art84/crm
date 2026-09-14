"use client";
import { useQuery } from "@apollo/client/react";
import { GET_HELLO } from "@/shared/api/graphql/hello";

export default function HelloProbe() {
  const { data, loading, error } = useQuery(GET_HELLO);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{data?.hello}</div>;
}
