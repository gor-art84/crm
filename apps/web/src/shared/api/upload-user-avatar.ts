export const uploadUserAvatar = async (
  userId: string,
  file: File,
): Promise<{ avatarUrl: string }> => {
  const body = new FormData();
  body.append("file", file);

  const res = await fetch(`http://localhost:4200/users/${userId}/avatar`, {
    method: "POST",
    body,
    credentials: "include",
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Не удалось загрузить аватар");
  }

  return res.json();
};
