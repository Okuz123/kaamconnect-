import Link from 'next/link';
import Container from './ui/Container';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-gray-100 bg-white">
      <Container className="py-14 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div className="col-span-2 md:col-span-1">
          <div className="font-extrabold text-lg text-brand-700 mb-2">KaamConnect</div>
          <p className="text-gray-500 leading-relaxed">Local Skills. Real Work. One Platform.</p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 mb-3 text-xs uppercase tracking-wider">Company</h4>
          <ul className="space-y-2.5 text-gray-600">
            <li><Link href="/about" className="hover:text-brand-600">About</Link></li>
            <li><Link href="/contact" className="hover:text-brand-600">Contact</Link></li>
            <li><Link href="/faq" className="hover:text-brand-600">FAQ</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 mb-3 text-xs uppercase tracking-wider">Legal</h4>
          <ul className="space-y-2.5 text-gray-600">
            <li><Link href="/terms" className="hover:text-brand-600">Terms</Link></li>
            <li><Link href="/privacy" className="hover:text-brand-600">Privacy</Link></li>
            <li><Link href="/refund-policy" className="hover:text-brand-600">Refund Policy</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 mb-3 text-xs uppercase tracking-wider">Support</h4>
          <ul className="space-y-2.5 text-gray-600">
            <li><Link href="/support" className="hover:text-brand-600">Help Centre</Link></li>
            <li><Link href="/safety" className="hover:text-brand-600">Safety</Link></li>
            <li><Link href="/worker-terms" className="hover:text-brand-600">Worker Terms</Link></li>
          </ul>
        </div>
      </Container>
      <div className="border-t border-gray-100 py-6 text-center text-xs text-gray-500">
        © 2026 KaamConnect. All rights reserved.
      </div>
    </footer>
  );
}
