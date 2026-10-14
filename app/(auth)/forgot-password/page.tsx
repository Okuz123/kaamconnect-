'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Mail, Loader2, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setError(null);
    const supabase = createClient();
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    if (err) { setError(err.message); return; }
    setDone(true);
  };

  if (done) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-success-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-8 h-8 text-success-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h1>
        <p className="text-sm text-gray-500 mb-6">We sent a reset link to <strong>{email}</strong></p>
        <Link href="/login" className="text-brand-600 hover:underline text-sm font-semibold">← Back to login</Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-2">Reset password</h1>
      <p className="text-gray-500 mb-8">Enter your email and we'll send you a link.</p>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-transparent rounded-xl text-sm focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition"
            />
          </div>
        </div>

        {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-xl">{error}</div>}

        <button
          type="submit" disabled={busy}
          className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl shadow-sm hover:shadow-md transition"
        >
          {busy && <Loader2 className="w-4 h-4 animate-spin" />}
          {busy ? 'Sending…' : 'Send reset link'}
        </button>

        <Link href="/login" className="block text-center text-sm text-gray-600 hover:underline font-medium">
          Back to login
        </Link>
      </form>
    </div>
  );
}
