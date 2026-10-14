import Container from '@/components/ui/Container';
import HowItWorks from '@/components/home/HowItWorks';
import CTA from '@/components/home/CTA';

export const metadata = { title: 'How It Works — KaamConnect' };

export default function HowItWorksPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-brand-50 to-white py-16 md:py-20">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">
              How KaamConnect works
            </h1>
            <p className="text-lg text-gray-600">
              Simple, transparent, and local. From search to payment in a few taps.
            </p>
          </div>
        </Container>
      </section>
      <HowItWorks />
      <CTA />
    </>
  );
}
