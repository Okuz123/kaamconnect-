import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl text-brand-700">KaamConnect</Link>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
            <Link href="/workers">Find Workers</Link>
            <Link href="/jobs">Find Jobs</Link>
          </nav>
          <div className="flex gap-3">
            <Link href="/login" className="text-sm font-medium text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100">Login</Link>
            <Link href="/register" className="text-sm font-medium text-white bg-brand-600 px-4 py-2 rounded-lg hover:bg-brand-700">Register</Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
          Find Trusted Skilled Workers Near You
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Book plumbers, electricians, masons, mechanics, carpenters, painters, and other skilled professionals near your location.
        </p>
        <div className="flex justify-center gap-3 flex-wrap">
          <Link href="/workers" className="px-6 py-3 rounded-lg bg-brand-600 text-white font-medium hover:bg-brand-700">Find Workers</Link>
          <Link href="/register?role=worker" className="px-6 py-3 rounded-lg border border-gray-300 font-medium hover:bg-gray-100">Register as a Worker</Link>
        </div>
      </section>

      <footer className="border-t border-gray-200 py-8 text-center text-sm text-gray-500">
        © 2026 KaamConnect. All rights reserved.
      </footer>
    </main>
  );
}
