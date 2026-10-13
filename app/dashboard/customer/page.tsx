import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import StatCard from '@/components/dashboard/StatCard';

export default async function CustomerOverview() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: cp } = await supabase
    .from('customer_profiles')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();

  let bookingsCount = 0;
  let addressesCount = 0;

  if (cp) {
    const { count: b } = await supabase
      .from('bookings').select('id', { count: 'exact', head: true }).eq('customer_id', cp.id);
    bookingsCount = b ?? 0;

    const { count: a } = await supabase
      .from('customer_addresses').select('id', { count: 'exact', head: true }).eq('customer_id', cp.id);
    addressesCount = a ?? 0;
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Customer Dashboard</h1>
      <div className="grid sm:grid-cols-3 gap-3">
        <StatCard label="Bookings" value={bookingsCount} />
        <StatCard label="Saved addresses" value={addressesCount} />
        <StatCard label="Rating given" value="—" />
      </div>
      <div className="mt-6 grid sm:grid-cols-2 gap-3">
        <Link href="/workers" className="bg-white border border-gray-200 rounded-xl p-4 hover:border-brand-400">
          <div className="font-semibold">Find workers</div>
          <div className="text-sm text-gray-500">Browse nearby skilled pros</div>
        </Link>
        <Link href="/dashboard/customer/bookings" className="bg-white border border-gray-200 rounded-xl p-4 hover:border-brand-400">
          <div className="font-semibold">My bookings</div>
          <div className="text-sm text-gray-500">Track your job requests</div>
        </Link>
      </div>
    </div>
  );
}
