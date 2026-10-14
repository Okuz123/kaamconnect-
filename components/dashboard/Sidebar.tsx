'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';

export default function Sidebar({ links, role, name }: { links: { href: string; label: string }[]; role: string; name: string }) {
  const pathname = usePathname();
  return (
    <aside className="space-y-4">
      <div className="bg-white border border-gray-100 rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-50 to-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm">
            {(name || 'U').split(' ').map((s) => s[0]).slice(0, 2).join('').toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-bold text-gray-900 truncate">{name}</div>
            <div className="text-xs text-brand-600 capitalize font-medium">{role}</div>
          </div>
        </div>
      </div>

      <nav className="bg-white border border-gray-100 rounded-2xl p-2">
        {links.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                'block px-3.5 py-2.5 rounded-xl text-sm font-medium transition',
                active ? 'bg-brand-50 text-brand-700' : 'text-gray-700 hover:bg-gray-50'
              )}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
