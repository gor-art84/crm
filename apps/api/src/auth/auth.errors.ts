export const AuthErrorCode = {
  INVALID_CURRENT_PASSWORD: "INVALID_CURRENT_PASSWORD",
  NEW_PASSWORD_SAME_AS_OLD: "NEW_PASSWORD_SAME_AS_OLD",
} as const;

export type AuthErrorCode = (typeof AuthErrorCode)[keyof typeof AuthErrorCode];
