import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always' // All locales use prefix (/pl, /en)
});

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
