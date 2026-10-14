import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Container from '@/components/ui/Container';
import Sidebar from '@/components/dashboard/Sidebar';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('users')
    .select('primary_role, full_name')
    .eq('id', user.id)
    .single();

  const role = profile?.primary_role ?? 'customer';
  const name = profile?.full_name ?? user.email ?? 'User';

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

  return (
    <Container className="py-8 md:py-10">
      <div className="grid md:grid-cols-[240px_1fr] gap-6">
        <Sidebar links={navFor(role)} role={role} name={name} />
        <section>{children}</section>
      </div>
    </Container>
  );
}
