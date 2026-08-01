import { getRequestConfig } from "next-intl/server";
import { DEFAULT_LOCALE, isLocale } from "@/lib/site";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = requested && isLocale(requested) ? requested : DEFAULT_LOCALE;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
