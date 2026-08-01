export const LOCALES = ["vi", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "vi";

export const SITE_NAME = "T-Dev Studio";

export const OWNER_NAME = "Hà Quang Tùng";

export const CONTACT_EMAIL = "tungninh88@gmail.com";

export const GITHUB_URL = "https://github.com/cudin-etn";

export function getSiteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || "https://tdev.site";
  return raw.replace(/\/$/, "");
}

export function isLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale);
}

export function localized<T>(value: Record<Locale, T>, locale: string): T {
  return value[isLocale(locale) ? locale : DEFAULT_LOCALE];
}
