import { cn } from '@/lib/utils/cn';

type Tone = 'brand' | 'success' | 'warning' | 'neutral';

const TONES: Record<Tone, string> = {
  brand: 'bg-brand-50 text-brand-700 border-brand-100',
  success: 'bg-success-50 text-success-700 border-success-100',
  warning: 'bg-amber-50 text-amber-700 border-amber-100',
  neutral: 'bg-gray-100 text-gray-700 border-gray-200',
};

export default function Badge({ children, tone = 'neutral', className }: { children: React.ReactNode; tone?: Tone; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border', TONES[tone], className)}>
      {children}
    </span>
  );
}
