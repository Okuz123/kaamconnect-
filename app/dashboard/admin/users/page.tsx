import { createClient } from '@/lib/supabase/server';
import Badge from '@/components/ui/Badge';

export default async function AdminUsers() {
  const supabase = createClient();
  const { data: rows } = await supabase
    .from('users')
    .select('id, full_name, phone, email, primary_role, account_status, created_at')
    .order('created_at', { ascending: false })
    .limit(200);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 mb-1">Users</h1>
        <p className="text-gray-500 text-sm">{rows?.length ?? 0} registered user{(rows?.length ?? 0) === 1 ? '' : 's'}</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        {(rows || []).length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">No users yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold">Name</th>
                  <th className="text-left px-5 py-3 font-semibold">Phone</th>
                  <th className="text-left px-5 py-3 font-semibold">Role</th>
                  <th className="text-left px-5 py-3 font-semibold">Status</th>
                  <th className="text-left px-5 py-3 font-semibold">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows!.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-gray-900">{u.full_name}</div>
                      <div className="text-xs text-gray-400">{u.email}</div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600">{u.phone || '—'}</td>
                    <td className="px-5 py-3.5">
                      <Badge tone={u.primary_role === 'admin' ? 'warning' : u.primary_role === 'worker' ? 'success' : 'brand'}>
                        {u.primary_role}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge tone={u.account_status === 'active' ? 'success' : 'neutral'}>{u.account_status}</Badge>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 text-xs">{new Date(u.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
