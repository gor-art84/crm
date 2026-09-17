"use client";

import { useQuery } from "@apollo/client/react";
import { GET_USERS } from "@/shared/api/graphql/users";

export const UsersList = () => {
  const { data, loading, error } = useQuery(GET_USERS);

  if (loading) return <div>Loading...</div>;
  if (error || !data) return <div>Error: {error?.message}</div>;

  return (
    <div>
      <ul>
        {data?.users.map((user) => (
          <li key={user.id}>
            {user.firstName} {user.middleName} {user.lastName} ({user.role})
          </li>
        ))}
      </ul>
    </div>
  );
};
