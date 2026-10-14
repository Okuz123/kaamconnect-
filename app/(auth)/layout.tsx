import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      <div className="relative hidden lg:flex flex-col justify-between bg-gradient-to-br from-brand-700 via-brand-600 to-brand-700 text-white p-12 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-success-400/20 blur-3xl" />
        </div>
        <div className="relative">
          <Link href="/" className="font-extrabold text-xl tracking-tight">KaamConnect</Link>
        </div>
        <div className="relative space-y-6 max-w-md">
          <h2 className="text-3xl font-extrabold leading-tight">
            Local Skills. Real Work. One Platform.
          </h2>
          <p className="text-brand-100 leading-relaxed">
            Join thousands of workers and customers across Jammu &amp; Kashmir connecting every day.
          </p>
          <ul className="space-y-3 text-sm text-brand-50">
            <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-success-300" /> Verified workers</li>
            <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-success-300" /> Secure in-app payments</li>
            <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-success-300" /> 5 languages supported</li>
          </ul>
        </div>
        <div className="relative text-xs text-brand-200">© 2026 KaamConnect</div>
      </div>

      <div className="flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <Link href="/" className="lg:hidden block text-center font-extrabold text-xl text-brand-700 mb-8">KaamConnect</Link>
          {children}
        </div>
      </div>
    </div>
  );
}
