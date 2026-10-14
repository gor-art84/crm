"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import { useState } from "react";
import { ME } from "@/shared/api/graphql/me";
import { ACTIVATE_USER, DEACTIVATE_USER, GET_USERS } from "@/shared/api/graphql/users";
import { CreateUserForm } from "./create-user-form";

export const UsersList = () => {
  const { data, loading, error } = useQuery(GET_USERS);
  const { data: meData } = useQuery(ME);

  const [deactivateUser, { error: deactivateError }] = useMutation(DEACTIVATE_USER, {
    refetchQueries: [{ query: GET_USERS }],
  });

  const [activateUser, { error: activateError }] = useMutation(ACTIVATE_USER, {
    refetchQueries: [{ query: GET_USERS }],
  });

  const [pendingUserId, setPendingUserId] = useState<string | null>(null);

  if (loading) return <div>Loading...</div>;
  if (error || !data) return <div>Error: {error?.message}</div>;

  const handleDeactivate = async (userId: string) => {
    setPendingUserId(userId);
    try {
      await deactivateUser({ variables: { userId } });
    } finally {
      setPendingUserId(null);
    }
  };

  const handleActivate = async (userId: string) => {
    setPendingUserId(userId);
    try {
      await activateUser({ variables: { userId } });
    } finally {
      setPendingUserId(null);
    }
  };

  return (
    <div>
      <ul>
        {data?.users.map((user) => (
          <li key={user.id}>
            {user.firstName} {user.middleName} {user.lastName} ({user.role}) isActive:
            {user.isActive ? "yes" : "no"}
            {user.isActive && meData?.me.id !== user.id && (
              <button
                type="button"
                onClick={() => handleDeactivate(user.id)}
                disabled={pendingUserId === user.id}
              >
                Деактивировать
              </button>
            )}
            {!user.isActive && (
              <button
                type="button"
                onClick={() => handleActivate(user.id)}
                disabled={pendingUserId === user.id}
              >
                Активировать
              </button>
            )}
          </li>
        ))}
      </ul>
      {deactivateError && <div>Error: {deactivateError.message}</div>}
      {activateError && <div>Error: {activateError.message}</div>}
      <CreateUserForm />
    </div>
  );
};
