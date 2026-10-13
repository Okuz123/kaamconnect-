'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setError(null);
    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (err) { setError(err.message); return; }
    router.push('/dashboard');
    router.refresh();
  };

  const googleLogin = async () => {
    setBusy(true); setError(null);
    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (err) { setError(err.message); setBusy(false); }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <Link href="/forgot-password" className="text-xs text-brand-600 hover:underline">Forgot?</Link>
        </div>
        <input
          type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
          placeholder="••••••••"
        />
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}

      <button
        type="submit" disabled={busy}
        className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition"
      >
        {busy ? 'Signing in…' : 'Sign in'}
      </button>

      <div className="relative text-center text-xs text-gray-400 py-2">
        <span className="bg-white px-2 relative z-10">or</span>
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-200" />
      </div>

      <button
        type="button" onClick={googleLogin} disabled={busy}
        className="w-full border border-gray-300 hover:bg-gray-50 disabled:opacity-60 font-medium py-2.5 rounded-lg transition"
      >
        Continue with Google
      </button>

      <p className="text-sm text-center text-gray-600">
        Don't have an account? <Link href="/register" className="text-brand-600 hover:underline font-medium">Register</Link>
      </p>
    </form>
  );
}
