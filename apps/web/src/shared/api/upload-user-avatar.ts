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

export const uploadMyAvatar = async (file: File): Promise<{ avatarUrl: string }> => {
  const body = new FormData();
  body.append("file", file);

  const res = await fetch("http://localhost:4200/me/avatar", {
    method: "POST",
    body,
    credentials: "include",
  });

  if (!res.ok) {
    const text = await res.text();
    let message = "Не удалось загрузить аватар";
    try {
      const parsed: { message?: string | string[] } = JSON.parse(text);
      if (typeof parsed.message === "string") {
        message = parsed.message;
      } else if (Array.isArray(parsed.message)) {
        message = parsed.message.join(", ");
      }
    } catch {}
    throw new Error(message);
  }

  return res.json();
};
