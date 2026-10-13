'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LanguageSwitcher from './LanguageSwitcher';
import { useLang } from '@/lib/i18n/useLang';
import { cn } from '@/lib/utils/cn';

export default function Navbar() {
  const pathname = usePathname();
  const { t } = useLang();

  const links = [
    { to: '/', label: t('nav.home') },
    { to: '/workers', label: t('nav.workers') },
    { to: '/jobs', label: t('nav.jobs') },
    { to: '/how-it-works', label: t('nav.how') },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="font-extrabold text-lg text-brand-700 tracking-tight flex-shrink-0">
          KaamConnect
        </Link>
        <nav className="hidden md:flex gap-1 flex-1">
          {links.map((l) => (
            <Link
              key={l.to}
              href={l.to}
              className={cn(
                'px-3 py-2 rounded-lg text-sm font-medium transition',
                pathname === l.to
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Link href="/login" className="hidden sm:inline-block text-sm font-medium text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-100">
            {t('nav.login')}
          </Link>
          <Link href="/register" className="text-sm font-medium text-white bg-brand-600 px-4 py-2 rounded-lg hover:bg-brand-700">
            {t('nav.register')}
          </Link>
        </div>
      </div>
    </header>
  );
}
