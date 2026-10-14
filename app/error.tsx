'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import Container from '@/components/ui/Container';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <Container className="py-20">
      <div className="max-w-md mx-auto text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-red-50 flex items-center justify-center mb-5">
          <span className="text-3xl">⚠️</span>
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Something went wrong</h1>
        <p className="text-sm text-gray-500 mb-8">{error.message || 'An unexpected error occurred.'}</p>
        <div className="flex justify-center gap-3">
          <button onClick={reset} className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-5 py-3 rounded-xl">
            Try again
          </button>
          <Link href="/" className="border border-gray-200 hover:bg-gray-50 font-bold px-5 py-3 rounded-xl">
            Go home
          </Link>
        </div>
      </div>
    </Container>
  );
}
