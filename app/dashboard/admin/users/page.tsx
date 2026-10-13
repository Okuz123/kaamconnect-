import { createClient } from '@/lib/supabase/server';

export default async function AdminUsers() {
  const supabase = createClient();
  const { data: rows } = await supabase
    .from('users')
    .select('id, full_name, phone, email, primary_role, account_status, created_at')
    .order('created_at', { ascending: false })
    .limit(200);

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Users</h1>
      <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="text-left px-4 py-2">Name</th>
              <th className="text-left px-4 py-2">Phone</th>
              <th className="text-left px-4 py-2">Role</th>
              <th className="text-left px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {(rows || []).map((u) => (
              <tr key={u.id}>
                <td className="px-4 py-2 font-medium">{u.full_name}</td>
                <td className="px-4 py-2 text-gray-500">{u.phone || '—'}</td>
                <td className="px-4 py-2 capitalize">{u.primary_role}</td>
                <td className="px-4 py-2"><span className="text-xs px-2 py-0.5 bg-gray-100 rounded">{u.account_status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
