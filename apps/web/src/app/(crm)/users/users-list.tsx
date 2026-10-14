"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import { ME } from "@/shared/api/graphql/me";
import { DEACTIVATE_USER, GET_USERS } from "@/shared/api/graphql/users";
import { CreateUserForm } from "./create-user-form";

export const UsersList = () => {
  const { data, loading, error } = useQuery(GET_USERS);
  const { data: meData } = useQuery(ME);

  const [deactivateUser, { loading: deactivating, error: deactivateError }] = useMutation(
    DEACTIVATE_USER,
    { refetchQueries: [{ query: GET_USERS }] },
  );

  if (loading) return <div>Loading...</div>;
  if (error || !data) return <div>Error: {error?.message}</div>;

  const handleDeactivate = (userId: string) => {
    deactivateUser({ variables: { userId } });
  };

  return (
    <div>
      <ul>
        {data?.users.map((user) => (
          <li key={user.id}>
            {user.firstName} {user.middleName} {user.lastName} ({user.role}) isActive:
            {user.isActive}
            {user.isActive && meData?.me.id !== user.id && (
              <button
                type="button"
                onClick={() => handleDeactivate(user.id)}
                disabled={deactivating}
              >
                Деактивировать
              </button>
            )}
          </li>
        ))}
      </ul>
      {deactivateError && <div>Error: {deactivateError.message}</div>}
      <CreateUserForm />
    </div>
  );
};
