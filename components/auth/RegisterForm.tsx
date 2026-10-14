'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, User, Phone, Loader2, CheckCircle2, Briefcase, Users, UserCheck } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

type Role = 'customer' | 'worker' | 'both';

const ROLES: { key: Role; label: string; sub: string; Icon: any }[] = [
  { key: 'customer', label: 'Customer', sub: 'I need to hire', Icon: Users },
  { key: 'worker', label: 'Worker', sub: 'I want work', Icon: Briefcase },
  { key: 'both', label: 'Both', sub: 'Hire & work', Icon: UserCheck },
];

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
      email, password,
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
        <div className="w-16 h-16 bg-success-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-8 h-8 text-success-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Account created</h3>
        <p className="text-sm text-gray-500 mb-6">Redirecting to your dashboard…</p>
        <div className="flex justify-center">
          <Loader2 className="w-5 h-5 animate-spin text-brand-600" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-2">Create your account</h1>
      <p className="text-gray-500 mb-8">Join as a customer, worker, or both.</p>

      <form onSubmit={submit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">I am joining as</label>
          <div className="grid grid-cols-3 gap-2">
            {ROLES.map(({ key, label, sub, Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setRole(key)}
                className={
                  'flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-2 transition ' +
                  (role === key
                    ? 'bg-brand-50 border-brand-500 text-brand-700'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300')
                }
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-bold">{label}</span>
                <span className="text-[10px] text-gray-500">{sub}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full name</label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              required value={fullName} onChange={(e) => setFullName(e.target.value)}
              className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-transparent rounded-xl text-sm focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition"
              placeholder="Your full name"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone</label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)}
              className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-transparent rounded-xl text-sm focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition"
              placeholder="+91 98765 43210"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-transparent rounded-xl text-sm focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-transparent rounded-xl text-sm focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition"
              placeholder="Minimum 6 characters"
            />
          </div>
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-100 p-3 rounded-xl">{error}</div>
        )}

        <button
          type="submit" disabled={busy}
          className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl shadow-sm hover:shadow-md transition"
        >
          {busy && <Loader2 className="w-4 h-4 animate-spin" />}
          {busy ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="text-sm text-center text-gray-600 mt-6">
        Already have an account? <Link href="/login" className="text-brand-600 hover:underline font-semibold">Sign in</Link>
      </p>
    </div>
  );
}
