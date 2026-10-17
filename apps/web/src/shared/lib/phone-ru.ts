import parsePhoneNumberFromString from "libphonenumber-js";

export const normalizeRuPhone = (phoneNumber: string): string | null => {
  const trimmedPhone = phoneNumber.trim();
  if (trimmedPhone === "") return null;
  const parsedPhoneNumber = parsePhoneNumberFromString(trimmedPhone, "RU");
  if (!parsedPhoneNumber?.isValid()) {
    return null;
  }
  return parsedPhoneNumber.number;
};

export const formatRuPhoneMask = (phoneNumber: string): string => {
  // 1) только цифры
  let digits = phoneNumber.replace(/\D/g, "");

  if (digits.length === 0) {
    return "";
  }

  // 2) к виду 7XXXXXXXXXX (макс. 11 цифр)
  if (digits.startsWith("8")) {
    digits = `7${digits.slice(1)}`;
  } else if (!digits.startsWith("7")) {
    digits = `7${digits}`;
  }
  digits = digits.slice(0, 11);

  // 3) код страны отдельно, остальное — 10 цифр абонента
  const rest = digits.slice(1); // без ведущей 7

  // 4) наращиваем маску по мере ввода
  let result = "+7";
  if (rest.length > 0) {
    result += ` (${rest.slice(0, 3)}`;
  }
  if (rest.length >= 3) {
    result += ")";
  }
  if (rest.length > 3) {
    result += ` ${rest.slice(3, 6)}`;
  }
  if (rest.length > 6) {
    result += `-${rest.slice(6, 8)}`;
  }
  if (rest.length > 8) {
    result += `-${rest.slice(8, 10)}`;
  }

  return result;
};
