import Link from 'next/link';
import Container from '@/components/ui/Container';

export default function NotFound() {
  return (
    <Container className="py-20 md:py-28">
      <div className="max-w-md mx-auto text-center">
        <div className="text-8xl font-black text-brand-100 leading-none mb-4">404</div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Page not found</h1>
        <p className="text-gray-500 mb-8">The page you're looking for doesn't exist or has moved.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/" className="inline-flex bg-brand-600 hover:bg-brand-700 text-white font-bold px-6 py-3 rounded-xl shadow-sm">
            Go home
          </Link>
          <Link href="/workers" className="inline-flex border border-gray-200 hover:bg-gray-50 font-bold px-6 py-3 rounded-xl">
            Find workers
          </Link>
        </div>
      </div>
    </Container>
  );
}
