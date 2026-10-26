export const DENSITIES = ["compact", "default"] as const;
export type Density = (typeof DENSITIES)[number];
export const DENSITY_COOKIE_NAME = "crm-density";

const YEAR_MS = 365 * 24 * 60 * 60 * 1000;

export const isDensity = (value: unknown): value is Density =>
  typeof value === "string" && (DENSITIES as readonly string[]).includes(value);

export const parseDensity = (value: string | undefined): Density =>
  isDensity(value) ? value : "default";

const saveDensityCookie = async (density: Density): Promise<void> => {
  if ("cookieStore" in window) {
    await window.cookieStore.set({
      name: DENSITY_COOKIE_NAME,
      value: density,
      path: "/",
      expires: Date.now() + YEAR_MS,
      sameSite: "lax",
    });
    return;
  }
  // biome-ignore lint/suspicious/noDocumentCookie: fallback for browsers without the Cookie Store API
  document.cookie = `${DENSITY_COOKIE_NAME}=${density}; path=/; max-age=${YEAR_MS / 1000}; samesite=lax`;
};

export const applyDensity = (density: Density): void => {
  const root = document.documentElement;
  if (density === "default") {
    delete root.dataset.density;
  } else {
    root.dataset.density = density;
  }
  saveDensityCookie(density).catch(() => {
    // cookie not saved: the attribute still applies until reload
  });
};
