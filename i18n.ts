import { getRequestConfig } from 'next-intl/server';

export const locales = ['pl', 'en'] as const;
export type Locale = typeof locales[number];
export const defaultLocale: Locale = 'pl';

export default getRequestConfig(async ({ locale }) => {
  // Validate locale
  const isValidLocale = locales.includes(locale as Locale);
  const validLocale = isValidLocale ? (locale as Locale) : defaultLocale;

  // Load messages
  const messages = (await import(`./messages/${validLocale}.json`)).default;

  return {
    locale: validLocale,
    messages
  };
});
