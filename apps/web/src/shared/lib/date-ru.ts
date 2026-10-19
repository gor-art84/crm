import dayjs, { type Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

export const toDateInputValue = (value: unknown): string => {
  if (value == null || value === "") return "";
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    value instanceof Date ||
    dayjs.isDayjs(value)
  ) {
    const d = dayjs(value);
    return d.isValid() ? d.format("YYYY-MM-DD") : "";
  }
  return "";
};

export const toDayjs = (value: string): Dayjs | null => {
  if (!value) return null;
  const d = dayjs(value, "YYYY-MM-DD", true);
  return d.isValid() ? d.locale("ru") : null;
};
