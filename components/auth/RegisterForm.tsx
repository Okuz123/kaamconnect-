'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

type Role = 'worker' | 'customer' | 'both';

export default function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [role, setRole] = useState<Role>((params.get('role') as Role) || 'customer');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setError(null);
    const supabase = createClient();

    const { data, error: err } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/dashboard` },
    });

    if (err) { setError(err.message); setBusy(false); return; }
    if (!data.user) { setError('Signup failed'); setBusy(false); return; }

    const { error: profileErr } = await supabase.from('users').insert({
      id: data.user.id,
      full_name: fullName,
      phone,
      email,
      primary_role: role,
    });

    if (profileErr) { setError(profileErr.message); setBusy(false); return; }

    setSuccess(true);
    setBusy(false);
    setTimeout(() => router.push('/dashboard'), 1500);
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✅</div>
        <h3 className="font-semibold text-gray-900 mb-2">Account created</h3>
        <p className="text-sm text-gray-600">Check your email to verify, then continue to your dashboard.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">I am joining as…</label>
        <div className="grid grid-cols-3 gap-2">
          {(['customer', 'worker', 'both'] as Role[]).map((r) => (
            <button
              key={r} type="button" onClick={() => setRole(r)}
              className={
                'py-2 px-3 rounded-lg border text-sm font-medium capitalize transition ' +
                (role === r
                  ? 'bg-brand-600 text-white border-brand-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400')
              }
            >{r}</button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
        <input
          required value={fullName} onChange={(e) => setFullName(e.target.value)}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
        <input
          type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)}
          placeholder="+91 98765 43210"
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input
          type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
          placeholder="Minimum 6 characters"
        />
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}

      <button
        type="submit" disabled={busy}
        className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition"
      >
        {busy ? 'Creating account…' : 'Create account'}
      </button>

      <p className="text-sm text-center text-gray-600">
        Already have an account? <Link href="/login" className="text-brand-600 hover:underline font-medium">Sign in</Link>
      </p>
    </form>
  );
}
