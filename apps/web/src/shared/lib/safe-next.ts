const FALLBACK_URL = "/";

export const safeNext = (value: string | string[] | undefined) => {
  if (typeof value !== "string") {
    return FALLBACK_URL;
  }
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) {
    return FALLBACK_URL;
  }
  return value;
};
