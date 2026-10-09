export function emptyToNull(value: string | null | undefined) {
  const trimmedValue = value?.trim();
  return trimmedValue === "" ? null : trimmedValue;
}
