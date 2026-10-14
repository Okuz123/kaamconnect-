'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Loader2 } from 'lucide-react';
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
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-2">Welcome back</h1>
      <p className="text-gray-500 mb-8">Sign in to continue to KaamConnect.</p>

      <button
        type="button"
        onClick={googleLogin}
        disabled={busy}
        className="w-full flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 disabled:opacity-60 font-semibold py-3 rounded-xl transition mb-5"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continue with Google
      </button>

      <div className="relative text-center text-xs text-gray-400 py-4">
        <span className="bg-white px-3 relative z-10 font-medium">OR</span>
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-200" />
      </div>

      <form onSubmit={submit} className="space-y-4">
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
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-sm font-semibold text-gray-700">Password</label>
            <Link href="/forgot-password" className="text-xs font-medium text-brand-600 hover:underline">Forgot?</Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-transparent rounded-xl text-sm focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition"
              placeholder="••••••••"
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
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="text-sm text-center text-gray-600 mt-6">
        Don't have an account? <Link href="/register" className="text-brand-600 hover:underline font-semibold">Register</Link>
      </p>
    </div>
  );
}
