'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import LanguageSwitcher from './LanguageSwitcher';
import { useLang } from '@/lib/i18n/useLang';
import { cn } from '@/lib/utils/cn';
import Container from './ui/Container';

export default function Navbar() {
  const pathname = usePathname();
  const { t } = useLang();
  const [open, setOpen] = useState(false);

  const links = [
    { to: '/', label: t('nav.home') },
    { to: '/workers', label: t('nav.workers') },
    { to: '/jobs', label: t('nav.jobs') },
    { to: '/how-it-works', label: t('nav.how') },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/80 backdrop-blur-xl">
      <Container className="h-16 flex items-center justify-between gap-4">
        <Link href="/" className="font-extrabold text-lg text-brand-700 tracking-tight flex-shrink-0">
          KaamConnect
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              href={l.to}
              className={cn(
                'px-3.5 py-2 rounded-lg text-sm font-medium transition',
                pathname === l.to
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block"><LanguageSwitcher /></div>
          <Link href="/login" className="hidden sm:inline-block text-sm font-medium text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-50">
            {t('nav.login')}
          </Link>
          <Link href="/register" className="text-sm font-semibold text-white bg-brand-600 px-4 py-2 rounded-lg hover:bg-brand-700 shadow-sm hover:shadow-md transition">
            {t('nav.register')}
          </Link>
          <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </Container>

      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <Container className="py-3 space-y-1">
            {links.map((l) => (
              <Link key={l.to} href={l.to} onClick={() => setOpen(false)}
                className={cn('block px-3 py-2.5 rounded-lg text-sm font-medium',
                  pathname === l.to ? 'bg-brand-50 text-brand-700' : 'text-gray-700 hover:bg-gray-50')}>
                {l.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-gray-100 mt-2">
              <LanguageSwitcher />
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
