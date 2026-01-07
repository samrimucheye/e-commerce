import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const locales = ['en', 'es', 'fr', 'de', 'ar', 'he', 'am'] as const;
export const localeNames: Record<string, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  ar: 'العربية',
  he: 'עברית',
  am: 'አማርኛ'
};

export const routing = defineRouting({
  locales,
  defaultLocale: 'en'
});

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
