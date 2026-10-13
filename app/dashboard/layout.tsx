import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('users')
    .select('primary_role, full_name, preferred_language')
    .eq('id', user.id)
    .single();

  const role = profile?.primary_role ?? 'customer';
  const name = profile?.full_name ?? user.email;

  const navFor = (r: string) => {
    if (r === 'admin' || r === 'manager') {
      return [
        { href: '/dashboard/admin', label: 'Overview' },
        { href: '/dashboard/admin/users', label: 'Users' },
        { href: '/dashboard/admin/bookings', label: 'Bookings' },
        { href: '/dashboard/admin/payments', label: 'Payments' },
        { href: '/dashboard/admin/disputes', label: 'Disputes' },
        { href: '/dashboard/admin/locations', label: 'Locations' },
        { href: '/dashboard/admin/languages', label: 'Languages' },
        { href: '/dashboard/admin/settings', label: 'Settings' },
      ];
    }
    if (r === 'worker' || r === 'both') {
      return [
        { href: '/dashboard/worker', label: 'Overview' },
        { href: '/dashboard/worker/profile', label: 'Profile' },
        { href: '/dashboard/worker/jobs', label: 'My Jobs' },
        { href: '/dashboard/worker/earnings', label: 'Earnings' },
      ];
    }
    return [
      { href: '/dashboard/customer', label: 'Overview' },
      { href: '/dashboard/customer/bookings', label: 'My Bookings' },
      { href: '/dashboard/customer/addresses', label: 'Addresses' },
    ];
  };

  const links = navFor(role);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 grid md:grid-cols-[220px_1fr] gap-6">
      <aside>
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
          <div className="text-xs text-gray-500">Signed in as</div>
          <div className="font-semibold text-gray-900 truncate">{name}</div>
          <div className="text-xs text-brand-600 capitalize mt-1">{role}</div>
        </div>
        <nav className="space-y-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </aside>
      <section>{children}</section>
    </div>
  );
}
