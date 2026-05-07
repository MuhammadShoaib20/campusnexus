'use client';

import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { routing } from '@/i18n/routing';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();

  const switchLocale = (newLocale: string) => {
    // Replace current locale in pathname
    const pathname = window.location.pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(pathname);
  };

  return (
    <div className="flex items-center gap-1">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          onClick={() => switchLocale(loc)}
          className={`px-2 py-1 text-sm rounded ${locale === loc ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          {loc === 'en' ? 'English' : 'اردو'}
        </button>
      ))}
    </div>
  );
}