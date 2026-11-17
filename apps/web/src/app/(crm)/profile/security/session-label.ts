import dayjs from "dayjs";

export const describeDevice = (browser: string | null, os: string | null): string => {
  const parts = [browser, os].filter(Boolean);
  return parts.length > 0 ? parts.join(" · ") : "Неизвестное устройство";
};

const DEVICE_TYPE_LABEL: Record<string, string> = {
  mobile: "Телефон",
  desktop: "ПК",
  tablet: "Планшет",
};

export const describeDeviceType = (deviceType: string | null): string | null => {
  if (deviceType === null) {
    return null;
  }
  return DEVICE_TYPE_LABEL[deviceType] ?? deviceType;
};

export const formatIssuedAt = (issuedAt: string): string =>
  dayjs(issuedAt).format("DD.MM.YYYY HH:mm");

export const describeSessionMeta = (deviceType: string | null, issuedAt: string): string =>
  [describeDeviceType(deviceType), `Вход: ${formatIssuedAt(issuedAt)}`].filter(Boolean).join(" · ");
