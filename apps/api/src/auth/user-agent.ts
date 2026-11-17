import UAParser from "ua-parser-js";

export interface DeviceInfo {
  browser: string | null;
  os: string | null;
  deviceType: string | null;
}

export function describeUserAgent(userAgent: string | undefined): DeviceInfo {
  if (!userAgent) {
    return { browser: null, os: null, deviceType: null };
  }
  const result = new UAParser(userAgent).getResult();
  const major = result.browser.version?.split(".")[0];
  const browser = result.browser.name
    ? [result.browser.name, major].filter(Boolean).join(" ")
    : null;
  const os = result.os.name ?? null;
  const deviceType = result.device.type ?? (browser ? "desktop" : null);
  return { browser, os, deviceType };
}
