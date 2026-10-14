import Container from '@/components/ui/Container';

const STATS = [
  { value: '21', label: 'Skill categories' },
  { value: '3 km', label: 'Search radius' },
  { value: '5', label: 'Languages' },
  { value: '20', label: 'J&K districts' },
];

export default function TrustBar() {
  return (
    <section className="border-y border-gray-100 bg-white">
      <Container className="py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl md:text-4xl font-extrabold tracking-tight text-brand-700">{s.value}</div>
              <div className="text-xs uppercase tracking-wider text-gray-500 mt-1 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
