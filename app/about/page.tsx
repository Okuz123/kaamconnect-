import Container from '@/components/ui/Container';
import { ShieldCheck, Users, Zap, Globe } from 'lucide-react';

export const metadata = { title: 'About — KaamConnect' };

export default function AboutPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-brand-50 to-white py-16 md:py-24">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">
              Local Skills. Real Work. One Platform.
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              KaamConnect connects skilled workers across Jammu &amp; Kashmir and India with the people who need them — directly, transparently, and near to home.
            </p>
          </div>
        </Container>
      </section>

      <Container className="py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { Icon: Users, title: 'Built for workers', desc: 'Free to join. Real work. Fair rates.' },
            { Icon: ShieldCheck, title: 'Trusted', desc: 'Verified profiles. Secure payments.' },
            { Icon: Zap, title: 'Local & fast', desc: 'Find workers within 3 km of you.' },
            { Icon: Globe, title: '5 languages', desc: 'English, Hindi, Urdu, Dogri, Kashmiri.' },
          ].map((f) => (
            <div key={f.title} className="bg-white border border-gray-100 rounded-2xl p-6">
              <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
                <f.Icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </>
  );
}
