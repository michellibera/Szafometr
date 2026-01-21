'use client';

import { usePathname } from 'next/navigation';
import { locales } from '@/i18n';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const pathname = usePathname();

  // Extract current locale from URL pathname
  const segments = pathname.split('/').filter(Boolean);
  const currentLocale = segments.length > 0 && locales.includes(segments[0] as any)
    ? segments[0]
    : 'pl'; // default locale

  const switchLocale = (newLocale: string) => {
    // Guard - prevent switching to the same locale
    if (newLocale === currentLocale) return;

    // Save preference to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred-locale', newLocale);
    }

    // Remove current locale prefix from pathname
    const pathSegments = [...segments];
    if (pathSegments.length > 0 && locales.includes(pathSegments[0] as any)) {
      pathSegments.shift();
    }

    // Rebuild path with new locale
    const pathWithoutLocale = pathSegments.length > 0 ? `/${pathSegments.join('/')}` : '/';
    const newPath = `/${newLocale}${pathWithoutLocale}`;

    // Use window.location to force full page reload and load new translations
    window.location.href = newPath;
  };

  return (
    <div className="relative group">
      <button
        className="flex items-center gap-1.5 bg-white/30 backdrop-blur rounded px-2 py-1.5 hover:bg-white/40 transition-all"
        aria-label="Change language"
      >
        <Globe className="w-4 h-4 text-black/80" />
        <span className="text-sm font-medium text-black/80 uppercase">{currentLocale}</span>
      </button>

      <div className="absolute right-0 mt-2 bg-white/90 backdrop-blur rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 min-w-[140px]">
        {locales.map((loc) => (
          <button
            key={loc}
            onClick={() => switchLocale(loc)}
            disabled={currentLocale === loc}
            className={`block w-full px-4 py-2 text-sm text-left transition-colors first:rounded-t last:rounded-b ${
              currentLocale === loc
                ? 'font-bold bg-white/20 cursor-not-allowed opacity-70'
                : 'hover:bg-white/40 cursor-pointer'
            }`}
          >
            {loc === 'pl' ? '🇵🇱 Polski' : '🇬🇧 English'}
          </button>
        ))}
      </div>
    </div>
  );
}
